import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maindo Digital Agency | Innovative Digital Solutions & Services",
  description: "Maindo Digital Agency offers comprehensive digital marketing, web development, UX/UI design, mobile app development, and e-commerce solutions to elevate your business in the digital landscape.",
  keywords: "digital agency, digital marketing, web development, UX/UI design, mobile app development, e-commerce solutions, branding, SEO, PPC, social media management, data analytics",
  author: "Maindo Digital Agency",
  openGraph: {
    title: "Maindo Digital Agency | Innovative Digital Solutions & Services",
    description: "Partner with Maindo Digital Agency for expert digital marketing, web development, UX/UI design, mobile app development, and e-commerce solutions. Transform your business with our innovative digital strategies.",
    url: "https://www.maindodigital.com",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.maindodigital.com/statics/og-image.jpg",
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
        url: "https://www.maindodigital.com/statics/twitter-image.jpg",
        alt: "Maindo Digital Agency",
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </StoreProvider>
  );
}
