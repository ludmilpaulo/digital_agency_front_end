"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const baseAPI = process.env.NEXT_PUBLIC_BASE_API || "https://maindoagency.pythonanywhere.com";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validLink, setValidLink] = useState(true);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (!emailParam || !tokenParam) {
      setValidLink(false);
      toast.error("Invalid reset link");
    } else {
      setEmail(emailParam);
      setToken(tokenParam);
    }
  }, [searchParams]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${baseAPI}/account/reset-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          router.push("/LoginScreenUser");
        }, 3000);
      } else {
        toast.error(data.error || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!validLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-red-600 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          {!success ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaLock className="text-white text-2xl" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
                <p className="text-gray-600">
                  Create a new password for <strong>{email}</strong>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicators */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
                      ✓ At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
                      ✓ Include uppercase letter (recommended)
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
                      ✓ Include number (recommended)
                    </li>
                    <li className={/[!@#$%^&*]/.test(newPassword) ? "text-green-600" : ""}>
                      ✓ Include special character (recommended)
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Resetting Password...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-green-600 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Password Reset Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Your password has been reset successfully. You can now login with your new password.
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 text-left">
                  <p className="text-sm text-green-800">
                    Redirecting you to the login page in 3 seconds...
                  </p>
                </div>
                <Link
                  href="/LoginScreenUser"
                  className="inline-block w-full py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all"
                >
                  Go to Login Now
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-white/70 text-sm mt-6">
          Need help?{" "}
          <Link href="/contact" className="text-white hover:underline font-semibold">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

