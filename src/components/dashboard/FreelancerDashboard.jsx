import React, { useEffect, useState } from 'react';
import { Card, Button } from '../common';
import PageTransition from '../common/PageTransition';
import { useAuth } from '../../context/AuthContext';
import { proposalService } from '../../services/proposalService';
import { Link } from 'react-router-dom';

const FreelancerDashboard = () => {
  const { userProfile, user } = useAuth();
  const name = userProfile?.name || user?.displayName || 'Freelancer';
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      if (user) {
        try {
          const data = await proposalService.getProposalsByFreelancer(user.uid);
          setProposals(data);
        } catch (err) {
          console.error("Error fetching proposals:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProposals();
  }, [user]);

  return (
    <PageTransition>
      <main className="pt-28 pb-12 px-3 sm:px-5">
        <div className="max-w-[95%] xl:max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome back, {name}! Here's an overview of your activity.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-sm text-gray-500">Total Earnings</h3>
              <p className="text-3xl font-bold text-gray-900 mt-3">₹0</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm text-gray-500">Submitted Proposals</h3>
              <p className="text-3xl font-bold text-gray-900 mt-3">{proposals.length}</p>
            </Card>

            <Card className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-500">Profile Status</h3>
                <p className="text-green-600 font-semibold text-lg mt-2">100% Complete</p>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Your Recent Proposals</h2>
            <div className="space-y-4">
              {loading ? (
                <p>Loading proposals...</p>
              ) : proposals.length === 0 ? (
                <p className="text-gray-500">You haven't submitted any proposals yet. Go to "Find Work" to apply!</p>
              ) : (
                proposals.map(proposal => (
                  <div key={proposal.id} className="p-4 border rounded-md flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{proposal.jobTitle || "Job Application"}</h3>
                      <p className="text-sm text-gray-600">Bid: ₹{proposal.bidAmount}</p>
                      <p className="text-xs text-gray-400 mt-1">Submitted on {new Date(proposal.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${proposal.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        proposal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                        {proposal.status || "Pending"}
                      </span>
                      <Link to={`/jobs/${proposal.jobId}`}>
                        <Button variant="outline" size="sm">View Job</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
};

export default FreelancerDashboard;
