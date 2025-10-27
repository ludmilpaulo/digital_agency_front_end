import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Script from "next/script";
import { fetchAboutUs } from "@/redux/slices/aboutUsSlice";
import FetchAboutUsClient from "./FetchAboutUsClient";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import StructuredData, { LocalBusinessSchema } from "@/components/SEO/StructuredData";
import { WebsiteSchema, OffersSchema, RatingSchema } from "@/components/SEO/AdvancedSEO";
import CacheCleaner from "@/components/CacheCleaner";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.maindodigital.com'),
  title: {
    default: "Maindo Digital Agency | Web Development, Mobile Apps & Digital Marketing South Africa",
    template: "%s | Maindo Digital Agency"
  },
  description: "Transform your business with South Africa's leading digital agency. Expert web development, mobile apps, SEO, e-commerce & digital marketing. Get a FREE consultation today! ⭐ 4.9/5 Rating",
  keywords: [
    "web development south africa",
    "mobile app development cape town",
    "digital marketing johannesburg",
    "SEO services south africa",
    "e-commerce development",
    "UI UX design agency",
    "custom software development",
    "website design cape town",
    "app development south africa",
    "digital agency cape town",
    "responsive web design",
    "react development",
    "next.js development",
    "django development",
    "full stack development",
    "online marketing",
    "social media marketing",
    "branding agency",
    "graphic design south africa"
  ],
  authors: [
    { name: "Maindo Digital Agency", url: "https://www.maindodigital.com" },
  ],
  creator: "Maindo Digital Agency",
  publisher: "Maindo Digital Agency",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Maindo Digital Agency | Transform Your Business with Expert Digital Solutions",
    description: "🚀 South Africa's Premier Digital Agency | Web Development | Mobile Apps | SEO | E-Commerce | Get a FREE Consultation | 100+ Happy Clients | ⭐ 4.9/5",
    url: "https://www.maindodigital.com",
    siteName: "Maindo Digital Agency",
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maindo Digital Agency - Professional Digital Solutions",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@maindodigital",
    creator: "@maindodigital",
    title: "Maindo Digital Agency | Expert Web Development & Digital Marketing",
    description: "🚀 Transform Your Business | Web Dev | Mobile Apps | SEO | E-Commerce | FREE Consultation | ⭐ 4.9/5 | South Africa",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.maindodigital.com',
  },
  verification: {
    google: 'yc2OIYFEZ0Tvyo9R7ouvUjXAd45cxQFWTVgWxGjx7xA',
  },
  category: 'technology',
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
  
      <html lang="en-ZA">
      <head>
        {/* Preconnect and DNS Prefetch for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://maindoagency.pythonanywhere.com" />
        
        {/* Viewport and Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#2563eb" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e40af" media="(prefers-color-scheme: dark)" />
        
        {/* Analytics Scripts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HCWW2X2GZ4"
          strategy="afterInteractive"
        />
        
        {/* Ahrefs Analytics Script */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="ouQu5v62l4/FTsePpkTBVw"
          strategy="afterInteractive"
        />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="yc2OIYFEZ0Tvyo9R7ouvUjXAd45cxQFWTVgWxGjx7xA" />
        
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="ar7xr0n612aazr6ewlx09z34ed5dt1" />
      </head>
        <body className={inter.className}>
          {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HCWW2X2GZ4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HCWW2X2GZ4');
          `}
        </Script>

        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="ouQu5v62l4/FTsePpkTBVw"
          strategy="afterInteractive"
        />

        {/* Structured Data for SEO */}
        <StructuredData type="organization" />
        <StructuredData type="service" />
        <StructuredData type="faq" />
        <LocalBusinessSchema />
        <WebsiteSchema />
        <OffersSchema />
        <RatingSchema />

         <StoreProvider>
          <CacheCleaner />
          <FetchAboutUsClient />
          <Header />
          <AnalyticsConsent />
        <AnalyticsTracker />
          {children}
          <Footer />
        </StoreProvider>
        </body>
      </html>

  );
}