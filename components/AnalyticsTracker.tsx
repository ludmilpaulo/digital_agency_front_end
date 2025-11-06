"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMixpanel, registerOnce, track } from "@/lib/analytics/mixpanel";

function captureUtmOnce(searchParams: URLSearchParams) {
  const get = (k: string) => searchParams.get(k) ?? undefined;
  const any =
    get("utm_source") || get("utm_medium") || get("utm_campaign") || get("utm_content") || get("utm_term");
  if (any) {
    registerOnce({
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      utm_content: get("utm_content"),
      utm_term: get("utm_term"),
    });
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prev = useRef<string>("");
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (hasInitialized.current) return;
    
    const m = initMixpanel();
    if (!m) return;
    
    hasInitialized.current = true;

    if (searchParams) captureUtmOnce(searchParams);
    const full = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    prev.current = full;
    track("Page View", { path: pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Only track if already initialized
    if (!hasInitialized.current) return;
    
    const full = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    if (prev.current && prev.current !== full) {
      track("Page View", { path: pathname });
      prev.current = full;
    }
  }, [pathname, searchParams]);

  return null;
}
