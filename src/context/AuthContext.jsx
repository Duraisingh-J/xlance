import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from 'firebase/auth';
// in src/context/AuthContext.jsx
import { auth } from "../firebase";

// in src/services/user_services.js
import { db } from "../firebase";

import { createUserProfile, getUserProfile } from '../services/user_services';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);
      if (user) {
        setUser(user);
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, name) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      await createUserProfile({ ...user, displayName: name });
      setUser(user);
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      return user;
    } catch (err) {
      console.error("Error during sign up:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (!auth || !auth.currentUser) return null;
    try {
      const profile = await getUserProfile(auth.currentUser.uid);
      setUserProfile(profile);
      return profile;
    } catch (err) {
      console.error('Failed to refresh user profile', err);
      return null;
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Error during sign in:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
      // This will create a profile if one doesn't exist.
      await createUserProfile(user);
      const profile = await getUserProfile(user.uid);
      setUser(user);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error during social sign in:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const signInWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithProvider(googleProvider);
  };
  
  const signInWithApple = () => {
    const appleProvider = new OAuthProvider('apple.com');
    return signInWithProvider(appleProvider);
  }

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("Error during sign out:", err);
      setError(err.message);
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
    signInWithApple,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
