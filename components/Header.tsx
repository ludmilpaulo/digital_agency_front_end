"use client";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import { SocialIcon } from "react-social-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaTimes, FaBars, FaHome, FaServer, FaUserCircle, FaBook, FaProjectDiagram, FaWhatsapp,
} from "react-icons/fa";
import type { RootState } from "@/redux/store";

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

const NAV = [
  { href: "/", label: "Home", icon: <FaHome /> },
  { href: "/services", label: "Services", icon: <FaServer /> },
 // { href: "/projects", label: "Projects", icon: <FaProjectDiagram /> },
  { href: "/blog", label: "Blog", icon: <FaBook /> },
  { href: "/about-us", label: "About Us", icon: <FaUserCircle /> },
];

const socials = [
  { key: "facebook", color: "#3b5998" },
  { key: "linkedin", color: "#0077b5" },
  { key: "twitter", color: "#1da1f2" },
  { key: "instagram", color: "#e4405f" },
];

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const aboutUs: AboutUsData | null = useAppSelector(
    (state: RootState) => state.aboutUs.data
  );
const NAVBAR_BG = "bg-black"; // Same as desktop, but without transparency for mobile drawer

  useEffect(() => setMounted(true), []);

  // Hydration-safe SSR placeholder
  if (!mounted || !aboutUs) {
    return (
      <header className="fixed w-full z-50 bg-black/70 backdrop-blur-xl shadow-lg h-20" />
    );
  }

  return (
    <header className="fixed w-full z-50 bg-black/70 backdrop-blur-xl shadow-lg">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src={aboutUs.logo}
            alt="Logo"
            width={48}
            height={48}
            className="rounded-2xl bg-white shadow group-hover:scale-110 transition-transform"
            priority
          />
          <span className="text-2xl font-extrabold text-white tracking-tight group-hover:text-blue-400 transition">
            <span className="text-blue-400">Maindo</span> Digital
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4 items-center">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center px-4 py-2 rounded-xl text-white text-base gap-2 hover:bg-blue-600/20 hover:text-blue-400 font-semibold transition-all duration-200 relative group"
            >
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-1/2"></span>
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-lg transition"
          >
            Get a Quote
          </Link>
          <div className="flex gap-2 ml-3">
            {socials.map(({ key, color }) => {
              const url = aboutUs[key as keyof AboutUsData] as string;
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

        {/* Mobile Nav Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden bg-black/70 text-white text-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          aria-label="Toggle navigation"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Slider Nav */}
<AnimatePresence>
  {open && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/70"
        onClick={() => setOpen(false)}
      />
      {/* Side Drawer */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 right-0 w-4/5 max-w-xs h-full z-60 flex flex-col items-center pt-10 pb-8 px-8 bg-black/70 shadow-2xl`}
        style={{
          // fallback if Tailwind class gets purged
          backgroundColor: "#000",
        }}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5 bg-black/70 text-white text-3xl z-70"
          aria-label="Close navigation"
        >
          <FaTimes />
        </button>
        <div className="flex flex-col bg-black/70 items-center mb-8">
          <Image
            src={aboutUs.logo}
            alt="Logo"
            width={60}
            height={60}
            className="rounded-2xl bg-black/70 shadow mb-2"
            priority
          />
          <span className="text-2xl bg-black/70 font-extrabold text-white tracking-tight">
            <span className="text-blue-400 bg-black/70">Maindo</span> Digital
          </span>
        </div>
        <nav className="flex flex-col bg-black/70 gap-6 w-full">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 bg-black/70 text-white text-lg font-bold px-4 py-3 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition w-full"
            >
              <span className="text-xl">{icon}</span>
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="w-full mt-3 px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-lg shadow-lg transition"
          >
            Get a Quote
          </Link>
        </nav>
        <div className="flex bg-black/70 gap-4 mt-10">
          {socials.map(({ key, color }) => {
            const url = aboutUs[key as keyof AboutUsData] as string;
            if (!url) return null;
            return (
              <SocialIcon
                key={key}
                url={url}
                fgColor="#fff"
                bgColor={color}
                style={{ height: 34, width: 34 }}
                target="_blank"
                rel="noopener noreferrer"
              />
            );
          })}
        </div>
      </motion.aside>
    </>
  )}
</AnimatePresence>



      {/* WhatsApp Floating */}
      {aboutUs.whatsapp && (
        <a
          href={`https://wa.me/${aboutUs.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-7 right-7 z-[60] bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-2xl transition-all animate-bounce"
        >
          <FaWhatsapp className="text-white text-3xl" />
        </a>
      )}
    </header>
  );
};

export default Header;
