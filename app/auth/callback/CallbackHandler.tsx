"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";

export default function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");
    const redirectPath = searchParams.get("redirect") || "/";
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      router.push(`/LoginScreenUser?error=${error}`);
      return;
    }

    if (token && userStr) {
      try {
        // Parse user data
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Store in localStorage
        localStorage.setItem("maindo_token", token);
        localStorage.setItem("maindo_user", JSON.stringify(user));
        
        // Dispatch to Redux
        dispatch(loginUser(user));
        
        // Redirect to appropriate dashboard
        router.push(redirectPath);
      } catch (e) {
        console.error("Error processing OAuth callback:", e);
        router.push("/LoginScreenUser?error=invalid_response");
      }
    } else {
      router.push("/LoginScreenUser?error=missing_data");
    }
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
        <p className="text-white text-xl font-semibold">Signing you in...</p>
        <p className="text-white/70 text-sm mt-2">Please wait while we complete the authentication</p>
      </div>
    </div>
  );
}

