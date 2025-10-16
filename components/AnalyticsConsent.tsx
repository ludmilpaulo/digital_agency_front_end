"use client";

import { useEffect, useState } from "react";
import { initMixpanel, reset } from "@/lib/analytics/mixpanel";

const LS_KEY = "analytics-consent";

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<"granted" | "denied" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved === "accepted" || saved === "granted") {
      setConsent("granted");
    } else if (saved === "denied") {
      setConsent("denied");
    }
  }, []);

  useEffect(() => {
    if (consent === "granted") initMixpanel();
    if (consent === "denied") reset();
  }, [consent]);

  if (consent) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg rounded-2xl bg-white border shadow p-4">
      <p className="text-sm">
        We use analytics (Mixpanel) to improve Maindo’s experience. Do you consent to anonymous usage tracking?
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => {
            localStorage.setItem(LS_KEY, "denied");
            setConsent("denied");
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
        >
          No, thanks
        </button>
        <button
          onClick={() => {
            localStorage.setItem(LS_KEY, "accepted");
            setConsent("granted");
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Allow
        </button>
      </div>
    </div>
  );
}
