import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/common';
import { validateEmail, validatePassword } from '../utils/helpers';
import PageTransition from '../components/common/PageTransition';

const SignUpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // initialRole comes from Link state (Home) or query param
  const initialRole = location?.state?.role || new URLSearchParams(location.search).get('role') || null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateAccount = () => {
    const newErrors = {};
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
      await signUp(formData.email, formData.password, formData.name);
      // send user to role onboarding; carry initialRole (if user clicked from Home)
      navigate('/auth/select-role', { state: { role: initialRole } });
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Sign up failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // after social sign-in, go to role onboarding and pass initialRole if available
      navigate('/auth/select-role', { state: { role: initialRole } });
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Google Sign-up failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithApple();
      navigate('/auth/select-role', { state: { role: initialRole } });
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Apple Sign-up failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <Card className="p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create your Account</h1>
              <p className="text-sm sm:text-base text-gray-600">to join Xlance</p>
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <div className="space-y-4">
              <Button onClick={handleGoogleSignup} isLoading={isLoading} className="w-full" variant="outline">
                Sign up with Google
              </Button>
              <Button onClick={handleAppleSignup} isLoading={isLoading} className="w-full" variant="outline">
                Sign up with Apple
              </Button>
            </div>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">Or with email</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

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
