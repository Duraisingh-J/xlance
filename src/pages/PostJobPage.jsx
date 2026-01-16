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
        budgetMin: '',
        budgetMax: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            const skillsArray = formData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean);

            const jobData = {
                clientId: user.uid,
                title: formData.title,
                description: formData.description,
                skills: skillsArray,
                budgetMin: Number(formData.budgetMin),
                budgetMax: Number(formData.budgetMax),
                client: {
                    name: user.displayName || "Client", // Fallback, ideally fetch from profile
                    location: "Remote" // Fallback
                }
            };

            await jobService.createJob(jobData);
            navigate('/dashboard/client');
        } catch (err) {
            console.error("Error posting job:", err);
            setError("Failed to post job. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageTransition>
            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <Card className="p-8">
                        <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Job Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. React Native Developer"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <Input
                                label="Required Skills (comma separated)"
                                name="skillsRequired"
                                value={formData.skillsRequired}
                                onChange={handleChange}
                                placeholder="React, Node.js, Firebase"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Min Budget (₹)"
                                    name="budgetMin"
                                    type="number"
                                    value={formData.budgetMin}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Max Budget (₹)"
                                    name="budgetMax"
                                    type="number"
                                    value={formData.budgetMax}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <Button type="submit" isLoading={isLoading}>
                                    Post Job
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </main>
        </PageTransition>
    );
};

export default PostJobPage;
