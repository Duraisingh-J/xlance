import React, { useState } from 'react';
import { Card, Button } from '../common';
import { Plus, Users, Clock, Layout, ArrowRight, Briefcase, DollarSign, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';

const ClientDashboard = () => {
  const { user, userProfile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchJobs = async () => {
      if (user?.uid) {
        try {
          const clientJobs = await jobService.getClientJobs(user.uid);
          setJobs(clientJobs);
        } catch (error) {
          console.error("Error fetching client jobs:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchJobs();
  }, [user]);

  const activeJobsCount = jobs.filter(j => j.status === 'open').length;

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Client Hub</h1>
            <p className="text-gray-500 mt-2 font-medium">Welcome back, {userProfile?.name || user?.displayName || 'Partner'}</p>
          </div>
          <Link to="/post-job">
            <Button className="shadow-lg shadow-primary-600/30">
              <Plus size={18} className="mr-2" /> Post a New Job
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card hover={false} className="p-6 bg-white border-none shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Jobs</p>
              <h3 className="text-2xl font-black text-gray-900">{activeJobsCount}</h3>
            </div>
          </Card>
          <Card hover={false} className="p-6 bg-white border-none shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hires</p>
              <h3 className="text-2xl font-black text-gray-900">0</h3>
            </div>
          </Card>
          <Card hover={false} className="p-6 bg-white border-none shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Proposals</p>
              <h3 className="text-2xl font-black text-gray-900">0</h3>
            </div>
          </Card>
          <Card hover={false} className="p-6 bg-white border-none shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Spent</p>
              <h3 className="text-2xl font-black text-gray-900">₹0</h3>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Job Postings Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
              <Link to="/client/jobs" className="text-primary-600 font-bold text-sm hover:underline">View All</Link>
            </div>

            {loading ? (
              <div className="h-40 bg-gray-100 rounded-2xl animate-pulse"></div>
            ) : jobs.length === 0 ? (
              <Card className="p-10 text-center bg-white border-none shadow-sm flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <Briefcase size={32} className="text-gray-300 mb-3" />
                <h3 className="text-lg font-bold text-gray-900">No Jobs Posted</h3>
                <p className="text-sm text-gray-500 mb-4">You haven't posted any jobs yet.</p>
                <Link to="/post-job"><Button variant="outline" size="sm">Post Your First Job</Button></Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 3).map(job => (
                  <Link to={`/jobs/${job.id}`} key={job.id} className="block">
                    <Card className="p-5 bg-white border border-gray-100 hover:border-primary-500 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-medium">
                            <span>Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Just now'}</span>
                            <span>•</span>
                            <span className="capitalize">{job.budgetType}</span>
                            <span>•</span>
                            <span>{job.proposalsCount || 0} Proposals</span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {job.status || 'Open'}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar / Recommended Talent */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Top Rated Talent</h2>
              <Link to="/client/talent" className="text-primary-600 font-bold text-sm hover:underline">Find More</Link>
            </div>

            {/* Mock Talent List */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 bg-white border-none shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">John Doe</h4>
                    <p className="text-xs text-gray-500">Senior React Developer</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-gray-700">4.9</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-purple-700 rounded-3xl p-6 text-white text-center shadow-lg shadow-purple-900/20">
              <h3 className="font-bold text-lg mb-2">Need Custom Help?</h3>
              <p className="text-primary-100 text-sm mb-4">Our recruiters can help you find the perfect match.</p>
              <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white hover:text-primary-600">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClientDashboard;
