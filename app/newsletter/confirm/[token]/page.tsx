"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/useAPI/api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function NewsletterConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmSubscription = async () => {
      try {
        const response = await api.get(`/api/information/newsletter/confirm/${token}/`);
        setStatus("success");
        setMessage(response.data.detail || "Your email is now confirmed and you're subscribed! 🎉");
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.detail || 
          "Invalid or expired confirmation link. Please try subscribing again."
        );
      }
    };

    if (token) {
      confirmSubscription();
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Newsletter Confirmation
          </h1>
          <p className="text-gray-600 text-sm">
            Maindo Digital Agency
          </p>
        </div>

        {/* Status Display */}
        <div className="flex flex-col items-center justify-center py-8">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-700 text-center">
                Confirming your subscription...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
              <p className="text-gray-800 text-center font-semibold mb-2">
                Success!
              </p>
              <p className="text-gray-600 text-center text-sm">
                {message}
              </p>
              <p className="text-gray-500 text-center text-xs mt-4">
                Redirecting to homepage in 3 seconds...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 text-red-600 mb-4" />
              <p className="text-gray-800 text-center font-semibold mb-2">
                Oops! Something went wrong
              </p>
              <p className="text-gray-600 text-center text-sm mb-6">
                {message}
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go to Homepage
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-xs">
            Thank you for subscribing to our newsletter!
          </p>
        </div>
      </div>
    </div>
  );
}

