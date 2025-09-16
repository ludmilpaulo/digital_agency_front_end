"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaChevronDown, FaExternalLinkAlt, FaArrowLeft, FaMedal, FaQuoteLeft,
  FaTwitter, FaFacebook, FaLinkedin, FaCopy, FaShareAlt, FaChevronLeft, FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useGetTestimonialsQuery, type Testimonial } from "@/redux/services/testimonialsApi";
import { baseAPI } from "@/useAPI/api";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

interface ProjectStat { label: string; value: string }
interface ProjectCaseStudy { title: string; content: string }
interface ProjectTrustedBy { logo: string }
interface ProjectStack { tech: string }
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string;
  badge?: string;
  badge_color?: string;
  stack?: ProjectStack[];
  stats?: ProjectStat[];
  case_study?: ProjectCaseStudy;
  trusted_by?: ProjectTrustedBy[];
}

const logoVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 18 } },
};

export default function ProjectDetailsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [project, setProject] = useState<Project | null>(null);
  const [show, setShow] = useState(true);
  const [modal, setModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch project when id is available
  useEffect(() => {
    if (!id) return;
    fetch(`${baseAPI}/project/projects/${id}/`, { cache: "no-store" })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then(setProject)
      .catch(() => setProject(null));
  }, [id]);

  // Optional: redirect if no id present
  useEffect(() => {
    if (!id) router.replace("/projects");
  }, [id, router]);

  // Testimonials (client-side via RTK Query)
  const { data: testimonials = [] } = useGetTestimonialsQuery();

  // Carousel
  const carouselPages = useMemo(() => chunkArray(testimonials, 1), [testimonials]);
  const [carouselIdx, setCarouselIdx] = useState(0);
  useEffect(() => {
    if (carouselPages.length > 1) {
      const timer = setInterval(
        () => setCarouselIdx((i) => (i + 1) % carouselPages.length),
        5000
      );
      return () => clearInterval(timer);
    }
  }, [carouselPages.length]);

  // Trusted-by animation
  const logosRef = useRef<HTMLDivElement | null>(null);
  const [logosVisible, setLogosVisible] = useState(false);
  useEffect(() => {
    if (!logosRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setLogosVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(logosRef.current);
    return () => observer.disconnect();
  }, []);

  // Share
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = project?.title ? `Check out "${project.title}" by Maindo Digital!` : "Check this out from Maindo Digital!";
  function copyToClipboard() {
    if (navigator?.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }
  function shareOn(network: "twitter" | "facebook" | "linkedin") {
    if (!shareUrl) return;
    let url = "";
    if (network === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (network === "facebook") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    } else {
      url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(project?.title ?? "")}`;
    }
    window.open(url, "_blank", "noopener");
  }

  if (!id) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading…</div>;
  }
  if (!project) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading project…</div>;
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-2 md:px-4 py-20 relative bg-gradient-to-br from-[#182540] to-[#294573]" style={{ minHeight: "100dvh" }}>
      {/* Back */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="fixed top-6 left-4 z-50 px-4 py-2 rounded-full bg-white/70 hover:bg-blue-100 text-blue-800 font-semibold shadow flex items-center gap-2 transition-all backdrop-blur"
        onClick={() => router.back()}
      >
        <FaArrowLeft /> Back to Projects
      </motion.button>

      {/* Card */}
      <motion.div
        className="max-w-5xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row gap-0 md:gap-8 border-[1.5px] border-blue-100 relative"
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Image */}
        <div className="w-full md:w-1/2 min-h-[320px] relative flex items-center justify-center bg-gradient-to-br from-blue-100/80 to-blue-200/70">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-center h-full w-full rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none border-b-2 md:border-r-2 md:border-b-0 border-blue-50"
            priority
          />
          {project.badge && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute top-5 left-5 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 font-bold text-xs ${project.badge_color ?? ""} ring-2 ring-yellow-300 animate-pulse`}
            >
              <FaMedal className="text-lg animate-spin-slow" /> {project.badge}
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-7 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-2">{project.title}</h1>
          <div className="flex items-center gap-3 text-blue-600 mb-3">
            <span className="uppercase text-xs font-bold tracking-widest bg-blue-100/80 px-3 py-1 rounded-full">Case Study</span>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="ml-2 flex items-center gap-1 text-blue-500 hover:underline hover:text-blue-800 text-xs">
                <FaExternalLinkAlt className="inline-block" /> Visit Project
              </a>
            )}
          </div>

          {/* Stack */}
          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            {(project.stack || []).map((s) => (
              <span key={s.tech} className="bg-blue-50 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-blue-100 hover:scale-105 transition-transform">
                {s.tech}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {(project.stats || []).map((s) => (
              <div key={s.label} className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 flex flex-col items-center shadow-sm">
                <div className="font-extrabold text-lg text-blue-800">{s.value}</div>
                <div className="uppercase text-[11px] text-blue-400 font-bold">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Toggle */}
          <button
            className="flex items-center gap-2 group mt-2 mb-2 text-blue-700 hover:text-blue-900 focus:outline-none transition"
            aria-label="Show or hide details"
            onClick={() => setShow((s) => !s)}
          >
            <FaChevronDown className={`transition-transform duration-300 ${show ? "rotate-180" : ""}`} />
            <span className="font-semibold text-base">{show ? "Hide Details" : "Read More"}</span>
          </button>

          <AnimatePresence initial={false}>
            {show && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.32 }}
                className="prose prose-blue max-w-none mt-3 text-gray-800 text-base"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            )}
          </AnimatePresence>

          {project.case_study && (
            <button
              className="mt-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 font-bold text-base shadow transition hover:scale-105"
              onClick={() => setModal(true)}
            >
              View Case Study
            </button>
          )}

          {/* Share */}
          <div className="mt-5 flex items-center gap-3">
            <FaShareAlt className="text-blue-400 text-xl" />
            <button title="Share on Twitter" onClick={() => shareOn("twitter")} className="text-blue-600 hover:text-blue-900 text-xl"><FaTwitter /></button>
            <button title="Share on Facebook" onClick={() => shareOn("facebook")} className="text-blue-700 hover:text-blue-900 text-xl"><FaFacebook /></button>
            <button title="Share on LinkedIn" onClick={() => shareOn("linkedin")} className="text-blue-800 hover:text-blue-900 text-xl"><FaLinkedin /></button>
            <button title="Copy link" onClick={copyToClipboard} className="text-blue-400 hover:text-blue-700 text-xl relative">
              <FaCopy />
              {copied && <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-900 text-white px-2 py-1 text-xs rounded shadow">Copied!</span>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Trusted By */}
      <div className="mt-14 mb-6 flex flex-col items-center gap-3 w-full" ref={logosRef}>
        <div className="text-blue-300 uppercase text-xs tracking-wide font-bold mb-1">Trusted by leading brands</div>
        <div className="flex gap-4 flex-wrap justify-center">
          {(project.trusted_by || []).map((logoObj) => (
            <motion.div key={logoObj.logo} initial="hidden" animate={logosVisible ? "visible" : "hidden"} variants={logoVariants}>
              <Image src={logoObj.logo} alt="Trusted Brand Logo" width={84} height={32} className="object-contain grayscale hover:grayscale-0 transition" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative max-w-2xl mx-auto mt-6">
        <AnimatePresence initial={false} mode="wait">
          {carouselPages.length > 0 && (
            <motion.div
              key={carouselIdx}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              transition={{ duration: 0.45 }}
              className="bg-blue-900/95 rounded-xl shadow-xl px-8 py-7 flex flex-col md:flex-row items-center gap-6 border-t-4 border-yellow-400 relative"
            >
              {carouselPages[carouselIdx].map((t: Testimonial) => (
                <div key={t.id} className="flex flex-col md:flex-row items-center gap-6 w-full">
                  <div className="bg-white rounded-full shadow-lg border-4 border-yellow-400 p-2">
                    <Image src={t.avatar} alt={t.name} width={64} height={64} className="rounded-full" />
                  </div>
                  <div className="ml-0 md:ml-8">
                    <FaQuoteLeft className="text-yellow-400 text-3xl mb-3" />
                    <p className="text-white text-lg italic font-medium mb-2">{t.quote}</p>
                    <div className="text-blue-200 font-bold text-sm">
                      {t.name} <span className="font-normal">| {t.role}</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: t.stars || 5 }).map((_, idx) => (<span key={idx} className="text-yellow-400">★</span>))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {carouselPages.length > 1 && (
          <div className="absolute -top-7 right-0 flex gap-2">
            <button
              className="bg-white text-blue-800 rounded-full shadow p-2 hover:bg-blue-50 transition"
              onClick={() => setCarouselIdx((i) => (i - 1 + carouselPages.length) % carouselPages.length)}
              aria-label="Previous testimonial"
            >
              <FaChevronLeft />
            </button>
            <button
              className="bg-white text-blue-800 rounded-full shadow p-2 hover:bg-blue-50 transition"
              onClick={() => setCarouselIdx((i) => (i + 1) % carouselPages.length)}
              aria-label="Next testimonial"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {modal && project.case_study && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative border-2 border-yellow-300"
              initial={{ scale: 0.92, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 60, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="text-2xl font-extrabold mb-4 text-blue-900">{project.case_study.title}</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: project.case_study.content }} />
              <button
                className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 font-bold text-xl bg-yellow-100 rounded-full px-3 py-1 shadow"
                onClick={() => setModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky CTA */}
      <motion.a
        href="/have-a-project"
        className="fixed bottom-8 right-8 px-7 py-3 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 shadow-xl text-white text-lg font-extrabold z-50 hover:scale-105 hover:from-yellow-400 hover:to-yellow-600 hover:text-blue-900 transition-all ring-2 ring-blue-400 animate-pulse"
        initial={{ scale: 0.98, boxShadow: "0 2px 24px #3b82f680" }}
        animate={{
          scale: [1, 1.07, 1],
          boxShadow: [
            "0 2px 24px #3b82f680",
            "0 4px 40px #fde04790",
            "0 2px 24px #3b82f680",
          ],
        }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        whileHover={{ scale: 1.11 }}
        whileTap={{ scale: 0.98 }}
      >
        Book Free Consultation
      </motion.a>
    </section>
  );
}
