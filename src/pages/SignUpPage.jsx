import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ShieldCheck } from "lucide-react";
import GoogleIcon from "../assets/google-color-svgrepo-com.svg";
import AppleIcon from "../assets/apple-173-svgrepo-com.svg";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { Button, Card, Input } from "../components/common";
import { validateEmail, validatePassword } from "../utils/helpers";
import PageTransition from "../components/common/PageTransition";
import usePageTitle from "../hooks/usePageTitle";

const SignUpPage = () => {
  usePageTitle("Join Now");
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, signOut, user, userProfile, checkEmailExists } = useAuth();

  // Redirect if already authenticated, BUT skip if we are in the middle of checking Google Sign-Up strictness
  const isGoogleSigningIn = React.useRef(false);

  // Modal State
  const [showAccountExistsModal, setShowAccountExistsModal] = useState(false);

  React.useEffect(() => {
    // If not doing a special check, redirect authenticated users
    if (user && !isGoogleSigningIn.current && !showAccountExistsModal) {
      // Logic: If they have a profile & onboarded -> Dashboard. Else -> Onboarding.
      // Since we might not have profile loaded instantly, default to Onboarding which safe-redirects.
      navigate("/onboarding", { replace: true });
    }
  }, [user, navigate, showAccountExistsModal]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (name === "email" && value && validateEmail(value)) {
      setIsCheckingEmail(true);
      const exists = await checkEmailExists(value);
      if (exists) {
        setErrors(prev => ({
          ...prev, email: (
            <span className="flex items-center gap-1">
              Account exists.
              <Link to="/auth/signin" className="underline hover:text-red-700 transition-colors">Sign In?</Link>
            </span>
          )
        }));
      }
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eMap = {};
    if (!formData.name) eMap.name = "Name required";
    if (!validateEmail(formData.email)) eMap.email = "Invalid email";
    if (!validatePassword(formData.password)) eMap.password = "Min 8 characters";
    if (formData.password !== formData.confirmPassword)
      eMap.confirmPassword = "Passwords do not match";

    if (errors.email) return; // Block if email error exists

    if (Object.keys(eMap).length) {
      setErrors(eMap);
      return;
    }

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.name);
      navigate("/onboarding", { replace: true });
    } catch (err) {
      setErrors({ submit: err.message || "Signup failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToDashboard = () => {
    // User chose to proceed with existing account
    setShowAccountExistsModal(false);
    isGoogleSigningIn.current = false; // Allow redirect effect to take over
    // Or explicit navigation:
    navigate("/onboarding", { replace: true });
  };

  const handleUseDifferentAccount = async () => {
    // User chose to sign out and use different account
    await authService.logout();
    setShowAccountExistsModal(false);
    isGoogleSigningIn.current = false;
    // Stay on page (now logged out)
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gray-50 py-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-200/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] -z-10" />

        {/* ACCOUNT EXISTS MODAL OVERLAY */}
        {showAccountExistsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-white/40 relative animate-in fade-in zoom-in duration-300">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                <User size={32} />
              </div>
              <h3 className="text-xl font-black text-center text-gray-900 mb-2">Welcome Back!</h3>
              <p className="text-center text-gray-500 text-sm mb-6 font-medium leading-relaxed">
                You already have an account with <strong>{user?.email}</strong>.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleContinueToDashboard}
                  variant="neon-primary"
                  className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20"
                >
                  Continue to Dashboard
                </Button>
                <Button
                  onClick={handleUseDifferentAccount}
                  variant="ghost"
                  className="w-full h-12 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  Use Different Account
                </Button>
              </div>
            </div>
          </div>
        )}


        <div className="w-full max-w-md relative z-10">
          <Card variant="glass-light" className="p-10 shadow-2xl border-white/60 relative">

            {/* Back to Home - Inside Card */}
            <Link
              to="/"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/50 transition-all duration-300 flex items-center gap-2 group overflow-hidden w-9 hover:w-32 bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm"
              title="Back to Home"
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-gray-500 group-hover:text-primary-600">
                <span className="font-bold text-xs">X</span>
              </div>
              <span className="text-xs font-bold text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                Back to Home
              </span>
            </Link>

            <div className="text-center mb-10">
              <div className="bg-primary-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">
                Join the Hub
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Find talent or find your next project</p>
            </div>

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider text-center">
                {errors.submit}
              </div>
            )}

            {/* GOOGLE SIGNUP */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                type="button"
                onClick={async () => {
                  try {
                    isGoogleSigningIn.current = true; // Block auto-redirect
                    const { isNewUser } = await signInWithGoogle();

                    // IF EXISTING USER: Show Modal instead of automatic flow
                    if (isNewUser === false) {
                      setShowAccountExistsModal(true);
                      // Do NOT sign out yet. Wait for user choice.
                      return;
                    }

                    // Strict new user logic or normal flow
                    navigate("/onboarding", { replace: true });
                  } catch (err) {
                    setErrors({ submit: err.message || "Google signup failed" });
                    isGoogleSigningIn.current = false; // Reset on error
                  }
                }}
                variant="outline"
                className="flex gap-2 bg-white/60 border-white/80 h-14 rounded-2xl font-bold transition-all hover:bg-white hover:shadow-md text-[10px] px-2"
              >
                <img src={GoogleIcon} className="w-4 h-4" alt="" />
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex gap-2 bg-white/60 border-white/80 h-14 rounded-2xl font-bold transition-all hover:bg-white hover:shadow-md text-[10px] px-2 opacity-50 cursor-not-allowed"
                onClick={() => alert("Apple Sign-In coming soon")}
              >
                <img src={AppleIcon} className="w-4 h-4" alt="" />
                Apple
              </Button>
            </div>

            <div className="flex items-center my-8">
              <div className="flex-grow border-t border-gray-200/50" />
              <span className="mx-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">or register with email</span>
              <div className="flex-grow border-t border-gray-200/50" />
            </div>

            {/* EMAIL SIGNUP */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                icon={<User size={18} className="text-primary-500" />}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                className="bg-white/40 border-white/60 focus:bg-white transition-all h-14 rounded-2xl mt-1"
              />

              <Input
                label={isCheckingEmail ? "Email Address (Checking...)" : "Email Address"}
                name="email"
                icon={<Mail size={18} className="text-primary-500" />}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                className="bg-white/40 border-white/60 focus:bg-white transition-all h-14 rounded-2xl mt-1"
              />

              <Input
                label="Password"
                name="password"
                type="password"
                icon={<Lock size={18} className="text-primary-500" />}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                className="bg-white/40 border-white/60 focus:bg-white transition-all h-14 rounded-2xl mt-1"
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                icon={<Lock size={18} className="text-primary-500" />}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                className="bg-white/40 border-white/60 focus:bg-white transition-all h-14 rounded-2xl mt-1 mb-6"
              />

              <Button
                isLoading={isLoading}
                disabled={isCheckingEmail || !!errors.email}
                type="submit"
                variant="neon-primary"
                className="w-full h-14 rounded-2xl mt-8 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-[1.02] transform transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-loose">
                Already have an account?{" "}
                <Link
                  to="/auth/signin"
                  className="text-primary-600 hover:text-primary-700 font-black border-b-2 border-primary-600/20 hover:border-primary-600 transition-all ml-1"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
};


export default SignUpPage;
