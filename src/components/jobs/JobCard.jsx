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
        if (!date) return '';
        const hours = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
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
        <div className="group relative bg-white border border-gray-200 hover:border-primary-500 rounded-xl p-6 transition-all hover:shadow-md">
            {/* Featured/Promoted Badge */}
            {job.isPromoted && (
                <div className="absolute top-0 left-0 bg-primary-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-br-lg rounded-tl-lg">
                    Featured
                </div>
            )}

            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <Wrapper className="block w-fit">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 hover:underline decoration-2 underline-offset-2 transition-colors line-clamp-2">
                            {job.title}
                        </h3>
                    </Wrapper>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="font-medium text-gray-900">{job.budgetType === 'fixed' ? 'Fixed-price' : 'Hourly'}</span>
                        <span>•</span>
                        <span>{job.level}</span>
                        <span>•</span>
                        <span>Est. Time: {job.duration}</span>
                        <span>•</span>
                        <span>Posted {timeAgo(job.postedAt)}</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                    {/* Save Button */}
                    <button className="text-gray-400 hover:text-primary-600 transition-colors bg-white hover:bg-primary-50 p-2 rounded-full border border-gray-100 hover:border-primary-100">
                        <Heart size={18} />
                    </button>
                </div>
            </div>

            {/* Description Snippet */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {job.description}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
                {job.skills?.slice(0, 4).map((skill, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium hover:bg-gray-200 transition-colors"
                    >
                        {skill}
                    </span>
                ))}
                {job.skills?.length > 4 && (
                    <span className="px-2 py-1 text-gray-500 text-xs font-medium">+{job.skills.length - 4} more</span>
                )}
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                {/* Client Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {job.client.verified && (
                                <CheckCircle2 size={14} className="text-blue-500" />
                            )}
                            <span className={`font-semibold ${job.client.verified ? 'text-gray-900' : 'text-gray-700'}`}>
                                {job.client.verified ? 'Payment Verified' : 'Payment Unverified'}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className="text-amber-500 flex">
                                {'★'.repeat(Math.round(job.client.rating))}
                            </div>
                            <span className="font-medium text-gray-900">{job.client.rating}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{job.client.spent}</span>
                        <span className="flex items-center gap-1">
                            <MapPin size={12} /> {job.client.location}
                        </span>
                    </div>
                </div>

                {/* Budget Display */}
                <div className="text-gray-900 font-bold text-base">
                    {formatBudget()}
                </div>
            </div>
        </div>
    );
};

export default JobCard;
