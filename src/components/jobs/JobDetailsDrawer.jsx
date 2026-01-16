import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, MapPin, Heart, Share2, Flag } from 'lucide-react';
import { Button, Input } from '../common';
import { useAuth } from '../../context/AuthContext';
import { proposalService } from '../../services/proposalService';

const JobDetailsDrawer = ({ job, isOpen, onClose }) => {
    const { user, userProfile } = useAuth();
    const [proposalForm, setProposalForm] = useState({
        bidAmount: '',
        coverLetter: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Reset form when job changes
    // useEffect(() => { ... }, [job]); 

    if (!isOpen || !job) return null;

    const isHourly = job.budgetType === 'hourly';
    const formatBudget = () => {
        if (isHourly) {
            if (job.budget?.min && job.budget?.max) return `₹${job.budget.min} - ₹${job.budget.max}/hr`;
            return `₹${job.budget?.rate || 0}/hr`;
        }
        return `₹${job.budget?.fixed?.toLocaleString() || 0}`;
    };

    const handleSubmitProposal = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please sign in to submit a proposal"); // simplified for drawer
            return;
        }
        setSubmitting(true);
        try {
            // Mock submission simulation
            await new Promise(resolve => setTimeout(resolve, 1000));

            await proposalService.createProposal({
                jobId: job.id,
                freelancerId: user.uid,
                bidAmount: Number(proposalForm.bidAmount),
                coverLetter: proposalForm.coverLetter,
                freelancerName: user.displayName || userProfile?.name || "Freelancer",
                jobTitle: job.title,
                clientName: job.client?.name || "Client"
            });
            alert("Proposal submitted successfully!");
            onClose();
        } catch (err) {
            console.error("Error submitting proposal:", err);
            alert("Failed to submit proposal");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[700px] bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart size={20} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-primary-600 transition-colors">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 space-y-8">

                            {/* Job Header Info */}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{job.title}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full font-medium text-xs">
                                        {job.budgetType === 'fixed' ? 'Fixed Price' : 'Hourly'}
                                    </span>
                                    <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} /> Remote</span>
                                </div>
                            </div>

                            {/* Main Description */}
                            <div className="prose prose-sm max-w-none text-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
                                <p className="whitespace-pre-wrap">{job.description}</p>
                            </div>

                            {/* Skills */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Required</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills?.map(skill => (
                                        <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100" />

                            {/* Project Details Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Project Budget</p>
                                    <p className="font-bold text-gray-900 text-lg">{formatBudget()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Expertise Level</p>
                                    <p className="font-bold text-gray-900 text-lg capitalize">{job.level || 'Intermediate'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Est. Duration</p>
                                    <p className="font-bold text-gray-900 text-lg">{job.duration || '1-3 Months'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Proposals</p>
                                    <p className="font-bold text-gray-900 text-lg">Less than 5</p>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100" />

                            {/* Client Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Client</h3>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {job.client?.name?.[0] || 'C'}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900">{job.client?.name || 'Client'}</p>
                                            {job.client?.verified && <CheckCircle2 size={16} className="text-blue-500" />}
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                                            {'★'.repeat(Math.round(job.client?.rating || 5))}
                                            <span className="text-gray-500 ml-1">{job.client?.rating || 5.0} of 5 reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-500">{job.client?.location || 'United States'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Proposal Form Section */}
                            <div className="bg-gray-50 -mx-6 md:-mx-8 p-6 md:p-8 mt-8 border-t border-gray-100">
                                {userProfile?.role?.includes('freelancer') ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold text-gray-900">Submit a Proposal</h2>
                                        </div>

                                        <form onSubmit={handleSubmitProposal} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    label="Bid Amount (₹)"
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={proposalForm.bidAmount}
                                                    onChange={(e) => setProposalForm({ ...proposalForm, bidAmount: e.target.value })}
                                                    required
                                                />
                                                <div className="w-full">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                                    <div className="relative">
                                                        <select className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 transition-colors duration-200 bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-gray-900 appearance-none">
                                                            <option>Less than 1 month</option>
                                                            <option>1 to 3 months</option>
                                                            <option>3 to 6 months</option>
                                                            <option>More than 6 months</option>
                                                        </select>
                                                        {/* Add custom chevron if needed, but appearance-none removes default. Let's keep default or use a simple SVG chevron */}
                                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                                                <textarea
                                                    rows={6}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                                    placeholder="Explain why you are the best fit for this job..."
                                                    value={proposalForm.coverLetter}
                                                    onChange={(e) => setProposalForm({ ...proposalForm, coverLetter: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <Button type="submit" isLoading={submitting} className="flex-1">
                                                    Send Proposal
                                                </Button>
                                                <Button type="button" variant="outline" className="flex-1">
                                                    Save as Draft
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-600 mb-4">Sign in as a freelancer to bid on this job.</p>
                                        <Button onClick={() => window.location.href = '/auth/signin'}>Sign In</Button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default JobDetailsDrawer;
