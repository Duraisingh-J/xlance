import React from 'react';
import { Card, Button } from '../common';
import { Plus, Users, Clock, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Client Hub</h1>
            <p className="text-gray-500 mt-1">Manage your postings and active talent.</p>
          </div>
          <Link to="/post-job">
            <Button className="shadow-lg">
              <Plus size={18} className="mr-2" /> Post a New Job
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card hover={false} className="p-6 bg-white border-none shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Layout size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <h3 className="text-2xl font-bold text-gray-900">3</h3>
              </div>
            </div>
          </Card>
          <Card hover={false} className="p-6 bg-white border-none shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Talent Hired</p>
                <h3 className="text-2xl font-bold text-gray-900">12</h3>
              </div>
            </div>
          </Card>
          <Card hover={false} className="p-6 bg-white border-none shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Open Proposals</p>
                <h3 className="text-2xl font-bold text-gray-900">28</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Placeholder for list */}
        <Card className="p-12 text-center bg-white border-none shadow-sm h-64 flex flex-col items-center justify-center">
          <Users size={48} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Contracts</h3>
          <p className="text-gray-500 max-w-sm mx-auto">You haven't hired anyone yet. Start by reviewing your open job proposals.</p>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
