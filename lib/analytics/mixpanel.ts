import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
const MIXPANEL_TOKEN = 'fdb13340c58132944c02019cc4a17a09';

let initialized = false;

export const initMixpanel = () => {
  if (typeof window !== 'undefined' && !initialized) {
    // Check for user consent
    const consent = localStorage.getItem("analytics-consent");
    if (consent !== "accepted") {
      console.log('⚠️ Mixpanel: User consent not given');
      return null;
    }

    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: true,
      record_sessions_percent: 100,
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    });
  initialized = true;
    console.log('✅ Mixpanel initialized successfully');
  return mixpanel;
}
  return initialized ? mixpanel : null;
};

// Track generic event (used by AnalyticsTracker)
export const track = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && initialized) {
    mixpanel.track(eventName, properties);
  }
};

// Register properties once
export const registerOnce = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && initialized) {
    mixpanel.register_once(properties);
  }
};

// Track page view
export const trackPageView = (pageName: string) => {
  if (typeof window !== 'undefined') {
    mixpanel.track('Page View', {
      page: pageName,
      url: window.location.href,
      referrer: document.referrer,
    });
  }
};

// Track user events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    mixpanel.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }
};

// Identify user
export const identifyUser = (userId: string | number, userProperties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    mixpanel.identify(userId.toString());
    if (userProperties) {
      mixpanel.people.set(userProperties);
    }
  }
};

// Alias for identifyUser
export const identify = identifyUser;

// Track user login
export const trackLogin = (userId: string | number, method: string) => {
  identifyUser(userId);
  trackEvent('User Login', { method, userId });
};

// Track user signup
export const trackSignup = (userId: string | number, method: string) => {
  identifyUser(userId);
  trackEvent('User Signup', { method, userId });
};

// Track proposal submission
export const trackProposalSubmission = (data: {
  service: string;
  plan?: string;
  price?: string;
}) => {
  trackEvent('Proposal Submitted', data);
};

// Track service view
export const trackServiceView = (serviceName: string, slug: string) => {
  trackEvent('Service Viewed', { serviceName, slug });
};

// Track plan selection
export const trackPlanSelection = (service: string, plan: string, price: string) => {
  trackEvent('Plan Selected', { service, plan, price });
};

// Track document signing
export const trackDocumentSigned = (documentId: number, documentTitle: string) => {
  trackEvent('Document Signed', { documentId, documentTitle });
};

// Track task creation
export const trackTaskCreated = (taskData: any) => {
  trackEvent('Task Created', taskData);
};

// Track blog post view
export const trackBlogView = (postId: number, postTitle: string) => {
  trackEvent('Blog Post Viewed', { postId, postTitle });
};

// Track search
export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('Search Performed', { query, resultsCount });
};

// Track error
export const trackError = (errorMessage: string, errorStack?: string) => {
  trackEvent('Error Occurred', { errorMessage, errorStack });
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    mixpanel.people.set(properties);
  }
};

// Increment user property
export const incrementUserProperty = (property: string, amount: number = 1) => {
  if (typeof window !== 'undefined') {
    mixpanel.people.increment(property, amount);
  }
};

// Track timing
export const trackTiming = (eventName: string, duration: number, properties?: Record<string, any>) => {
  trackEvent(eventName, {
    ...properties,
    duration_ms: duration,
  });
};

// Reset user (on logout)
export const resetUser = () => {
  if (typeof window !== 'undefined') {
    mixpanel.reset();
  }
};

// Alias for reset
export const reset = resetUser;

// Track newsletter signup
export const trackNewsletterSignup = (email: string) => {
  trackEvent('Newsletter Signup', { email });
};

// Track CTA clicks
export const trackCtaClicked = (ctaName: string, location: string) => {
  trackEvent('CTA Clicked', { ctaName, location });
};

// Get distinct ID
export const getDistinctId = () => {
  if (typeof window !== 'undefined') {
    return mixpanel.get_distinct_id();
  }
  return null;
};

// Opt user out
export const optOut = () => {
  if (typeof window !== 'undefined') {
    mixpanel.opt_out_tracking();
  }
};

// Opt user in
export const optIn = () => {
  if (typeof window !== 'undefined') {
    mixpanel.opt_in_tracking();
  }
};

// Export mixpanel instance for advanced usage
export { mixpanel };

// Named export bundle
const analytics = {
  init: initMixpanel,
  trackPageView,
  trackEvent,
  identifyUser,
  trackLogin,
  trackSignup,
  trackProposalSubmission,
  trackServiceView,
  trackPlanSelection,
  trackDocumentSigned,
  trackTaskCreated,
  trackBlogView,
  trackSearch,
  trackError,
  setUserProperties,
  incrementUserProperty,
  trackTiming,
  resetUser,
  getDistinctId,
  optOut,
  optIn,
};

export default analytics;