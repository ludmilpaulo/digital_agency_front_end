"use client";
import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Transition } from "@headlessui/react";
import { AboutUsData } from "@/useAPI/types";
import { fetchAboutUsData } from "@/useAPI/information";
import Team from "@/components/Team";
import { baseAPI } from "@/useAPI/api";

const About: NextPage = () => {
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchAboutUsData();
        setHeaderData(data);
      } catch (error) {
        console.error("Error fetching About Us data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const renderHtmlContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const images = doc.querySelectorAll("img");

    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src && src.startsWith("/")) {
        // Replace relative path with absolute URL
        img.setAttribute("src", `${baseAPI}${src}`);
      }
    });

    return doc.documentElement.innerHTML;
  };

  return (
    <div style={{ overflowX: 'hidden' }}> {/* Prevent horizontal scroll */}
    <Head>
      <title>About Us | {headerData?.title}</title>
      <meta
        name="description"
        content="Learn more about our team and our story."
      />
    </Head>
    <Transition
      show={loading}
      enter="transition-opacity duration-500 ease-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-500 ease-in"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </Transition>
  
    {!loading && headerData && (
      <div
        className="bg-cover bg-center w-full" 
        style={{ backgroundImage: `url(${headerData.backgroundImage})` }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center max-w-full"> {/* Remove constraints that could cause overflow */}
          <Image
            src={headerData.logo}
            alt={headerData.title}
            className="w-auto mx-auto" 
            width={200}
            height={100}
            priority
          />
          <div className="mt-4 p-4 bg-white bg-opacity-90 rounded-md shadow">
            <div
              dangerouslySetInnerHTML={{
                __html: renderHtmlContent(headerData.about),
              }}
              className="text-sm sm:text-base md:text-lg"
            />
          </div>
        </div>
      </div>
    )}
  </div>
  
  
  );
};

export default About;
