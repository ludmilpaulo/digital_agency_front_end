"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useGetTestimonialsQuery } from "@/redux/services/testimonialsApi";

export interface Testimonial {
  id?: number;
  name?: string;
  role?: string;
  quote?: string;
  avatar?: string;
  stars?: number;
}

export default function TestimonialsSection() {
  // Fetch testimonials from API (expecting a plain array!)
  const { data = [], isLoading, isError } = useGetTestimonialsQuery();
  const testimonials: Testimonial[] = Array.isArray(data) ? data : [];

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const prevIdx = useRef(idx);

  // Animation direction for Framer Motion
  const direction =
    testimonials.length === 0
      ? 1
      : idx === 0 && prevIdx.current === testimonials.length - 1
      ? 1
      : idx === testimonials.length - 1 && prevIdx.current === 0
      ? -1
      : idx > prevIdx.current
      ? 1
      : -1;

  useEffect(() => {
    prevIdx.current = idx;
  }, [idx]);

  useEffect(() => {
    if (paused || testimonials.length === 0) return;
    const timer = setTimeout(() => {
      setIdx((prev) => (prev + 1) % testimonials.length);
    }, 5200);
    return () => clearTimeout(timer);
  }, [idx, paused, testimonials.length]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  // Loading UI
  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-blue-900/95 to-blue-700/90 text-white relative select-none">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">What Our Clients Say</h2>
          <div className="h-56 flex items-center justify-center">
            <span className="inline-block w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></span>
          </div>
        </div>
      </section>
    );
  }

  // Error UI
  if (isError) {
    return (
      <section className="py-20 bg-gradient-to-b from-blue-900/95 to-blue-700/90 text-white relative select-none">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">What Our Clients Say</h2>
          <div className="h-56 flex items-center justify-center text-red-300 font-bold">
            Failed to load testimonials. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  // Empty UI
  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-blue-900/95 to-blue-700/90 text-white relative select-none">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">What Our Clients Say</h2>
          <div className="h-56 flex items-center justify-center text-blue-200">
            No testimonials yet.
          </div>
        </div>
      </section>
    );
  }

  // Defensive: avoid out-of-bounds and fallback values
  const t: Testimonial = testimonials[idx] ?? {};
  const avatarSrc = t.avatar || "/default-avatar.png"; // Make sure this file exists in your public/ directory
  const name = t.name || "Anonymous";
  const role = t.role || "Client";
  const quote = t.quote || "No testimonial provided.";
  const stars = typeof t.stars === "number" ? t.stars : 5;

  return (
    <section
      className="py-20 bg-gradient-to-b from-blue-900/95 to-blue-700/90 text-white relative select-none"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">What Our Clients Say</h2>
        <div className="h-56 relative overflow-hidden flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={name + role + idx}
              custom={direction}
              initial={{ x: direction > 0 ? 220 : -220, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction < 0 ? 220 : -220, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 32, duration: 0.5 }}
              className="flex flex-col items-center absolute w-full"
            >
              <div className="flex items-center mb-4">
                <Image
                  src={avatarSrc}
                  alt={name}
                  width={64}
                  height={64}
                  className="rounded-full border-4 border-blue-500 shadow-lg object-cover"
                />
              </div>
              <p className="text-lg md:text-xl font-medium italic mb-3 max-w-xl">&quot;{quote}&quot;</p>
              <div className="flex gap-1 mb-1">
                {[...Array(stars)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-blue-100 font-bold">
                {name} <span className="font-normal">| {role}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full border border-blue-300 bg-blue-200 transition ${i === idx ? "bg-yellow-400 border-yellow-400 scale-110" : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`Show testimonial ${i + 1}`}
              style={{ margin: "0 2px" }}
            />
          ))}
        </div>
        <div className="mt-2 text-xs text-blue-200 opacity-70">
          {paused ? "Paused" : "Auto-slide"}
        </div>
      </div>
    </section>
  );
}
