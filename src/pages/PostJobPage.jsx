import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../components/common';
import PageTransition from '../components/common/PageTransition';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/jobService';

const PostJobPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skillsRequired: '',
        jobType: 'hourly', // hourly | fixed
        budgetMin: '',
        budgetMax: '',
        budgetFixed: '',
        duration: '1-3 months',
        level: 'Intermediate',
        location: 'Remote'
    });
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const validateField = (name, value) => {
        let error = "";

        // Required check
        if (!value) {
            return "This field is required";
        }

        // Negative check
        if (['budgetMin', 'budgetMax', 'budgetFixed'].includes(name)) {
            if (Number(value) < 0) return "Amount cannot be negative";
        }

        // Logic check
        if (name === 'budgetMax' && formData.budgetMin && Number(value) < Number(formData.budgetMin)) {
            return "Max budget cannot be less than Min budget";
        }

        return "";
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        if (touched[name] || ['budgetMin', 'budgetMax', 'budgetFixed'].includes(name)) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleJobTypeChange = (type) => {
        setFormData({ ...formData, jobType: type });
        setErrors({}); // Clear errors when switching type
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            // Skip fields that depend on jobType
            if (formData.jobType === 'hourly' && key === 'budgetFixed') return;
            if (formData.jobType === 'fixed' && (key === 'budgetMin' || key === 'budgetMax')) return;

            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
            setSubmitError("Please fix the errors before submitting.");
            return;
        }

        setIsLoading(true);
        setSubmitError(null);

        try {
            const skillsArray = formData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean);

            const jobData = {
                clientId: user.uid,
                title: formData.title,
                description: formData.description,
                skills: skillsArray,
                category: "Development & IT",
                subCategory: "Web Development",
                budgetType: formData.jobType,
                budget: formData.jobType === 'hourly'
                    ? { min: Number(formData.budgetMin), max: Number(formData.budgetMax), rate: Number(formData.budgetMax) }
                    : { fixed: Number(formData.budgetFixed) },
                duration: formData.duration,
                level: formData.level,
                client: {
                    name: user.displayName || "Client",
                    location: formData.location,
                    verified: user.emailVerified || false,
                    rating: 0,
                    spent: "₹0 spent"
                }
            };

            await jobService.createJob(jobData);
            navigate('/dashboard/client');
        } catch (err) {
            console.error("Error posting job:", err);
            setSubmitError("Failed to post job. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderError = (name) => {
        return errors[name] ? <p className="text-red-500 text-xs mt-1 font-bold pl-1">{errors[name]}</p> : null;
    };

    return (
        <PageTransition>
            <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Post a New Job</h1>
                        <p className="text-gray-500 mt-2">Connect with top talent by providing detailed requirements.</p>
                    </div>

                    <Card className="p-0 border-none shadow-xl overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-primary-600 to-purple-600"></div>

                        <div className="p-8 sm:p-10">
                            {submitError && (
                                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100 flex items-center">
                                    <span className="mr-2">⚠️</span> {submitError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                                {/* Section 1: Job Details */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Job Details</h2>

                                    <div>
                                        <Input
                                            label="Job Title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            spellCheck="true"
                                            placeholder="e.g. Senior React Native Developer for Fintech App"
                                            className={`text-lg font-medium ${errors.title ? 'border-red-500' : ''}`}
                                        />
                                        {renderError('title')}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            rows={6}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50 focus:bg-white ${errors.description ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
                                            placeholder="Describe the project, responsibilities, and what you're looking for..."
                                            spellCheck="true"
                                            autoCorrect="on"
                                            autoCapitalize="sentences"
                                        />
                                        {renderError('description')}
                                    </div>

                                    <div>
                                        <Input
                                            label="Required Skills (Comma separated)"
                                            name="skillsRequired"
                                            value={formData.skillsRequired}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="React, Node.js, Firebase, Figma..."
                                            className={errors.skillsRequired ? 'border-red-500' : ''}
                                        />
                                        {renderError('skillsRequired')}
                                    </div>
                                </div>

                                {/* Section 2: Requirements */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2 pt-2">Requirements & Budget</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Job Type Toggle */}
                                        <div className="col-span-full">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleJobTypeChange('hourly')}
                                                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${formData.jobType === 'hourly' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                                >
                                                    Hourly Rate
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleJobTypeChange('fixed')}
                                                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${formData.jobType === 'fixed' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                                >
                                                    Fixed Price
                                                </button>
                                            </div>
                                        </div>

                                        {/* Dynamic Budget Inputs */}
                                        {formData.jobType === 'hourly' ? (
                                            <>
                                                <div>
                                                    <Input
                                                        label="Min Hourly Rate (₹)"
                                                        name="budgetMin"
                                                        type="number"
                                                        value={formData.budgetMin}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        placeholder="500"
                                                        className={errors.budgetMin ? 'border-red-500' : ''}
                                                    />
                                                    {renderError('budgetMin')}
                                                </div>
                                                <div>
                                                    <Input
                                                        label="Max Hourly Rate (₹)"
                                                        name="budgetMax"
                                                        type="number"
                                                        value={formData.budgetMax}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        placeholder="2000"
                                                        className={errors.budgetMax ? 'border-red-500' : ''}
                                                    />
                                                    {renderError('budgetMax')}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="col-span-full">
                                                <Input
                                                    label="Fixed Budget Amount (₹)"
                                                    name="budgetFixed"
                                                    type="number"
                                                    value={formData.budgetFixed}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="50000"
                                                    className={errors.budgetFixed ? 'border-red-500' : ''}
                                                />
                                                {renderError('budgetFixed')}
                                            </div>
                                        )}

                                        {/* Experience Level */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Experience Level</label>
                                            <select
                                                name="level"
                                                value={formData.level}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                                            >
                                                <option value="Entry">Entry Level</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Expert">Expert</option>
                                            </select>
                                        </div>

                                        {/* Duration */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Project Duration</label>
                                            <select
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                                            >
                                                <option value="Less than 1 month">Less than 1 month</option>
                                                <option value="1-3 months">1-3 months</option>
                                                <option value="3-6 months">3-6 months</option>
                                                <option value="More than 6 months">More than 6 months</option>
                                            </select>
                                        </div>

                                        {/* Location */}
                                        <div className="col-span-full">
                                            <Input
                                                label="Location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="e.g. Remote, Mumbai, Bangalore"
                                                className={errors.location ? 'border-red-500' : ''}
                                            />
                                            {renderError('location')}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-100">
                                    <Button
                                        variant="ghost"
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        isLoading={isLoading}
                                        className="px-8 py-3 text-base rounded-xl shadow-lg shadow-primary-600/30"
                                    >
                                        Post Job Now
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            </main>
        </PageTransition>
    );
};

export default PostJobPage;
