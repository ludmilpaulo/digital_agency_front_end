"use client";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { selectUser, logoutUser } from "@/redux/slices/authSlice";
import { SocialIcon } from "react-social-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  FaTimes, FaBars, FaHome, FaServer, FaUserCircle, FaBook, FaTachometerAlt, FaSignOutAlt, FaWhatsapp
} from "react-icons/fa";
import { useRouter } from "next/navigation";

/* MIXPANEL */
import { trackCtaClicked } from "@/lib/analytics/mixpanel";

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
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const aboutUs: AboutUsData | null = useAppSelector((state) => state.aboutUs.data);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!dropdown) return;
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdown(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [dropdown]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdown(false);
    setOpen(false);
    router.push("/");
  };

  if (!mounted || !aboutUs) {
    return <header className="fixed w-full z-50 bg-black/70 backdrop-blur-xl shadow-lg h-20" />;
  }

  return (
    <header className="fixed w-full z-50 bg-black/80 backdrop-blur-xl shadow-lg">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => trackCtaClicked("Logo", "Nav")}
        >
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
              onClick={() => trackCtaClicked(label, "Nav")}
              className="flex items-center px-4 py-2 rounded-xl text-white text-base gap-2 hover:bg-blue-600/20 hover:text-blue-400 font-semibold transition-all duration-200 relative group"
            >
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-1/2"></span>
            </Link>
          ))}
          {user && (
            <Link
              href="/admin"
              onClick={() => trackCtaClicked("My Dashboard", "Nav")}
              className="flex items-center px-4 py-2 rounded-xl text-white text-base gap-2 hover:bg-blue-600/20 hover:text-blue-400 font-semibold transition-all duration-200 relative group"
            >
              <span className="text-xl"><FaTachometerAlt /></span>
              <span>My Dashboard</span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-1/2"></span>
            </Link>
          )}
          <Link
            href="/contact"
            onClick={() => trackCtaClicked("Get a Quote", "Nav")}
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
                  onClick={() => trackCtaClicked(String(key), "Social Header")}
                />
              );
            })}
          </div>
          {/* Avatar Dropdown */}
          {user && (
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={() => setDropdown((d) => !d)}
                className="flex items-center space-x-2 group focus:outline-none"
                aria-label="Open user menu"
              >
                <Image
                  src={user.avatar || "/logo.png"}
                  alt={user.username || "User"}
                  width={38}
                  height={38}
                  className="rounded-full border-2 border-blue-400 group-hover:scale-110 transition"
                />
                <span className="text-white font-semibold hidden lg:block">{user.username || user.email}</span>
                <svg className="w-4 h-4 fill-current text-white group-hover:text-blue-400" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z"/></svg>
              </button>
              <AnimatePresence>
                {dropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-blue-50"
                  >
                    <div className="flex items-center px-4 py-3 border-b gap-2">
                      <Image
                        src={user.avatar || "/logo.png"}
                        alt={user.username || "User"}
                        width={34}
                        height={34}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-semibold">{user.username || "User"}</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      </div>
                    </div>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-blue-100 text-gray-800"
                      onClick={() => {
                        setDropdown(false);
                        trackCtaClicked("My Dashboard", "User Menu");
                      }}
                    >
                      <FaTachometerAlt className="text-blue-400" />
                      My Dashboard
                    </Link>
                    <button
                      className="flex items-center gap-2 px-4 py-3 w-full text-left hover:bg-red-100 text-gray-800"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="text-red-500" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* Mobile Nav Button */}
        <button
          onClick={() => {
            setOpen(!open);
            trackCtaClicked(!open ? "Open Mobile Menu" : "Close Mobile Menu", "Mobile Nav");
          }}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/70"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed top-0 right-0 w-4/5 max-w-xs h-full z-60 flex flex-col items-center pt-10 pb-8 px-8 bg-black/90 shadow-2xl"
              style={{ backgroundColor: "#000" }}
            >
              <button
                onClick={() => {
                  setOpen(false);
                  trackCtaClicked("Close Mobile Menu", "Mobile Nav");
                }}
                className="absolute top-5 right-5 bg-black/70 text-white text-3xl z-70"
                aria-label="Close navigation"
              >
                <FaTimes />
              </button>

              {/* Avatar on Mobile */}
              {user && (
                <div className="flex flex-col items-center mb-6">
                  <Image
                    src={user.avatar || "/logo.png"}
                    alt={user.username || "User"}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-blue-400 mb-2"
                  />
                  <span className="text-white font-semibold text-lg">{user.username || user.email}</span>
                </div>
              )}

              {/* Logo for unauthenticated mobile */}
              {!user && (
                <div className="flex flex-col items-center mb-8">
                  <Image
                    src={aboutUs.logo}
                    alt="Logo"
                    width={48}
                    height={48}
                    className="rounded-2xl bg-white shadow mb-2"
                  />
                  <span className="text-2xl font-extrabold text-white tracking-tight">
                    <span className="text-blue-400">Maindo</span> Digital
                  </span>
                </div>
              )}

              <nav className="flex flex-col gap-6 w-full">
                {NAV.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => {
                      setOpen(false);
                      trackCtaClicked(label, "Mobile Nav");
                    }}
                    className="flex items-center gap-4 text-white text-lg font-bold px-4 py-3 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition w-full"
                  >
                    <span className="text-xl">{icon}</span>
                    {label}
                  </Link>
                ))}
                {user && (
                  <Link
                    href="/admin"
                    onClick={() => {
                      setOpen(false);
                      trackCtaClicked("My Dashboard", "Mobile Nav");
                    }}
                    className="flex items-center gap-4 text-white text-lg font-bold px-4 py-3 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition w-full"
                  >
                    <span className="text-xl"><FaTachometerAlt /></span>
                    My Dashboard
                  </Link>
                )}
                {user && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 text-red-500 text-lg font-bold px-4 py-3 rounded-xl hover:bg-red-600/10 transition w-full"
                  >
                    <FaSignOutAlt className="text-red-500" />
                    Logout
                  </button>
                )}
                <Link
                  href="/contact"
                  onClick={() => {
                    setOpen(false);
                    trackCtaClicked("Get a Quote", "Mobile Nav");
                  }}
                  className="w-full mt-3 px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-lg shadow-lg transition"
                >
                  Get a Quote
                </Link>
              </nav>

              <div className="flex gap-4 mt-10">
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
                      onClick={() => trackCtaClicked(String(key), "Social Header")}
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
          onClick={() => trackCtaClicked("WhatsApp", "Floating")}
        >
          <FaWhatsapp className="text-white text-3xl" />
        </a>
      )}
    </header>
  );
};

export default Header;
