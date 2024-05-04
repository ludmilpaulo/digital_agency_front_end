"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import { motion, useAnimation } from "framer-motion";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      setHeaderData(data);
    };
    fetchData();
  }, []);

  return (
    <footer
      className="relative w-full bg-gray-900"
      style={{
        backgroundImage: `url(${headerData?.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center md:justify-start">
            {/* Using Next.js Image component for the logo */}
            <div className="mb-6">
              <Image
                src={headerData?.logo ?? "/default-logo.png"}
                alt="Material Aki Tens"
                width={200}
                height={50}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-white justify-end">
            <ul className="mb-3 font-bold opacity-70 text-white">
              {/* First column */}
              <li className="text-white font-bold">
                <Link href="/about-us">
                  <span>About us</span>
                </Link>
              </li>
              <li className="text-white font-bold">
                <Link href="/careers">
                  <span>Careers</span>
                </Link>
              </li>
              <li className="text-white font-bold">
                <Link href="/blog">
                  <span>Blog</span>
                </Link>
              </li>
            </ul>
            <ul className="mb-3 font-bold opacity-70 text-white">
              {/* Second column */}
              <li className="text-white font-bold">
                <Link href="/solutions">
                  <span>Solutions</span>
                </Link>
              </li>
              <li className="text-white font-bold">
                <Link href="/ContactPage">
                  <span>News</span>
                </Link>
              </li>
              <li className="text-white font-bold">
                <Link href="/ContactPage">
                  <span>Events</span>
                </Link>
              </li>
            </ul>
            <ul className="mb-3 font-bold opacity-70 text-white">
              {/* Third column (empty) */}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
          <div className="mb-4 text-center font-bold text-white md:mb-0">
            &copy; {currentYear}{" "}
            <Link href="" className="text-white">
              <span> Maindo</span>
            </Link>
            . All Rights Reserved.
          </div>
          <div className="flex gap-4 text-white justify-center md:justify-end">
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
              <>
                {headerData?.facebook && (
                  <SocialIcon url={headerData.facebook} />
                )}
                {headerData?.linkedin && (
                  <SocialIcon url={headerData.linkedin} />
                )}
                {headerData?.twitter && <SocialIcon url={headerData.twitter} />}
                {headerData?.instagram && (
                  <SocialIcon url={headerData.instagram} />
                )}
              </>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
