"use client";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import { SocialIcon } from "react-social-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import type { RootState } from "@/redux/store";

// Only these keys can be used for socials:
export type FooterSocialKey = "facebook" | "linkedin" | "twitter" | "instagram";

// Your AboutUsData should have at least these fields:
interface AboutUsData {
  logo: string;
  address: string;
  backgroundImage: string;
  facebook: string;
  linkedin: string | null;
  twitter: string;
  instagram: string;
  // ...other fields you use
}

// Only keys in AboutUsData, type safe!
const socials: { key: FooterSocialKey; color: string }[] = [
  { key: "facebook", color: "#3b5998" },
  { key: "linkedin", color: "#0077b5" },
  { key: "twitter", color: "#1da1f2" },
  { key: "instagram", color: "#e4405f" },
];

const badges = [
  {
    label: "Proudly South African",
    img: "/badges/south-africa.svg",
    alt: "Proudly South African",
  },
  {
    label: "Top Rated Agency",
    img: "/badges/top-rated.svg",
    alt: "Top Rated Digital Agency",
  },
  {
    label: "Google Partner",
    img: "/badges/google-partner.svg",
    alt: "Google Partner",
  },
];

const Footer = () => {
  // AboutUsData | null from Redux
  const aboutUs: AboutUsData | null = useAppSelector(
    (s: RootState) => s.aboutUs.data
  );
  const year = new Date().getFullYear();
  const [subscribed, setSubscribed] = useState(false);

  if (!aboutUs) return null;

  return (
    <footer
      className="w-full relative bg-gradient-to-br from-gray-900 via-blue-950 to-blue-900"
      style={{
        backgroundImage: aboutUs.backgroundImage
          ? `linear-gradient(115deg, rgba(19,22,29,0.98), rgba(24,40,78,0.93)), url(${aboutUs.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* CTA + Logo */}
        <div className="flex flex-col gap-5">
          <Image
            src={aboutUs.logo}
            alt="Logo"
            width={110}
            height={50}
            className="rounded bg-white/90 p-3 shadow-lg"
            priority
          />
          <div className="text-gray-200 font-semibold text-base">
            Innovative Digital Solutions for Growth.<br />
            <span className="text-blue-300">{aboutUs.address}</span>
          </div>
          <div className="mt-4">
            <p className="text-white text-lg font-extrabold leading-tight">
              Let’s build something <span className="text-blue-400">great</span> together!
            </p>
            <Link
              href="/contact"
              className="inline-block mt-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-800 text-white rounded-full font-bold shadow transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
        {/* Company/Resources */}
        <div>
          <div className="text-blue-300 uppercase font-bold mb-3 text-sm tracking-wide">Company</div>
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/about-us" className="hover:text-blue-400 text-gray-200 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-blue-400 text-gray-200 transition">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-blue-400 text-gray-200 transition">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-blue-400 text-gray-200 transition">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-blue-400 text-gray-200 transition">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        {/* Socials + Newsletter */}
        <div>
          <div className="text-blue-300 uppercase font-bold mb-3 text-sm tracking-wide">Connect</div>
          <div className="flex gap-2 mb-5">
            {socials.map(({ key, color }) => {
              // TypeScript is now happy! key is always keyof AboutUsData
              const url = aboutUs[key];
              if (!url) return null;
              return (
                <motion.div
                  whileHover={{ scale: 1.18, rotate: 7 }}
                  whileTap={{ scale: 0.96 }}
                  key={key}
                >
                  <SocialIcon
                    url={url}
                    fgColor="#fff"
                    bgColor={color}
                    style={{ height: 38, width: 38 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                </motion.div>
              );
            })}
          </div>
          <form
            className="flex flex-col gap-2 mt-3"
            onSubmit={e => {
              e.preventDefault();
              setSubscribed(true);
              setTimeout(() => setSubscribed(false), 2200);
            }}
          >
            <label htmlFor="footer-newsletter" className="text-gray-300 font-medium mb-1">
              Newsletter
            </label>
            <div className="relative">
              <input
                id="footer-newsletter"
                type="email"
                placeholder="Your email address"
                required
                className="px-3 py-2 pr-11 rounded bg-gray-800 border border-gray-700 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                disabled={subscribed}
              />
              <AnimatePresence>
                {subscribed && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5, x: 18 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: 18 }}
                    transition={{ duration: 0.4 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <FaCheckCircle className="text-green-400 text-xl" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <button
              type="submit"
              className={`w-fit px-4 py-1.5 rounded bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold shadow transition ${subscribed ? "opacity-60 pointer-events-none" : ""}`}
            >
              {subscribed ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-blue-900/40 py-4 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4">
        <div className="text-xs text-gray-400 mb-2 md:mb-0 tracking-wide">
          &copy; {year} Maindo Digital Agency. All Rights Reserved.
        </div>
        <div className="flex gap-4 text-xs text-gray-400">
          <Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link>
          <span className="hidden md:inline-block">|</span>
          <Link href="/terms" className="hover:text-blue-400 transition">Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
