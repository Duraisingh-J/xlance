import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Briefcase, Eye, Edit2, Archive } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/jobService';
import { Button, Card, Input, Badge } from '../components/common';
import usePageTitle from "../hooks/usePageTitle";

const ClientJobsPage = () => {
    usePageTitle("My Jobs");
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            if (user?.uid) {
                try {
                    setLoading(true);
                    const clientJobs = await jobService.getClientJobs(user.uid);
                    setJobs(clientJobs);
                } catch (error) {
                    console.error("Error fetching jobs:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchJobs();
    }, [user]);

    const filteredJobs = jobs.filter(job => {
        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'open': return 'success';
            case 'closed': return 'secondary';
            case 'draft': return 'warning';
            default: return 'primary';
        }
    };

    return (
        <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Jobs</h1>
                        <p className="text-gray-500 mt-1">Manage your job postings and view proposals.</p>
                    </div>
                    <Link to="/post-job">
                        <Button className="shadow-lg shadow-primary-600/20">
                            <Plus size={18} className="mr-2" /> Post a New Job
                        </Button>
                    </Link>
                </div>

                {/* Filters & Search */}
                <Card className="p-4 mb-6 bg-white border-none shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {['all', 'open', 'closed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterStatus === status
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)} Jobs
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </Card>

                {/* Job List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            {searchQuery || filterStatus !== 'all'
                                ? "Try adjusting your search or filters."
                                : "Get started by posting your first job to find top talent."}
                        </p>
                        {(searchQuery || filterStatus !== 'all') ? (
                            <Button variant="outline" onClick={() => { setFilterStatus('all'); setSearchQuery(''); }}>Clear Filters</Button>
                        ) : (
                            <Link to="/post-job"><Button>Post a Job</Button></Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map(job => (
                            <Card key={job.id} className="p-6 bg-white border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between md:hidden mb-2">
                                            <Badge variant={getStatusBadgeVariant(job.status)} size="sm" className="uppercase tracking-wider text-[10px]">
                                                {job.status}
                                            </Badge>
                                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
                                        </div>
                                        <Link to={`/jobs/${job.id}`}>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                                                {job.title}
                                            </h3>
                                        </Link>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
                                            <span>Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Just now'}</span>
                                            <span>{job.budgetType === 'hourly' ? `Scale: ₹${job.budget?.min} - ₹${job.budget?.max}/hr` : `Fixed: ₹${job.budget?.fixed}`}</span>
                                            <span>{job.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                                                <Briefcase size={14} className="text-gray-400" />
                                                <span>{job.proposalsCount || 0} Proposals</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                                                <Eye size={14} className="text-gray-400" />
                                                <span>0 Views</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex flex-col items-end gap-3 min-w-[140px]">
                                        <Badge variant={getStatusBadgeVariant(job.status)} className="uppercase tracking-wider text-[10px]">
                                            {job.status}
                                        </Badge>
                                        <div className="flex items-center gap-2 mt-auto">
                                            <Link to={`/jobs/${job.id}`}>
                                                <Button size="sm" variant="outline" className="h-9 px-3">
                                                    View Job
                                                </Button>
                                            </Link>
                                            <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Archive size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientJobsPage;
