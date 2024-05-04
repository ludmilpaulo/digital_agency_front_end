"use client";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component
import { SocialIcon } from "react-social-icons";
import { motion } from "framer-motion";
import React from "react";
import {
  FaTimes,
  FaBars,
  FaHome,
  FaServer,
  FaUserCircle,
  FaPhone,
  FaBook,
  FaProjectDiagram,
} from "react-icons/fa";

import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";

const headerStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Change here: Adjusting the type to include `undefined`
  const [headerData, setHeaderData] = useState<AboutUsData | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      // Change here: Convert null to undefined
      setHeaderData(data ?? undefined);
    };
    fetchData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header css={headerStyles}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-white cursor-pointer">
            Maindo
          </span>
        </Link>
        <button onClick={toggleMenu} className="md:hidden text-white text-3xl">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="hidden md:flex gap-4">
          <SocialLinks headerData={headerData} />
        </div>
      </div>
      <nav className={`bg-black ${isMenuOpen ? "block" : "hidden"} md:block`}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        >
          <ul className="flex flex-col md:flex-row justify-center items-center text-white space-x-2 md:space-x-4">
            <NavItem href="/" label="Home" icon={<FaHome />} />
            <NavItem href="/services" label="Services" icon={<FaServer />} />

            <NavItem href="/blog" label="Blogs" icon={<FaBook />} />
            <NavItem
              href="/projects"
              label="Projects"
              icon={<FaProjectDiagram />}
            />
            <NavItem href="/contact" label="Contact" icon={<FaPhone />} />
            <NavItem
              href="/about-us"
              label="About Us"
              icon={<FaUserCircle />}
            />
          </ul>
        </motion.div>
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
    <Link href={href} legacyBehavior>
      <span className="flex flex-col items-center cursor-pointer hover:text-blue-500 transition-colors duration-300">
        <div className="text-2xl mb-1">{icon}</div>
        <div className="text-sm">{label}</div>
      </span>
    </Link>
  </li>
);

const SocialLinks: React.FC<{ headerData?: AboutUsData | undefined }> = ({
  headerData,
}) => (
  <div className="flex gap-4">
    <motion.div
      initial={{
        x: -500,
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        x: 0,
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 2,
      }}
      className="flex flex-row items-center"
    >
      {headerData?.facebook && <SocialIcon url={headerData.facebook} />}
      {headerData?.linkedin && <SocialIcon url={headerData.linkedin} />}
      {headerData?.twitter && <SocialIcon url={headerData.twitter} />}
      {headerData?.instagram && <SocialIcon url={headerData.instagram} />}
    </motion.div>
  </div>
);

export default Header;
