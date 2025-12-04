import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, Footer, ScrollToTop, LoadingScreen } from './components/common';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import CreateProfilePage from './pages/CreateProfilePage';
import RoleSelectionPage from './pages/RoleSelectionPage';

const ProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }
  return <Outlet />;
};

const RoleHandler = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (userProfile && !userProfile.role) {
    return <Navigate to="/auth/select-role" replace />;
  }

  return <Outlet />;
}

const HomeWrapper = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // If the user is logged in, RoleHandler will decide where to send them.
  // If not logged in, they see the public homepage.
  return user ? <RoleHandler /> : <HomePage />;
}


function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth/signin' || location.pathname === '/auth/signup' || location.pathname === '/auth/select-role';

  return (
    <>
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeWrapper />}>
          {/* Nested route for dashboard access after role is confirmed */}
          <Route path="" element={<DashboardRedirect />} />
        </Route>
        
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/signin" element={<SignInPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/auth/select-role" element={<RoleSelectionPage />} />
          <Route path="/profile/create" element={<CreateProfilePage />} />
          <Route path="/dashboard/:role" element={<DashboardPage />} />
        </Route>

        {/* Add a catch-all or a 404 page if desired */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
}

const DashboardRedirect = () => {
  const { userProfile } = useAuth();
  // This component is only reached if the user is logged in and has a role.
  // It reads the role from the profile and redirects to the specific dashboard.
  if (userProfile?.role) {
    return <Navigate to={`/dashboard/${userProfile.role}`} replace />;
  }
  // Fallback while profile is loading or if role is somehow still null
  return <LoadingScreen />;
}


function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;