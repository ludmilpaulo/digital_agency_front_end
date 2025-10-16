"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

const baseAPI = process.env.NEXT_PUBLIC_BASE_API || "https://maindoagency.pythonanywhere.com";

export default function ForgotPasswordClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${baseAPI}/account/request-password-reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSent(true);
        toast.success("Password reset link sent! Check your email.");
      } else {
        toast.error(data.error || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      console.error("Reset request error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <Link
          href="/LoginScreenUser"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <FaArrowLeft />
          Back to Login
        </Link>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          {!sent ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="text-white text-2xl" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
                <p className="text-gray-600">
                  No worries! Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
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
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              {/* Remember Password */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link
                    href="/LoginScreenUser"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-green-600 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Check Your Email!</h2>
                <p className="text-gray-600 mb-6">
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
                  <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Check your email inbox</li>
                    <li>Click the reset link in the email</li>
                    <li>Create your new password</li>
                    <li>Sign in with your new password</li>
                  </ol>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setSent(false);
                      setEmail("");
                    }}
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    try again
                  </button>
                </p>

                <Link
                  href="/LoginScreenUser"
                  className="inline-block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all"
                >
                  Back to Login
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

