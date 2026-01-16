import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase User
  const [userProfile, setUserProfile] = useState(null); // Firestore Profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // MOCK AUTH STATE LISTENER
    const checkAuth = async () => {
      setLoading(true);
      try {
        const mockUser = authService.getCurrentUser();
        if (mockUser) {
          setUser(mockUser);
          const profile = await userService.getUserProfile(mockUser.uid);
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setError(null);
      } catch (err) {
        console.error("Mock Auth Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = async (email, password, name) => {
    const result = await authService.signup(email, password);
    setUser(result.user);
    // Create initial profile in Firestore (Mock)
    const newProfile = await userService.createUserProfile(result.user.uid, {
      email: result.user.email,
      name: name
    });
    setUserProfile(newProfile);
    return result.user;
  };

  const signIn = async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    const profile = await userService.getUserProfile(result.user.uid);
    setUserProfile(profile);
    return result.user;
  };

  const signInWithGoogle = async () => {
    const result = await authService.loginWithGoogle();
    setUser(result.user);
    // Check if profile exists, if not create it
    let profile = await userService.getUserProfile(result.user.uid);
    if (!profile) {
      profile = await userService.createUserProfile(result.user.uid, {
        email: result.user.email,
        name: result.user.displayName
      });
    }
    setUserProfile(profile);
    return result.user;
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
    setUserProfile(null);
  };

  const value = {
    user,
    userProfile, // Access this to check role/onboarding status
    setUserProfile, // Allow manual updates (used in Onboarding)
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile: async () => {
      if (user) {
        const profile = await userService.getUserProfile(user.uid);
        setUserProfile(profile);
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
