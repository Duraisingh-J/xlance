import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common';
import FreelancerDashboard from '../components/dashboard/FreelancerDashboard';
import ClientDashboard from '../components/dashboard/ClientDashboard';

const DashboardPage = () => {
  const { role } = useParams();
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingSpinner />
      </div>
    );
  }

  // Double check role matching
  const targetRole = role || 'freelancer';

  return (
    <div className="min-h-screen bg-gray-50 overflow-auto">
      {targetRole === 'freelancer' ? <FreelancerDashboard /> : <ClientDashboard />}
    </div>
  );
};

export default DashboardPage;
