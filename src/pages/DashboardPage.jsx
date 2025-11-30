import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FreelancerDashboard, ClientDashboard } from '../components/dashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageTransition from '../components/common/PageTransition';

const DashboardPage = () => {
  const { role } = useParams();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (role !== 'freelancer' && role !== 'client') {
    return <Navigate to="/" replace />;
  }

  return (
    <PageTransition>
      <main className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {role === 'freelancer' ? <FreelancerDashboard /> : <ClientDashboard />}
        </div>
      </main>
    </PageTransition>
  );
};

export default DashboardPage;
