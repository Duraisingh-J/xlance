import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/common';
import { validateEmail } from '../utils/helpers';

import PageTransition from '../components/common/PageTransition';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await signIn(formData.email, formData.password);
      // Attempt to refresh profile and navigate to the user's dashboard if available.
      let profile = null;
      try {
        profile = await refreshUserProfile();
      } catch (e) {
        // ignore
      }

      const roleField = profile?.role;
      const roleSegment = Array.isArray(roleField) ? roleField[0] : roleField;
      if (roleSegment) {
        navigate(`/dashboard/${roleSegment}`, { replace: true });
      } else {
        // Default to freelancer dashboard if no role found
        navigate('/dashboard/freelancer', { replace: true });
      }
    } catch (err) {
      setErrors({ submit: err?.message || 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="text-right">
                <Link to="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button isLoading={isLoading} type="submit" className="w-full mt-6">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
};

export default SignInPage;
