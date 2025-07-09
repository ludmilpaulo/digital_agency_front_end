"use client";
import Image from "next/image";
import { css } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, User, Shield, Briefcase, Globe } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { baseAPI } from "@/useAPI/api";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";

const cardStyles = css`
  background: rgba(255,255,255,0.82);
  box-shadow: 0 8px 48px 0 rgba(34, 60, 80, 0.16);
  backdrop-filter: blur(14px);
  border-radius: 2.25rem;
`;

const gradientStyles = css`
  background: linear-gradient(120deg, #2870EA, #1B1B35 60%, #FAD961 100%);
  background-size: 200% 200%;
  animation: gradientmove 7s ease-in-out infinite;
  @keyframes gradientmove {
    0% { background-position: 0% 80%; }
    50% { background-position: 100% 20%; }
    100% { background-position: 0% 80%; }
  }
`;

const SSO_PROVIDERS = [
  {
    name: "Google",
    icon: <Globe className="w-5 h-5 mr-2" />,
    bg: "bg-white text-gray-800 border",
    onClick: () => window.location.href = `${baseAPI}/account/google/login/`, // update for your SSO endpoint
  },
];

const ROLE_ICONS: Record<string, JSX.Element> = {
  Executive: <Shield className="inline-block w-5 h-5 text-blue-700 mr-1" />,
  Staff: <Briefcase className="inline-block w-5 h-5 text-blue-500 mr-1" />,
  Freelancer: <User className="inline-block w-5 h-5 text-yellow-500 mr-1" />,
  Basic: <User className="inline-block w-5 h-5 text-gray-400 mr-1" />,
};

const getRole = (user: any) =>
  user?.groups?.find((g: string) =>
    ["Executive", "Staff", "Freelancer", "Basic"].includes(g)
  ) || "User";

export default function LoginScreenUser() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutUsData().then(setHeaderData);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("maindo_user");
      if (user) {
        const parsed = JSON.parse(user);
        setUserRole(getRole(parsed));
      }
    }
  }, []);

  const toggleForgotPasswordDialog = () => setShowForgotPasswordDialog((v) => !v);
  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${baseAPI}/account/custom-login/`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const resJson = await res.json();
      if (res.status === 200) {
        dispatch(loginUser(resJson));
        setUserRole(getRole(resJson));
        localStorage.setItem("maindo_user", JSON.stringify(resJson));
        router.push("/");
      } else {
        setError(resJson.detail || "Invalid credentials, please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center px-4 py-10"
      css={gradientStyles}
      style={{
        backgroundImage: headerData?.backgroundApp
          ? `linear-gradient(112deg, rgba(27,47,79,0.80), rgba(255,255,255,0.35)), url(${headerData.backgroundApp})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Loader Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1.05 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glass Card */}
      <motion.div
        css={cardStyles}
        className="relative flex flex-col items-center w-full max-w-md px-6 py-10 shadow-2xl"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.38, ease: "easeOut" }}
      >
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.9, rotate: 0 }}
          animate={{ scale: 1, rotate: [0, 360, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
          className="flex justify-center mb-3"
        >
          <Image
            src={headerData?.logo ?? "/logo.png"}
            alt="logo"
            width={72}
            height={72}
            className="rounded-full bg-white shadow-lg border border-blue-200"
            priority
          />
        </motion.div>

        {/* Multi-role Welcome */}
        <div className="mb-2 text-center">
          <div className="text-2xl font-black text-blue-900 tracking-tight mb-1">
            {userRole && ROLE_ICONS[userRole]}
            {userRole ? `Welcome back, ${userRole}!` : "Welcome to Maindo Digital"}
          </div>
          <div className="text-base text-gray-500 font-medium mb-2">
            Sign in to <span className="font-bold text-blue-700">Maindo Digital Agency</span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            className="w-full bg-red-50 text-red-600 border border-red-200 rounded mb-4 px-3 py-2 text-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <form
          className="w-full flex flex-col gap-3"
          onSubmit={handleSubmit}
        >
          {/* Username */}
          <div className="relative">
            <User className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-200" size={18} />
            <input
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              type="text"
              autoFocus
              className="w-full py-3 pl-8 pr-3 rounded-xl bg-blue-50 border border-blue-200 text-base font-medium text-blue-900 placeholder:text-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              required
            />
          </div>
          {/* Password */}
          <div className="relative">
            <Shield className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-200" size={18} />
            <input
              value={password}
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="w-full py-3 pl-8 pr-10 rounded-xl bg-blue-50 border border-blue-200 text-base font-medium text-blue-900 placeholder:text-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              required
              autoComplete="current-password"
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
          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-900 text-white text-base font-extrabold shadow-xl transition-all"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* SSO Buttons */}
        <div className="flex flex-col gap-2 mt-5 w-full">
          <div className="text-xs text-gray-500 text-center">or sign in with</div>
          {SSO_PROVIDERS.map(provider => (
            <button
              key={provider.name}
              type="button"
              onClick={provider.onClick}
              className={`flex items-center justify-center py-2 w-full rounded-xl font-bold mb-1 ${provider.bg} hover:shadow-md transition`}
            >
              {provider.icon} Sign in with {provider.name}
            </button>
          ))}
        </div>

        {/* Action Links */}
        <div className="flex justify-between w-full mt-6">
          <Link href="/SignupScreen" className="text-sm text-blue-700 hover:underline font-semibold">
            Don&apos;t have an account? <span className="underline">Sign up</span>
          </Link>
          <button
            onClick={toggleForgotPasswordDialog}
            className="text-sm text-blue-600 hover:underline font-semibold"
            type="button"
          >
            Forgot password?
          </button>
        </div>

        {/* Modal for forgot password */}
        <Transition
          show={showForgotPasswordDialog}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl shadow-2xl px-8 py-7 max-w-md w-full flex flex-col items-center">
              <h2 className="text-lg font-bold mb-2 text-blue-900">Reset your password</h2>
              <p className="mb-5 text-gray-500 text-sm text-center">Please contact Maindo support to reset your password.</p>
              <button
                onClick={toggleForgotPasswordDialog}
                className="px-6 py-2 bg-blue-500 rounded-full text-white font-bold hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </Transition>
      </motion.div>
    </div>
  );
}
