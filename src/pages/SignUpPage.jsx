import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ShieldCheck } from "lucide-react";
import GoogleIcon from "../assets/google-color-svgrepo-com.svg";
import AppleIcon from "../assets/apple-173-svgrepo-com.svg";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Input } from "../components/common";
import { validateEmail, validatePassword } from "../utils/helpers";
import PageTransition from "../components/common/PageTransition";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

  return (
    <PageTransition>
      <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gray-50 py-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-200/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] -z-10" />

        <div className="w-full max-w-md relative z-10">
          <Card variant="glass-light" className="p-10 shadow-2xl border-white/60">
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
                    await signInWithGoogle();
                    navigate("/onboarding", { replace: true });
                  } catch (err) {
                    setErrors({ submit: err.message || "Google signup failed" });
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
                label="Email Address"
                name="email"
                icon={<Mail size={18} className="text-primary-500" />}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
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
                type="submit"
                variant="neon-primary"
                className="w-full h-14 rounded-2xl mt-8 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-[1.02] transform transition-all"
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
