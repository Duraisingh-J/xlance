// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  createUserProfile,
  getUserProfile,
} from "../services/user_services";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);          // Firebase user
  const [userProfile, setUserProfile] = useState(null); // Firestore doc
  const [loading, setLoading] = useState(true);    // auth/profile loading
  const [error, setError] = useState(null);

  // Handle auth state + redirect result
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Handle Google redirect result (if any)
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult && redirectResult.user) {
          const firebaseUser = redirectResult.user;
          await createUserProfile(firebaseUser);
          const profile = await getUserProfile(firebaseUser.uid);
          if (!isMounted) return;
          setUser(firebaseUser);
          setUserProfile(profile);
        }
      } catch (err) {
        console.error("Error handling redirect result:", err);
      }

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true);
        setError(null);

        try {
          if (firebaseUser) {
            setUser(firebaseUser);
            // Ensure profile exists
            await createUserProfile(firebaseUser);
            const profile = await getUserProfile(firebaseUser.uid);
            if (!isMounted) return;
            setUserProfile(profile);
          } else {
            setUser(null);
            setUserProfile(null);
          }
        } catch (err) {
          console.error("Auth state error:", err);
          setError(err.message || "Authentication error");
        } finally {
          if (isMounted) setLoading(false);
        }
      });

      return unsubscribe;
    };

    const cleanupPromise = initAuth();

    return () => {
      isMounted = false;
      // unsubscribe when ready
      Promise.resolve(cleanupPromise).then((unsubscribe) => {
        if (typeof unsubscribe === "function") unsubscribe();
      });
    };
  }, []);

  const refreshUserProfile = async () => {
    if (!auth.currentUser) return null;
    const profile = await getUserProfile(auth.currentUser.uid);
    setUserProfile(profile);
    return profile;
  };

  // Development helper: login as a mock user (bypasses Firebase)
  // const loginAsMock = (mockProfile = {}) => {
  //   const mockUser = { uid: mockProfile.uid || 'mock-uid', email: mockProfile.email || 'mock@example.com' };
  //   setUser(mockUser);
  //   setUserProfile({
  //     uid: mockUser.uid,
  //     name: mockProfile.name || 'Mock User',
  //     email: mockProfile.email || mockUser.email,
  //     role: mockProfile.role || [],
  //     onboardingCompleted: !!mockProfile.onboardingCompleted,
  //     ...mockProfile,
  //   });
  //   setLoading(false);
  // };

  // const applyMockProfileUpdate = (data = {}) => {
  //   setUserProfile((prev) => ({ ...(prev || {}), ...data }));
  // };

  // Email sign-up
  const signUp = async (email, password, name) => {
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = cred.user;

      await createUserProfile(firebaseUser, { name });
      const profile = await getUserProfile(firebaseUser.uid);

      setUser(firebaseUser);
      setUserProfile(profile);

      return firebaseUser;
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err.message || "Sign up failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Email sign-in
  const signIn = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err.message || "Sign in failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Common helper for popup providers
  const signInWithProvider = async (provider) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Ensure profile exists; tolerate failures to read/write profile (e.g., offline)
      try {
        await createUserProfile(firebaseUser);
      } catch (e) {
        console.warn('createUserProfile failed after social sign-in:', e && e.message ? e.message : e);
      }

      let profile = null;
      try {
        profile = await getUserProfile(firebaseUser.uid);
      } catch (e) {
        console.warn('getUserProfile failed after social sign-in:', e && e.message ? e.message : e);
      }

      setUser(firebaseUser);
      setUserProfile(profile);

      return firebaseUser;
    } catch (err) {
      console.error("Social sign in error:", err);
      // Provide clearer messages for common auth errors
      const code = err && err.code ? String(err.code) : '';
      if (code.includes('operation-not-allowed')) {
        setError('This social provider is not enabled in Firebase Auth (operation-not-allowed).');
      } else if (code.includes('invalid-credential')) {
        setError('Invalid credentials returned from provider. Try again.');
      } else {
        setError(err.message || 'Social sign-in failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
    return signInWithProvider(googleProvider);
  };

  const signInWithGoogleRedirect = () => {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
    return signInWithRedirect(auth, googleProvider);
  };

  const signInWithApple = () => {
    const appleProvider = new OAuthProvider("apple.com");
    return signInWithProvider(appleProvider);
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error("Sign out error:", err);
      setError(err.message || "Sign out failed");
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithGoogleRedirect,
    signInWithApple,
    refreshUserProfile,
    // // dev helpers
    // loginAsMock,
    // applyMockProfileUpdate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};