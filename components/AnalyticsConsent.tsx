"use client";

import { useEffect } from "react";
import { initMixpanel } from "@/lib/analytics/mixpanel";

const LS_KEY = "analytics-consent";

export default function AnalyticsConsent() {
  useEffect(() => {
    // Automatically grant consent without asking the user
    const saved = localStorage.getItem(LS_KEY);
    
    // If no consent is saved yet, automatically grant it
    if (!saved) {
      localStorage.setItem(LS_KEY, "granted");
    }
    
    // Always initialize Mixpanel
    initMixpanel();
  }, []);

  // Never render the consent banner
  return null;
}
