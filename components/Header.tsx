"use client";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import { SocialIcon } from "react-social-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaTimes, FaBars, FaHome, FaServer, FaUserCircle, FaBook, FaProjectDiagram, FaWhatsapp
} from "react-icons/fa";
import type { RootState } from "@/redux/store";

// SocialKey includes only the string fields in your AboutUsData that are social URLs
export type SocialKey = "facebook" | "linkedin" | "twitter" | "instagram" | "whatsapp";

export interface AboutUsData {
  id: number;
  title: string;
  logo: string;
  back: string;
  backgroundApp: string;
  backgroundImage: string;
  about: string;
  born_date: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  linkedin: string | null;
  facebook: string;
  twitter: string;
  instagram: string;
}

const NAV: { href: string; label: string; icon: JSX.Element }[] = [
  { href: "/", label: "Home", icon: <FaHome /> },
  { href: "/services", label: "Services", icon: <FaServer /> },
  { href: "/projects", label: "Projects", icon: <FaProjectDiagram /> },
  { href: "/blog", label: "Blog", icon: <FaBook /> },
  { href: "/about-us", label: "About Us", icon: <FaUserCircle /> },
];

const socials: { key: Exclude<SocialKey, "whatsapp">; color: string }[] = [
  { key: "facebook", color: "#3b5998" },
  { key: "linkedin", color: "#0077b5" },
  { key: "twitter", color: "#1da1f2" },
  { key: "instagram", color: "#e4405f" },
];

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  // Strictly AboutUsData | null
  const aboutUs: AboutUsData | null = useAppSelector(
    (state: RootState) => state.aboutUs.data
  );

  useEffect(() => setMounted(true), []);

  // Hydration-safe: Always SSR a placeholder
  if (!mounted || !aboutUs) {
    return (
      <header className="fixed w-full z-50 bg-black/70 backdrop-blur-xl shadow-lg h-20" />
    );
  }

  return (
    <header className="fixed w-full z-50 bg-black/70 backdrop-blur-xl shadow-lg">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src={aboutUs.logo}
            alt="Logo"
            width={48}
            height={48}
            className="rounded-lg bg-white shadow group-hover:scale-110 transition-transform"
            priority
          />
          <span className="text-2xl font-bold text-white tracking-tight group-hover:text-blue-400 transition">
            <span className="text-blue-400">Maindo</span> Digital
          </span>
        </Link>
        <nav className="hidden md:flex gap-4 items-center">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center px-3 py-1 rounded-xl text-white text-base gap-2 hover:bg-blue-600/20 hover:text-blue-400 font-semibold transition-all duration-200 relative group"
            >
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-1/2"></span>
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-4 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow transition"
          >
            Get a Quote
          </Link>
          <div className="flex gap-2 ml-3">
            {socials.map(({ key, color }) => {
              const url = aboutUs[key];
              if (!url) return null;
              return (
                <SocialIcon
                  key={key}
                  url={url}
                  fgColor="#fff"
                  bgColor={color}
                  style={{ height: 28, width: 28 }}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              );
            })}
          </div>
        </nav>
        {/* Mobile */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white text-3xl">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -200, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black/95 flex flex-col gap-6 items-center justify-center text-2xl"
          >
            {NAV.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 text-white hover:text-blue-400 font-bold transition"
              >
                <span>{icon}</span> {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="px-8 py-3 mt-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg shadow transition"
              onClick={() => setOpen(false)}
            >
              Get a Quote
            </Link>
            <div className="flex gap-4 mt-6">
              {socials.map(({ key, color }) => {
                const url = aboutUs[key];
                if (!url) return null;
                return (
                  <SocialIcon
                    key={key}
                    url={url}
                    fgColor="#fff"
                    bgColor={color}
                    style={{ height: 36, width: 36 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      {/* WhatsApp Floating */}
      {aboutUs.whatsapp && (
        <a
          href={`https://wa.me/${aboutUs.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-7 right-7 z-[60] bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-lg transition-all animate-bounce"
        >
          <FaWhatsapp className="text-white text-2xl" />
        </a>
      )}
    </header>
  );
};

export default Header;
