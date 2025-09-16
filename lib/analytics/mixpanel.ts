"use client";

import mixpanel, { Mixpanel } from "mixpanel-browser";

/** ===== Event Catalog (Maindo Digital, non-ecommerce) ===== */
export type EventName =
  // Website engagement
  | "Page View"
  | "CTA Clicked"
  | "Section Viewed"
  // Lead gen
  | "Contact Form Opened"
  | "Contact Form Submitted"
  | "Quote Requested"
  | "Newsletter Signup"
  | "Lead Captured"
  | "Consultation Booked"
  | "Proposal Downloaded"
  // Quality/Error/Feedback
  | "Error Shown"
  | "Feedback Submitted";

/** ===== Strongly-typed props ===== */
type Scalar = string | number | boolean | null | undefined;
type List = string[] | number[];
export type Props = Record<string, Scalar | List>;

export interface IdentifyProps extends Props {
  email?: string;
  name?: string;
  company?: string;
  role?: string;
  plan?: string;
  createdAt?: string; // ISO
}

/** ===== Singleton init ===== */
let initialized = false;

function apiHost(): string | undefined {
  const v = process.env.NEXT_PUBLIC_MIXPANEL_API_HOST?.trim();
  return v || undefined;
}

export function initMixpanel(): Mixpanel | null {
  if (typeof window === "undefined") return null;
  if (initialized) return mixpanel;

  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";
  if (!token || !enabled) return null;

  mixpanel.init(token, {
    api_host: apiHost(),
    debug: process.env.NEXT_PUBLIC_MIXPANEL_DEBUG === "true",
    track_pageview: false, // manual via router
    persistence: "localStorage",
  });

  // App-wide super props
  mixpanel.register({
    app: "Maindo Digital",
    env: process.env.NODE_ENV,
    locale: navigator.language,
  });

  initialized = true;
  return mixpanel;
}

/** ===== Low-level API (keep internal use simple) ===== */
export function track(event: EventName, props?: Props): void {
  if (!initialized) return;
  mixpanel.track(event, props);
}

export function identify(userId: string, props?: IdentifyProps): void {
  if (!initialized) return;
  mixpanel.identify(userId);
  if (props && Object.keys(props).length) mixpanel.people.set(props);
}

export function reset(): void {
  if (!initialized) return;
  mixpanel.reset();
}

export function registerSuper(props: Props): void {
  if (!initialized) return;
  mixpanel.register(props);
}

export function registerOnce(props: Props): void {
  if (!initialized) return;
  mixpanel.register_once(props);
}

/** ===== Convenience helpers (use these in UI code) ===== */
// Engagement
export function trackPageView(path: string): void {
  track("Page View", { path });
}

export function trackCtaClicked(cta: string, placement?: string): void {
  track("CTA Clicked", { cta, placement });
}

export function trackSectionViewed(section: "Services" | "Portfolio" | "Testimonials" | "Pricing" | "About"): void {
  track("Section Viewed", { section });
}

// Lead gen
export function trackContactFormOpened(placement?: string): void {
  track("Contact Form Opened", { placement });
}

export function trackContactFormSubmitted(args: {
  name?: string;
  email?: string;
  service?: string;
  messageLength?: number;
  source?: string; // e.g., utm or ref
}): void {
  track("Contact Form Submitted", args);
}

export function trackQuoteRequested(args: { service: string; budget?: string; timeline?: string }): void {
  track("Quote Requested", args);
}

export function trackNewsletterSignup(email: string): void {
  track("Newsletter Signup", { email });
}

export function trackLeadCaptured(source: string): void {
  track("Lead Captured", { source });
}

export function trackConsultationBooked(method: "Calendly" | "Email" | "Phone", whenISO?: string): void {
  track("Consultation Booked", { method, when: whenISO });
}

export function trackProposalDownloaded(service: string): void {
  track("Proposal Downloaded", { service });
}

// Quality/Error/Feedback
export function trackError(where: string, code?: string, message?: string): void {
  track("Error Shown", { where, code, message });
}

export function trackFeedback(rating: number, message?: string): void {
  track("Feedback Submitted", { rating, message });
}
