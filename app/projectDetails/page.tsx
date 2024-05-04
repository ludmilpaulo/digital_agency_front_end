"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";

const ProjectDetails = () => {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(true);

  const link = searchParams.get("link") || "";
  const title = searchParams.get("title") || ""; // Provide a default value if null
  const image = searchParams.get("image") || ""; // Provide a default value if null
  const description = searchParams.get("description") || ""; // Provide a default value if null
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      setHeaderData(data);
    };
    fetchData();
  }, []);

  return (
    <div
      className="flex flex-col md:flex-row items-center md:items-start justify-center pt-56 pb-12 md:px-6 px-4"
      style={{
        backgroundImage: `url(${headerData?.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full md:w-1/2 md:pr-8">
        <Image
          alt={title}
          src={image}
          width={320}
          height={400}
          layout="responsive"
        />
      </div>
      <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-8">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm leading-none text-gray-600">{title}</p>
          <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mt-2">
            {title}
          </h1>
        </div>

        <button
          className="focus:outline-none text-white focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 cursor-pointer rounded mt-4"
          aria-label="Show or hide details"
          onClick={() => setShow(!show)}
        >
          <FaChevronDown
            className={"transform " + (show ? "rotate-180" : "rotate-0")}
          />
        </button>
        {show && (
          <div
            className="mt-4 bg-white"
            dangerouslySetInnerHTML={{ __html: description || "" }}
          />
        )}
        {link && (
          <div className="px-6 pt-4 pb-2">
            <a
              href={link}
              className="inline-block bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2"
            >
              Visit Project
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const SuspenseProjectDetails = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ProjectDetails />
  </Suspense>
);

export default SuspenseProjectDetails;
