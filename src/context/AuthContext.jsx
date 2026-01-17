import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async (uid) => {
    try {
      const profile = await userService.getUserProfile(uid);
      setUserProfile(profile);
    } catch (err) {
      console.error("Error loading user profile:", err);
      setError("Failed to load user profile");
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setAuthLoading(true);
      try {
        const mockUser = authService.getCurrentUser();
        if (mockUser) {
          setUser(mockUser);
          await loadProfile(mockUser.uid);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        setError(err.message);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, [loadProfile]);

  const signUp = async (email, password, name) => {
    try {
      setAuthLoading(true);
      const result = await authService.signup(email, password);
      setUser(result.user);
      const newProfile = await userService.createUserProfile(result.user.uid, {
        email: result.user.email,
        name: name
      });
      setUserProfile(newProfile);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setAuthLoading(true);
      const result = await authService.login(email, password);
      setUser(result.user);
      await loadProfile(result.user.uid);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthLoading(true);
      const result = await authService.loginWithGoogle();
      setUser(result.user);

      let profile = await userService.getUserProfile(result.user.uid);
      if (!profile || profile.onboarded) {
        // If it's a new sign-up or we're using the mock that's pre-onboarded, we create/reset it
        profile = await userService.createUserProfile(result.user.uid, {
          email: result.user.email,
          name: result.user.displayName,
          onboarded: false,
          role: []
        });
      }
      setUserProfile(profile);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setAuthLoading(true);
      await authService.logout();
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    setUserProfile,
    authLoading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile: () => user ? loadProfile(user.uid) : Promise.resolve()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
