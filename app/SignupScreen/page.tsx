"use client";
import React, { useEffect, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios, { isAxiosError } from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, User, Mail, Shield, Globe } from "lucide-react";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";
import { baseAPI } from "@/useAPI/api";

// Gradient + Glass styles
const gradientBg = {
  background: "linear-gradient(120deg, #2870EA, #1B1B35 60%, #FAD961 100%)",
  backgroundSize: "200% 200%",
  animation: "gradientmove 7s ease-in-out infinite",
};
const cardStyle = {
  background: "rgba(255,255,255,0.83)",
  boxShadow: "0 8px 48px 0 rgba(34, 60, 80, 0.12)",
  backdropFilter: "blur(12px)",
  borderRadius: "2rem",
};

// SSO
const SSO_PROVIDERS = [
  {
    name: "Google",
    icon: <Globe className="w-5 h-5 mr-2" />,
    bg: "bg-white text-gray-800 border",
    onClick: () => window.location.href = `${baseAPI}/account/google/login/`,
  },
];

export default function SignupScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutUsData().then(setHeaderData);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const userData = {
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
    };

    try {
      const response = await axios.post(`${baseAPI}/account/custom-sign/`, userData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.message) {
        setSuccess(response.data.message);
        setTimeout(() => router.push("/LoginScreenUser"), 1400);
      } else {
        setSuccess("Signup successful, please verify your email.");
      }
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response && typeof error.response.data === "object") {
        const data = error.response.data as { error?: string; [key: string]: any };
        setError(data.error || Object.values(data).join(" "));
      } else {
        setError("An unknown error occurred during the signup process.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...gradientBg,
        backgroundImage: headerData?.backgroundApp
          ? `linear-gradient(112deg,rgba(27,47,79,0.80),rgba(255,255,255,0.20)),url(${headerData.backgroundApp})`
          : gradientBg.background,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
      className="flex items-center justify-center px-4 py-16 w-full"
    >
      <motion.div
        style={cardStyle}
        className="relative flex flex-col items-center w-full max-w-lg shadow-2xl px-7 py-11"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.39, ease: "easeOut" }}
      >
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.9, rotate: 0 }}
          animate={{ scale: 1, rotate: [0, 360, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
          className="flex justify-center mb-4"
        >
          <Image
            src={headerData?.logo || "/logo.png"}
            alt="logo"
            width={90}
            height={90}
            className="rounded-full bg-white shadow-lg border border-blue-200"
            priority
          />
        </motion.div>
        <h1 className="text-2xl font-extrabold text-blue-900 mb-2 text-center">
          Sign Up for an Account
        </h1>

        <Link href="/LoginScreenUser" className="text-blue-600 hover:underline text-sm mb-6 text-center">
          Already have an account? <span className="underline">Login</span>
        </Link>

        {/* Success/Error banners */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="w-full bg-red-50 text-red-600 border border-red-200 rounded mb-3 px-3 py-2 text-sm text-center"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >{error}</motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {success && (
            <motion.div
              className="w-full bg-green-50 text-green-700 border border-green-200 rounded mb-3 px-3 py-2 text-sm text-center"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >{success}</motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          {/* Username */}
          <div className="relative">
            <User className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-200" size={18} />
            <input
              name="username"
              placeholder="User Name"
              value={signupData.username}
              onChange={handleInputChange}
              className="w-full py-3 pl-8 pr-3 rounded-xl bg-blue-50 border border-blue-200 text-base font-medium text-blue-900 placeholder:text-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              required
            />
          </div>
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-200" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleInputChange}
              className="w-full py-3 pl-8 pr-3 rounded-xl bg-blue-50 border border-blue-200 text-base font-medium text-blue-900 placeholder:text-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              required
            />
          </div>
          {/* Password */}
          <div className="relative">
            <Shield className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-200" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleInputChange}
              className="w-full py-3 pl-8 pr-10 rounded-xl bg-blue-50 border border-blue-200 text-base font-medium text-blue-900 placeholder:text-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-0 right-0 h-full px-3 flex items-center text-blue-500 hover:text-blue-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
          {/* Sign up */}
          <button
            type="submit"
            aria-label="Sign up"
            className={`w-full py-3 rounded-xl text-base font-extrabold shadow-xl transition-all ${
              loading
                ? "bg-blue-300 text-blue-100 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-900 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up Now"}
          </button>
        </form>

        {/* SSO Buttons */}
        <div className="flex flex-col gap-2 mt-6 w-full">
          <div className="text-xs text-gray-500 text-center">or sign up with</div>
          {SSO_PROVIDERS.map(provider => (
            <button
              key={provider.name}
              type="button"
              onClick={provider.onClick}
              className={`flex items-center justify-center py-2 w-full rounded-xl font-bold mb-1 ${provider.bg} hover:shadow-md transition`}
            >
              {provider.icon} Sign up with {provider.name}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
