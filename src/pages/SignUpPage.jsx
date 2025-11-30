import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Image, Briefcase, MapPin, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/common';
import { validateEmail, validatePassword } from '../utils/helpers';

import PageTransition from '../components/common/PageTransition';

const SignUpPage = () => {
  const [role, setRole] = useState('freelancer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // freelancer extra fields
    phone: '',
    photo: null,
    photoPreview: null,
    headline: '',
    skills: '',
    summary: '',
    state: '',
    address: '',
    language: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photo: file, photoPreview: url }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // simple optional checks for freelancer
    if (role === 'freelancer') {
      if (formData.headline && formData.headline.length > 120) {
        newErrors.headline = 'Headline is too long';
      }
      if (formData.skills && formData.skills.length > 250) {
        newErrors.skills = 'Please keep skills shorter';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.name, role);
      // After sign up, take freelancers to the profile creation flow so they can fill details
      if (role === 'freelancer') {
        navigate('/profile/create');
      } else {
        navigate('/dashboard/client');
      }
    } catch {
      setErrors({ submit: 'Sign up failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md md:max-w-2xl lg:max-w-3xl"
        >
          <Card className="p-6 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Join Xlance</h1>
              <p className="text-gray-600">Get started in minutes</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                onClick={() => setRole('freelancer')}
                className={`py-3 md:py-4 px-4 rounded-lg font-medium transition-all duration-200 md:text-lg ${
                  role === 'freelancer'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Freelancer
              </button>
              <button
                onClick={() => setRole('client')}
                className={`py-3 md:py-4 px-4 rounded-lg font-medium transition-all duration-200 md:text-lg ${
                  role === 'client'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Client
              </button>
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                icon={<User size={20} />}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                icon={<Mail size={20} />}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                icon={<Lock size={20} />}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                icon={<Lock size={20} />}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              {role === 'freelancer' && (
                <div className="space-y-4 pt-2 border-t border-gray-100 mt-4">
                  <h3 className="text-sm font-medium text-gray-700">Personal Details</h3>

                  <Input
                    label="Phone Number"
                    name="phone"
                    icon={<Phone size={18} />}
                    placeholder="e.g. +1 555 000 0000"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {formData.photoPreview ? (
                          // eslint-disable-next-line jsx-a11y/img-redundant-alt
                          <img src={formData.photoPreview} alt="profile preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-gray-400">
                            <Image size={28} />
                          </div>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-gray-700 pt-4">Professional Details</h3>

                  <Input
                    label="Professional Headline"
                    name="headline"
                    icon={<Briefcase size={18} />}
                    placeholder="e.g. Senior Web Developer"
                    value={formData.headline}
                    onChange={handleChange}
                    error={errors.headline}
                  />

                  <Input
                    label="Skills"
                    name="skills"
                    icon={<Globe size={18} />}
                    placeholder="e.g. HTML, CSS, JavaScript, React"
                    value={formData.skills}
                    onChange={handleChange}
                    error={errors.skills}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Summary / About You</label>
                    <textarea
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      placeholder="Write about yourself..."
                      className="w-full border rounded-md p-3 text-sm text-gray-700 bg-white"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 text-sm bg-white"
                      >
                        <option value="">Select a state</option>
                        <option>California</option>
                        <option>Texas</option>
                        <option>New York</option>
                        <option>Florida</option>
                      </select>
                    </div>

                    <Input
                      label="Address"
                      name="address"
                      icon={<MapPin size={18} />}
                      placeholder=""
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <Input
                    label="Language"
                    name="language"
                    placeholder="e.g. English, Spanish"
                    value={formData.language}
                    onChange={handleChange}
                  />
                </div>
              )}

              <Button isLoading={isLoading} type="submit" className="w-full mt-6">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/auth/signin" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default SignUpPage;
