import React from 'react';
import { Card, Button } from '../common';
import { MessageCircle, Bell } from 'lucide-react';
import PageTransition from '../common/PageTransition';
import { useAuth } from '../../context/AuthContext';

const FreelancerDashboard = () => {
  const { userProfile } = useAuth();
  const name = userProfile?.name || 'Priya';

  return (
    <PageTransition>
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome back, {name}! Here's an overview of your activity.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-sm text-gray-500">Total Earnings</h3>
              <p className="text-3xl font-bold text-gray-900 mt-3">₹8,50,230</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm text-gray-500">Active Projects</h3>
              <p className="text-3xl font-bold text-gray-900 mt-3">5</p>
            </Card>

            <Card className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-500">Profile Status</h3>
                <p className="text-green-600 font-semibold text-lg mt-2">100% Complete</p>
              </div>
            </Card>
          </div>

          {/* Messages and Notifications removed per request */}

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Job Recommendations</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-md flex items-center justify-between">
                <div>
                  <a className="text-primary-600 font-medium">Senior React Developer for Fintech App</a>
                  <p className="text-sm text-gray-600">A fast-growing fintech startup is looking for an experienced React developer to build their next-gen platform.</p>
                  <div className="flex gap-2 mt-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">React</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Fintech</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Remote</span>
                  </div>
                </div>
                <div>
                  <Button className="ml-4">View Details</Button>
                </div>
              </div>

              <div className="p-4 border rounded-md flex items-center justify-between">
                <div>
                  <a className="text-primary-600 font-medium">Graphic Designer for Social Media Content</a>
                  <p className="text-sm text-gray-600">Marketing agency needs a creative graphic designer to create engaging visuals for various social media platforms.</p>
                  <div className="flex gap-2 mt-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">Adobe Suite</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Social Media</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Part-time</span>
                  </div>
                </div>
                <div>
                  <Button className="ml-4">View Details</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
};

export default FreelancerDashboard;
