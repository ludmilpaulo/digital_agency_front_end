import { Suspense } from "react";
import HomeClient from "./HomeClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Enhanced metadata for homepage
export const metadata: Metadata = {
  title: "Maindo Digital Agency | Transform Your Business with Expert Digital Solutions",
  description: "🚀 South Africa's #1 Digital Agency ⭐ Web Development | Mobile Apps | SEO | E-Commerce | 100+ Happy Clients | 4.9/5 Rating | FREE Consultation | Get a Quote Today!",
  keywords: "web development south africa, mobile app development, digital marketing, SEO services, e-commerce solutions, Cape Town digital agency, best web developers south africa, affordable website design, professional app development, digital transformation",
  openGraph: {
    title: "Maindo Digital Agency | Expert Web Development & Digital Marketing in South Africa",
    description: "Transform your business with South Africa's leading digital agency. 🚀 Web Development | Mobile Apps | SEO | 100+ Happy Clients | ⭐ 4.9/5 Rating | FREE Consultation",
    url: "https://www.maindodigital.com",
    siteName: "Maindo Digital Agency",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maindo Digital Agency - Transform Your Business",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maindo Digital Agency | Web Dev, Apps & Digital Marketing",
    description: "🚀 Transform Your Business | 100+ Clients | ⭐ 4.9/5 | FREE Consultation | South Africa's #1 Digital Agency",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.maindodigital.com",
  },
};

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading amazing experience...</p>
        </div>
      </div>
    }>
      <HomeClient />
    </Suspense>
  );
}
