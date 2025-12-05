import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import GoogleIcon from "../assets/google-color-svgrepo-com.svg";
import AppleIcon from "../assets/apple-173-svgrepo-com.svg";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Input } from "../components/common";
import { validateEmail, validatePassword } from "../utils/helpers";
import PageTransition from "../components/common/PageTransition";

const SignUpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // We *only* use these from auth:
  const { signUp, signInWithGoogle, signInWithGoogleRedirect, signInWithApple, loginAsMock } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // optional: initialRole if you pass it from Home
  const initialRole =
    location?.state?.role ||
    new URLSearchParams(location.search).get("role") ||
    null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Separate loading states so social buttons don’t affect email submit
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateAccount = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!validatePassword(formData.password))
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // EMAIL SIGNUP
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (!validateAccount()) return;
    setIsLoadingEmail(true);
    setErrors({});
    try {
      await signUp(formData.email, formData.password, formData.name);
      // After email signup, always go to onboarding
      navigate("/onboarding", { replace: true, state: { role: initialRole } });
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : "Sign up failed",
      });
    } finally {
      setIsLoadingEmail(false);
    }
  };

  // GOOGLE SIGNUP
  const handleGoogleSignup = async () => {
    setIsLoadingSocial(true);
    setErrors({});
    try {
      await signInWithGoogle();
      // After Google signup, always go to onboarding
      navigate("/onboarding", { replace: true, state: { role: initialRole } });
    } catch (err) {
        // If popup is blocked (including COOP/COEP window.closed blocking), fall back to redirect flow
        const code = err && err.code ? String(err.code).toLowerCase() : '';
        const msg = err && err.message ? String(err.message).toLowerCase() : '';
        const shouldRedirectFallback = [
          'popup',
          'blocked',
          'cross-origin-opener-policy',
          'window.closed',
          'opener',
          'failed to get document',
        ].some((s) => code.includes(s) || msg.includes(s));

        if (shouldRedirectFallback) {
          try {
            // eslint-disable-next-line no-alert
            alert('Popup unavailable due to browser policy — redirecting to Google sign-in.');
            await signInWithGoogleRedirect();
            // redirect flow will navigate away; on return, AuthContext handles profile creation and routing
          } catch (redirErr) {
            setErrors({ submit: redirErr instanceof Error ? redirErr.message : 'Google redirect failed' });
          }
        } else {
          setErrors({ submit: err instanceof Error ? err.message : 'Google sign-up failed' });
        }
    } finally {
      setIsLoadingSocial(false);
    }
  };

  // APPLE SIGNUP
  const handleAppleSignup = async () => {
    setIsLoadingSocial(true);
    setErrors({});
    try {
      await signInWithApple();
      // After Apple signup, always go to onboarding
      navigate("/onboarding", { replace: true, state: { role: initialRole } });
    } catch (err) {
      setErrors({
        submit:
          err instanceof Error ? err.message : "Apple sign-up failed",
      });
    } finally {
      setIsLoadingSocial(false);
    }
  };

  // Development: quick mock account to skip real OAuth during local testing
  const handleMockAccount = async () => {
    const mockProfile = {
      uid: 'mock-uid',
      name: 'Priya',
      email: 'priya@example.com',
      role: [],
      onboardingCompleted: false,
    };
    loginAsMock(mockProfile);
    navigate('/onboarding', { replace: true, state: { role: initialRole } });
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <Card className="p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Create your Account
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                to join Xlance
              </p>
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            {/* SOCIAL BUTTONS */}
            <div className="space-y-4">
              <Button
                onClick={handleGoogleSignup}
                isLoading={isLoadingSocial}
                className="w-full flex items-center justify-center gap-3"
                variant="outline"
              >
                <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
                <span>Sign up with Google</span>
              </Button>

              <Button
                onClick={handleAppleSignup}
                isLoading={isLoadingSocial}
                className="w-full flex items-center justify-center gap-3"
                variant="outline"
              >
                <img src={AppleIcon} alt="Apple" className="w-5 h-5" />
                <span>Sign up with Apple</span>
              </Button>
            </div>

            {/* Dev helper: mock account */}
            <div className="mt-4">
              <Button onClick={handleMockAccount} variant="ghost" className="w-full">Continue with Mock Account (dev)</Button>
            </div>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">Or with email</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* EMAIL FORM */}
            <form
              onSubmit={handleAccountSubmit}
              className="space-y-4 sm:space-y-5"
            >
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

              <Button
                type="submit"
                isLoading={isLoadingEmail}
                className="w-full mt-6 sm:mt-7"
              >
                Create Account
              </Button>

              <div className="text-sm text-gray-600 text-center pt-2">
                Already have an account?{" "}
                <Link
                  to="/auth/signin"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
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