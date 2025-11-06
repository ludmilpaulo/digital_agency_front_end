"use client";

import Image from "next/image";
import { css } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import { Transition } from "@headlessui/react";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, User, Shield, Briefcase, Globe } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { baseAPI } from "@/useAPI/api";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";
import { persistor } from "@/redux/store";
import type { User as UserType } from "@/types/blog";
import toast, { Toaster } from "react-hot-toast";

const cardStyles = css`
  background: rgba(255, 255, 255, 0.82);
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
    icon: (
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    bg: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    onClick: () => {
      // client-only navigation to Google OAuth
      window.location.href = `${baseAPI}/accounts/google/login/`;
    },
  },
];

const ROLE_ICONS: Record<string, JSX.Element> = {
  Admin: <Shield className="inline-block w-5 h-5 text-blue-700 mr-1" />,
  Staff: <Briefcase className="inline-block w-5 h-5 text-blue-500 mr-1" />,
  Executive: <Shield className="inline-block w-5 h-5 text-blue-700 mr-1" />,
  Freelancer: <User className="inline-block w-5 h-5 text-yellow-500 mr-1" />,
  Basic: <User className="inline-block w-5 h-5 text-gray-400 mr-1" />,
  User: <User className="inline-block w-5 h-5 text-blue-400 mr-1" />,
};

function getRedirectPath(user: UserType): string {
  const groups = user.groups || [];
  
  // Superuser (Admin) → Admin Dashboard
  if (user.is_superuser) {
    return "/admin";
  }
  
  // Staff (non-admin) → Developer Dashboard
  if (user.is_staff) {
    return "/devDashBoard";
  }
  
  // Executive → Admin Dashboard
  if (groups.includes("Executive") || groups.includes("admin")) {
    return "/admin";
  }
  
  // Developer/Freelancer → Developer Dashboard
  if (groups.includes("Freelancer") || groups.includes("Developer")) {
    return "/devDashBoard";
  }
  
  // Basic/Normal User → User Dashboard
  if (groups.includes("Basic")) {
    return "/userDashboard";
  }
  
  // Default → User Dashboard
  return "/userDashboard";
}

function getRole(user: UserType | null): string {
  if (!user) return "User";
  if (user.is_superuser) return "Admin";
  if (user.is_staff) return "Staff";
  if (user.groups.includes("Executive")) return "Executive";
  if (user.groups.includes("Freelancer")) return "Freelancer";
  if (user.groups.includes("Basic")) return "Basic";
  return "User";
}

interface ErrorResponse {
  error?: string;
  detail?: string;
  [key: string]: unknown;
}

export default function LoginScreenUserClient() {
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

  // Guard browser storage to avoid issues during build or unexpected server contexts
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!sessionStorage.getItem("store_reset")) {
        dispatch({ type: "RESET_APP" });
        persistor.purge();
        sessionStorage.setItem("store_reset", "true");
      }
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAboutUsData().then(setHeaderData);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("maindo_user");
      if (user) {
        try {
          const parsed: UserType = JSON.parse(user);
          setUserRole(getRole(parsed));
        } catch {
          // ignore parse errors
        }
      }
    }
  }, []);

  const toggleForgotPasswordDialog = () => setShowForgotPasswordDialog((v) => !v);
  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Attempting login with:", { username, endpoint: `${baseAPI}/account/custom-login/` });
      
      const res = await fetch(`${baseAPI}/account/custom-login/`, {
        method: "POST",
        headers: { 
          Accept: "application/json", 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Important for CORS
        mode: 'cors', // Explicitly set CORS mode
      });

      console.log("Login response status:", res.status, "OK:", res.ok);

      const resJson: UserType | ErrorResponse = await res.json();
      console.log("Login response:", { status: res.status, hasUsername: "username" in resJson, data: resJson });

      if (res.status === 200 && "username" in resJson) {
        const user = resJson as UserType;
        console.log("Login successful for user:", user.username);
        
        // Store user in Redux
        dispatch(loginUser(user));
        setUserRole(getRole(user));
        
        // Store user in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("maindo_user", JSON.stringify(user));
        }
        
        // Show success message
        toast.success(`Welcome back, ${user.username}!`);
        
        // Redirect to appropriate dashboard
        const redirectPath = getRedirectPath(user);
        console.log("Redirecting to:", redirectPath);
        
        setTimeout(() => {
          router.push(redirectPath);
        }, 500);
      } else {
        // Handle detailed error messages from backend
        const errorResponse = resJson as any;
        const errorMsg = errorResponse.error || errorResponse.detail || "Invalid credentials, please try again.";
        const suggestion = errorResponse.suggestion || "";
        const field = errorResponse.field || "credentials";
        
        console.error("Login error:", { 
          message: errorMsg, 
          field, 
          suggestion,
          status: res.status 
        });
        
        // Display specific error message based on status
        if (res.status === 404) {
          // User doesn't exist
          setError(errorMsg);
          toast.error(errorMsg, { duration: 5000 });
          if (suggestion) {
            setTimeout(() => {
              toast(suggestion, { 
                duration: 4000,
                icon: '💡',
                style: {
                  background: '#3b82f6',
                  color: '#fff',
                }
              });
            }, 1000);
          }
        } else if (res.status === 401) {
          // Wrong password
          setError(errorMsg);
          toast.error(errorMsg, { duration: 4000 });
          if (suggestion) {
            setTimeout(() => {
              toast(suggestion, { 
                duration: 4000,
                icon: '💡',
                style: {
                  background: '#3b82f6',
                  color: '#fff',
                }
              });
            }, 1000);
          }
        } else if (res.status === 403) {
          // Account deactivated
          setError(errorMsg);
          toast.error(errorMsg, { duration: 6000 });
        } else {
          // Generic error
          setError(errorMsg);
          toast.error(errorMsg);
        }
      }
    } catch (err: any) {
      console.error("Login exception:", err);
      const errorMsg = err?.message 
        ? `Login failed: ${err.message}` 
        : "Network error. Please check your connection and try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
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

        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="relative">
            <User className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-200" size={18} />
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
            className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-900 text-white text-base font-extrabold shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* SSO Buttons */}
        <div className="flex flex-col gap-2 mt-5 w-full">
          <div className="text-xs text-gray-500 text-center">or sign in with</div>
          {SSO_PROVIDERS.map((provider) => (
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
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline font-semibold"
          >
            Forgot password?
          </Link>
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
              <p className="mb-5 text-gray-500 text-sm text-center">
                Please contact Maindo support to reset your password.
              </p>
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
    </>
  );
}
