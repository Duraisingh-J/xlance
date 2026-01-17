import React from 'react';
import { MapPin, Clock, CheckCircle2, Heart, Award } from 'lucide-react';
import { Card, Button } from '../common';
import { Link } from 'react-router-dom';

const JobCard = ({ job, onClick }) => {
    const isHourly = job.budgetType === 'hourly';

    const formatBudget = () => {
        if (isHourly) {
            if (job.budget && job.budget.min && job.budget.max) {
                return `₹${job.budget.min} - ₹${job.budget.max}/hr`;
            }
            return `₹${job.budget?.rate || 0}/hr`;
        }
        return `₹${job.budget?.fixed?.toLocaleString() || 0}`;
    };

    const timeAgo = (date) => {
        if (!date) return 'Just now';
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";

        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";

        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";

        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    // Wrapper component based on whether onClick is provided
    const Wrapper = ({ children, className }) => {
        if (onClick) {
            return (
                <div onClick={() => onClick(job)} className={`${className} cursor-pointer`}>
                    {children}
                </div>
            );
        }
        return (
            <Link to={`/jobs/${job.id}`} className={className}>
                {children}
            </Link>
        );
    };

    return (
        <Card variant="glass-light" hover={true} className="group relative p-0 overflow-hidden transition-all duration-300 hover:shadow-lg border-gray-200/60">
            {/* Featured/Promoted Badge with Glow */}
            {job.isPromoted && (
                <>
                    <div className="absolute top-0 left-0 w-24 h-24 bg-primary-500/10 blur-xl rounded-full -translate-x-12 -translate-y-12 pointer-events-none" />
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-br-xl shadow-sm z-10">
                        Featured
                    </div>
                </>
            )}

            <div className="p-6">
                <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex-1">
                        <Wrapper className="block w-fit">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight mb-2">
                                {job.title}
                            </h3>
                        </Wrapper>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-gray-500 font-medium">
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                                {job.budgetType === 'fixed' ? 'Fixed Price' : 'Hourly Base'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Award size={12} className="text-amber-500" />
                                {job.level}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {job.duration}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-gray-400">
                                {timeAgo(job.createdAt)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                        <div className="text-lg font-black text-gray-900 mb-2">
                            {formatBudget()}
                        </div>
                        <button className="group/btn relative p-2 rounded-full hover:bg-red-50 transition-colors">
                            <Heart size={20} className="text-gray-300 group-hover/btn:text-red-500 group-hover/btn:fill-red-500 transition-all duration-300" />
                        </button>
                    </div>
                </div>

                {/* Description Snippet */}
                <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-2">
                    {job.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {job.skills?.slice(0, 5).map((skill, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-lg font-semibold hover:border-primary-200 hover:text-primary-700 hover:bg-primary-50/50 transition-all cursor-default"
                        >
                            {skill}
                        </span>
                    ))}
                    {job.skills?.length > 5 && (
                        <span className="px-2 py-1 text-gray-400 text-xs font-semibold">+{job.skills.length - 5} more</span>
                    )}
                </div>
            </div>

            {/* Footer / Client Info with dark accent */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        {job.client.verified ? (
                            <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <CheckCircle2 size={10} className="fill-emerald-700 text-white" /> Verified
                            </span>
                        ) : (
                            <span className="text-gray-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-gray-300" /> Unverified
                            </span>
                        )}
                    </div>

                    <div className="w-px h-3 bg-gray-300" />

                    <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                            {'★'.repeat(Math.floor(job.client.rating || 0))}
                            {job.client.rating % 1 !== 0 && '½'}
                        </div>
                        <span className="font-bold text-gray-700">{job.client.rating || 0}</span>
                        <span className="text-gray-400">({job.client.reviews || 0} reviews)</span>
                    </div>

                    <div className="w-px h-3 bg-gray-300 hidden sm:block" />

                    <div className="hidden sm:flex items-center gap-1 text-gray-600 font-medium">
                        <MapPin size={12} /> {job.client.location}
                    </div>
                </div>

                <div className="text-xs font-bold text-gray-900">
                    <span className="text-gray-400 font-medium">Spent:</span> {job.client.spent}
                </div>
            </div>
        </Card>
    );
};

export default JobCard;
