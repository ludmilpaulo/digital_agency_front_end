"use client";

import { useEffect, useState } from "react";
import { initMixpanel, reset } from "@/lib/analytics/mixpanel";

const LS_KEY = "maindo_analytics_consent";

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<"granted" | "denied" | null>(null);

  useEffect(() => {
    const saved = (localStorage.getItem(LS_KEY) as "granted" | "denied" | null) ?? null;
    setConsent(saved);
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
          className="px-3 py-2 rounded-xl border"
        >
          No, thanks
        </button>
        <button
          onClick={() => {
            localStorage.setItem(LS_KEY, "granted");
            setConsent("granted");
          }}
          className="px-3 py-2 rounded-xl bg-slate-900 text-white"
        >
          Allow
        </button>
      </div>
    </div>
  );
}
