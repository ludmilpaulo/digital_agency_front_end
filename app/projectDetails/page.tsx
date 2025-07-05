"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FaChevronDown, FaExternalLinkAlt, FaArrowLeft, FaMedal } from "react-icons/fa";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock fallback for tech/testimonial/badge/modal demo
const MOCK_PROJECT = {
  stack: ["Next.js", "Tailwind CSS", "Django", "Stripe", "AWS"],
  badge: "Featured Project",
  badgeColor: "bg-yellow-400 text-yellow-900",
  testimonial: {
    quote: "Working with Maindo Digital was a game changer. We increased sales by 60% in 6 months.",
    name: "Carlos M.",
    role: "COO, ABX Logistics",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  caseStudy: {
    title: "Impact & Results",
    content: `
      <ul>
        <li>Launched in 3 countries in under 6 months</li>
        <li>Automated order workflow reduced errors by 40%</li>
        <li>Custom dashboard enabled real-time analytics for managers</li>
      </ul>
    `,
  },
};
// ---

const ProjectDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(true);
  const [modal, setModal] = useState(false);

  const link = searchParams.get("link") || "";
  const title = searchParams.get("title") || "";
  const image = searchParams.get("image") || "";
  const description = searchParams.get("description") || "";
  // Extend for demo/mock
  const stack = MOCK_PROJECT.stack;
  const badge = MOCK_PROJECT.badge;
  const badgeColor = MOCK_PROJECT.badgeColor;
  const testimonial = MOCK_PROJECT.testimonial;
  const caseStudy = MOCK_PROJECT.caseStudy;

  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);
  useEffect(() => {
    fetchAboutUsData().then(setHeaderData);
  }, []);

  return (
    <section
      className="min-h-screen flex items-center justify-center px-2 md:px-4 py-24 relative"
      style={{
        backgroundImage: headerData?.backgroundImage
          ? `linear-gradient(rgba(20,26,42,0.96), rgba(20,26,42,0.99)), url(${headerData.backgroundImage})`
          : "linear-gradient(135deg, #171f34, #2d415f)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Floating Back Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="fixed top-6 left-4 z-50 px-4 py-2 rounded-full bg-white/80 hover:bg-blue-100 text-blue-700 font-semibold shadow flex items-center gap-2 transition-all"
        onClick={() => router.back()}
      >
        <FaArrowLeft /> Back to Projects
      </motion.button>

      {/* Main Card */}
      <motion.div
        className="max-w-4xl w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row gap-0 md:gap-8"
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left: Image */}
        <div className="w-full md:w-1/2 min-h-[280px] relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center h-full w-full rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
            priority
          />
          {/* Animated Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute top-5 left-5 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 font-bold text-xs ${badgeColor} animate-pulse`}
            >
              <FaMedal className="text-lg" /> {badge}
            </motion.div>
          )}
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">{title}</h1>
          <div className="flex items-center gap-3 text-blue-600 mb-3">
            <span className="uppercase text-xs font-bold tracking-wide">Project Case Study</span>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex items-center gap-1 text-blue-500 hover:underline hover:text-blue-800 text-xs"
              >
                <FaExternalLinkAlt className="inline-block" /> Visit Project
              </a>
            )}
          </div>
          {/* Tech stack/tags */}
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {stack.map((tech) => (
              <span
                key={tech}
                className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-blue-100"
              >
                {tech}
              </span>
            ))}
          </div>
          {/* Toggle Button */}
          <button
            className="flex items-center gap-2 group mt-2 mb-2 text-blue-700 hover:text-blue-900 focus:outline-none transition"
            aria-label="Show or hide details"
            onClick={() => setShow((s) => !s)}
          >
            <FaChevronDown
              className={`transition-transform duration-300 ${show ? "rotate-180" : ""}`}
            />
            <span className="font-semibold text-base">
              {show ? "Hide Details" : "Read More"}
            </span>
          </button>
          {/* Animated Description */}
          <AnimatePresence initial={false}>
            {show && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.32 }}
                className="prose prose-blue max-w-none mt-3 text-gray-800 text-base"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </AnimatePresence>
          {/* Case study modal open */}
          <button
            className="mt-6 px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-base shadow transition"
            onClick={() => setModal(true)}
          >
            View Case Study
          </button>
        </div>
      </motion.div>

      {/* Testimonial */}
      <motion.div
        className="max-w-2xl mx-auto mt-12 bg-blue-900/95 rounded-xl shadow-xl px-8 py-7 flex flex-col md:flex-row items-center gap-6 border-t-4 border-yellow-400"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={60}
          height={60}
          className="rounded-full border-4 border-white shadow"
        />
        <div>
          <p className="text-white text-lg italic font-medium mb-2">"{testimonial.quote}"</p>
          <div className="text-blue-200 font-bold text-sm">{testimonial.name} <span className="font-normal">| {testimonial.role}</span></div>
        </div>
      </motion.div>

      {/* Modal: Case Study */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative"
              initial={{ scale: 0.92, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 60, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="text-2xl font-extrabold mb-4 text-blue-900">{caseStudy.title}</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: caseStudy.content }} />
              <button
                className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 font-bold text-xl"
                onClick={() => setModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const SuspenseProjectDetails = () => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
    <ProjectDetails />
  </Suspense>
);

export default SuspenseProjectDetails;
