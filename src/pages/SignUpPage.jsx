import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/common';
import { validateEmail, validatePassword } from '../utils/helpers';
import PageTransition from '../components/common/PageTransition';

const SignUpPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateAccount = () => {
    const newErrors = {};
    if (!role) newErrors.role = 'Please select a role';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (!validateAccount()) return;
    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.name, role);
      if (role === 'freelancer') navigate('/profile/create');
      else navigate('/dashboard');
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Sign up failed' });
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          <Card className="p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Join Xlance</h1>
              <p className="text-sm sm:text-base text-gray-600">Create your account and choose your role</p>
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleAccountSubmit} className="space-y-4 sm:space-y-5">
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
                label="Email Address"
                name="email"
                type="email"
                icon={<Mail size={20} />}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              {/* Role Selection - Side by side on desktop, one by one on mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Role</label>
                {errors.role && (
                  <div className="mb-3 p-2 bg-yellow-100 text-yellow-700 rounded text-sm">
                    {errors.role}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => setRole('freelancer')}
                    type="button"
                    className={`p-4 sm:p-5 border-2 rounded-lg transition-all text-left group ${
                      role === 'freelancer'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg transition-colors flex-shrink-0 ${
                        role === 'freelancer' ? 'bg-primary-200' : 'bg-primary-100 group-hover:bg-primary-200'
                      }`}>
                        <Briefcase size={20} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">I'm a Freelancer</h3>
                        <p className="text-xs text-gray-600">Turn your skills into unlimited income opportunities</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setRole('client')}
                    type="button"
                    className={`p-4 sm:p-5 border-2 rounded-lg transition-all text-left group ${
                      role === 'client'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg transition-colors flex-shrink-0 ${
                        role === 'client' ? 'bg-primary-200' : 'bg-primary-100 group-hover:bg-primary-200'
                      }`}>
                        <Users size={20} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">I'm a Client</h3>
                        <p className="text-xs text-gray-600">Build amazing projects with expert freelancers worldwide</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

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

              <Button type="submit" isLoading={isLoading} className="w-full mt-6 sm:mt-7">
                Create Account
              </Button>

              <div className="text-sm text-gray-600 text-center pt-2">
                Already have an account?{' '}
                <Link to="/auth/signin" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign In
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
};

export default SignUpPage;
