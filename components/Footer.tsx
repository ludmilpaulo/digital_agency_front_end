"use client";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import { SocialIcon } from "react-social-icons";
import { motion } from "framer-motion";

const currentYear = new Date().getFullYear();

type SocialKey = 'facebook' | 'linkedin' | 'twitter' | 'instagram';

const socials: { key: SocialKey; color: string }[] = [
  { key: "facebook", color: "#3b5998" },
  { key: "linkedin", color: "#0077b5" },
  { key: "twitter", color: "#1da1f2" },
  { key: "instagram", color: "#e4405f" },
];

export default function Footer() {
  const { data: aboutUs } = useAppSelector((state) => state.aboutUs);

  // Wait for Redux data to hydrate
  if (!aboutUs) return null;

  return (
    <footer
      className="relative w-full bg-gray-900"
      style={{
        backgroundImage: aboutUs.backgroundImage ? `url(${aboutUs.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center md:justify-start">
            <Image
              src={aboutUs.logo}
              alt="Logo"
              width={120}
              height={40}
              className="rounded shadow-md bg-white p-2"
              priority
            />
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-center border-t border-gray-700 py-4 md:flex-row md:justify-between w-full">
          <div className="flex flex-col md:flex-row justify-between items-center w-full">
            <ul className="mb-3 font-bold opacity-90 text-white flex gap-8">
              <li>
                <Link href="/careers" className="hover:text-blue-400 transition">Careers</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition">Blog</Link>
              </li>
              <li>
                <Link href="/appointment" className="hover:text-blue-400 transition">Solutions</Link>
              </li>
            </ul>
            <motion.div
              initial={{ x: 60, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="flex flex-row items-center mb-4 md:mb-0 gap-2"
            >
              {socials.map(({ key, color }) => {
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
            <div className="mb-4 text-center font-bold text-white md:mb-0">
              All Rights Reserved. &copy; {currentYear} Maindo Digital Agency
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
