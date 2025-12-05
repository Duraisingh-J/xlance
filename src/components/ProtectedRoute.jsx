// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireOnboarded = true }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (requireOnboarded && (!userProfile || !userProfile.onboardingCompleted)) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;