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


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maindo Digital Agency | Innovative Digital Solutions & Services",
  description: "Maindo Digital Agency offers comprehensive digital marketing, web development, UX/UI design, mobile app development, and e-commerce solutions to elevate your business in the digital landscape.",
  keywords: "digital agency, digital marketing, web development, UX/UI design, mobile app development, e-commerce solutions, branding, SEO, PPC, social media management, data analytics",
  authors: [
    { name: "Maindo Digital Agency", url: "https://www.maindodigital.com" },
  ],
  openGraph: {
    title: "Maindo Digital Agency | Innovative Digital Solutions & Services",
    description: "Partner with Maindo Digital Agency for expert digital marketing, web development, UX/UI design, mobile app development, and e-commerce solutions. Transform your business with our innovative digital strategies.",
    url: "https://www.maindodigital.com",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://maindoagency.pythonanywhere.com/media/carousel_images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maindo Digital Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@maindodigital",
    creator: "@maindodigital",
    title: "Maindo Digital Agency | Innovative Digital Solutions & Services",
    description: "Maindo Digital Agency offers comprehensive digital marketing, web development, UX/UI design, mobile app development, and e-commerce solutions to elevate your business in the digital landscape.",
    images: [
      {
        url: "https://maindoagency.pythonanywhere.com/media/carousel_images/twitter-image.jpg",
        alt: "Maindo Digital Agency",
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
  
      <html lang="en">
      <head>
          {/* Ahrefs Analytics Script */}
          <Script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key="ouQu5v62l4/FTsePpkTBVw"
            strategy="afterInteractive"
          />
        </head>
        <body className={inter.className}>
         <StoreProvider>
          <FetchAboutUsClient />
          <Header />
          {children}
          <Footer />
        </StoreProvider>
        </body>
      </html>

  );
}