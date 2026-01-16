import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-200 pb-4 mb-4 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full mb-3 group"
            >
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">{title}</h4>
                {isOpen ? <ChevronUp size={16} className="text-gray-400 group-hover:text-primary-600" /> : <ChevronDown size={16} className="text-gray-400 group-hover:text-primary-600" />}
            </button>
            {isOpen && <div className="space-y-2">{children}</div>}
        </div>
    );
};

const Checkbox = ({ label, count }) => (
    <label className="flex items-center justify-between cursor-pointer group">
        <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
        </div>
        {count && <span className="text-xs text-gray-400 group-hover:text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{count}</span>}
    </label>
);

const JobFilterSidebar = () => {
    return (
        <aside className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Filter size={18} /> Filters
                </h3>
                <button className="text-sm text-primary-600 font-medium hover:underline">Clear all</button>
            </div>

            <FilterSection title="Category">
                <Checkbox label="Development & IT" count={120} />
                <Checkbox label="Design & Creative" count={45} />
                <Checkbox label="Sales & Marketing" count={32} />
                <Checkbox label="Writing & Translation" count={18} />
                <Checkbox label="AI Services" count={8} />
            </FilterSection>

            <FilterSection title="Job Type">
                <Checkbox label="Hourly" count={86} />
                <Checkbox label="Fixed-Price" count={112} />
            </FilterSection>

            <FilterSection title="Experience Level">
                <Checkbox label="Entry Level" count={40} />
                <Checkbox label="Intermediate" count={95} />
                <Checkbox label="Expert" count={28} />
            </FilterSection>

            <FilterSection title="Client History">
                <Checkbox label="No hires yet" />
                <Checkbox label="1 to 9 hires" />
                <Checkbox label="10+ hires" />
            </FilterSection>

            <FilterSection title="Budget">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                    <span>-</span>
                    <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <p className="text-xs text-gray-400">Enter quantity in ₹</p>
            </FilterSection>

            <FilterSection title="Project Length">
                <Checkbox label="Less than 1 month" />
                <Checkbox label="1 to 3 months" />
                <Checkbox label="3 to 6 months" />
                <Checkbox label="More than 6 months" />
            </FilterSection>
        </aside>
    );
};

export default JobFilterSidebar;
