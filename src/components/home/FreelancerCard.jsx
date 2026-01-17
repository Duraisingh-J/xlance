import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const FreelancerCard = ({ freelancer }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-sky-50 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm w-full max-w-sm mx-auto hover:shadow-md transition-shadow"
        >
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm">
                <img
                    src={freelancer.avatar || `https://ui-avatars.com/api/?name=${freelancer.name}&background=random`}
                    alt={freelancer.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">{freelancer.name}</h3>

            <div className="flex items-center gap-4 text-sm mb-4 w-full justify-center">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <span className="flex">{'★'.repeat(1)}<span className="text-gray-300">{'★'.repeat(0)}</span></span>
                    <span className="text-gray-700 font-medium ml-1">{freelancer.rating} Rating</span>
                </div>
                <div className="h-4 w-[1px] bg-gray-300" />
                <div className="flex flex-col leading-tight">
                    <span className="font-bold text-gray-900">{freelancer.experience}</span>
                    <span className="text-xs text-gray-500">Experience</span>
                </div>
            </div>

            <div className={`px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${freelancer.level?.includes('Gold') ? 'bg-amber-400 text-amber-900' :
                    freelancer.level?.includes('Platinum') ? 'bg-slate-300 text-slate-800' :
                        freelancer.level?.includes('Diamond') ? 'bg-cyan-200 text-cyan-900' :
                            'bg-gray-200 text-gray-800'
                }`}>
                {freelancer.level || 'Silver Level'}
            </div>

            <div className="text-gray-900 font-bold text-lg mb-6">
                From ₹{freelancer.startingPrice}
            </div>

            <div className="flex items-center gap-3 w-full">
                <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm shadow-primary-200">
                    View Profile
                </button>
                <button className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-6 rounded-xl border border-gray-200 transition-colors flex items-center gap-2">
                    CHAT <MessageSquare size={16} className="fill-current" />
                </button>
            </div>
        </motion.div>
    );
};

export default FreelancerCard;
