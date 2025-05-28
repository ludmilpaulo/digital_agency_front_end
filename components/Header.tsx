"use client";
import Link from "next/link";
import Image from "next/image";
import { SocialIcon } from "react-social-icons";
import { motion } from "framer-motion";
import { FaTimes, FaBars, FaHome, FaServer, FaUserCircle, FaBook, FaProjectDiagram } from "react-icons/fa";
import { useState } from "react";
import { useAppSelector } from "@/redux/store";

type SocialKey = 'facebook' | 'linkedin' | 'twitter' | 'instagram';

const socials: { key: SocialKey; color: string }[] = [
  { key: "facebook", color: "#3b5998" },
  { key: "linkedin", color: "#0077b5" },
  { key: "twitter", color: "#1da1f2" },
  { key: "instagram", color: "#e4405f" },
];

const headerStyles = {
  position: "fixed" as const,
  top: 0, left: 0, right: 0, zIndex: 50,
  backgroundColor: "rgba(0,0,0,0.85)",
  backdropFilter: "blur(5px)",
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: aboutUs } = useAppSelector((state) => state.aboutUs);

  // Wait for Redux data to hydrate
  if (!aboutUs) return null;

  return (
    <header style={headerStyles}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src={aboutUs.logo}
            alt="Logo"
            width={48}
            height={48}
            className="rounded-lg shadow-md group-hover:scale-110 transition-transform"
            priority
          />
          <span className="text-2xl font-bold text-white cursor-pointer tracking-tight group-hover:text-blue-400 transition">
            <span className="text-blue-400">Maindo</span> Digital
          </span>
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white text-3xl"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="hidden md:flex gap-4">
          <HeaderSocialLinks aboutUs={aboutUs} />
        </div>
      </div>
      <nav className={`bg-black/95 transition-all ${isMenuOpen ? "block" : "hidden"} md:block`}>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-center items-center text-white space-y-2 md:space-y-0 md:space-x-6 py-2"
        >
          <NavItem href="/" label="Home" icon={<FaHome />} />
          <NavItem href="/services" label="Services" icon={<FaServer />} />
          <NavItem href="/blog" label="Blog" icon={<FaBook />} />
          <NavItem href="/projects" label="Projects" icon={<FaProjectDiagram />} />
          <NavItem href="/about-us" label="About Us" icon={<FaUserCircle />} />
        </motion.ul>
      </nav>
    </header>
  );
};

const NavItem: React.FC<{ href: string; label: string; icon: JSX.Element }> = ({
  href,
  label,
  icon,
}) => (
  <li className="my-2 md:my-0">
    <Link
      href={href}
      className="flex flex-col items-center cursor-pointer hover:text-blue-400 transition-colors duration-300"
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-sm font-semibold">{label}</div>
    </Link>
  </li>
);

const HeaderSocialLinks: React.FC<{ aboutUs: any }> = ({ aboutUs }) => (
  <div className="flex gap-2">
    <motion.div
      initial={{ x: -60, opacity: 0, scale: 0.85 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 1.2 }}
      className="flex flex-row items-center"
    >
      {socials.map(({ key, color }) => {
        // Handles null, undefined, or empty strings
        const url = aboutUs[key] as string;
        if (!url) return null;
        return (
          <SocialIcon
            key={key}
            url={url}
            fgColor="#fff"
            bgColor={color}
            style={{
              height: 32,
              width: 32,
              transition: "opacity 0.2s",
            }}
            tabIndex={0}
            aria-disabled={false}
            target="_blank"
            rel="noopener noreferrer"
          />
        );
      })}
    </motion.div>
  </div>
);

export default Header;
