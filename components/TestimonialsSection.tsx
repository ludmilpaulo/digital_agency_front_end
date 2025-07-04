"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

// Use your real testimonials/photos, or swap for Unsplash/randomuser avatars!
const testimonials = [
  {
    name: "Sarah K.",
    role: "CEO, Retail Startup",
    quote: "Maindo Digital turned our ideas into a beautiful, high-performing site. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    stars: 5,
  },
  {
    name: "John D.",
    role: "Marketing Director",
    quote: "Our traffic and conversions doubled after their digital marketing campaign. Amazing results.",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    stars: 5,
  },
  {
    name: "Amanda P.",
    role: "Operations Lead",
    quote: "They built our custom web app on time, on budget, and with more features than we planned.",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    stars: 5,
  },
  {
    name: "Sibusiso M.",
    role: "Founder, FinTech",
    quote: "Reliable, honest, and technical excellence. We consider them an extension of our team.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    stars: 5,
  },
  {
    name: "Fatima N.",
    role: "Brand Manager",
    quote: "Creative, responsive, and went above and beyond. We love our new brand identity.",
    avatar: "https://randomuser.me/api/portraits/women/31.jpg",
    stars: 5,
  },
  {
    name: "George O.",
    role: "Small Business Owner",
    quote: "Their e-commerce solution helped us triple sales in three months. Outstanding support.",
    avatar: "https://randomuser.me/api/portraits/men/43.jpg",
    stars: 5,
  },
  {
    name: "Emily V.",
    role: "HR Director",
    quote: "A pleasure to work with—clear communication, no hidden costs, and fast results.",
    avatar: "https://randomuser.me/api/portraits/women/20.jpg",
    stars: 5,
  },
  {
    name: "Thabo L.",
    role: "Tech Lead",
    quote: "Maindo Digital delivered complex integrations for our business in record time.",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    stars: 5,
  },
  {
    name: "Linda S.",
    role: "Education Start-up Founder",
    quote: "They built our education app—beautiful UX and totally reliable. Would recommend to anyone.",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    stars: 5,
  },
  {
    name: "James N.",
    role: "IT Consultant",
    quote: "Professional, detail-oriented, and genuinely invested in our success. 10/10.",
    avatar: "https://randomuser.me/api/portraits/men/80.jpg",
    stars: 5,
  },
  {
    name: "Sipho B.",
    role: "Non-Profit Director",
    quote: "We reached thousands more thanks to their digital marketing expertise.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    stars: 5,
  },
  {
    name: "Ayesha H.",
    role: "App Product Owner",
    quote: "Fast, reliable, and a delight to collaborate with. Will use again.",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    stars: 5,
  },
  {
    name: "Dumisani T.",
    role: "Entrepreneur",
    quote: "From consultation to launch, the process was seamless. Thank you Maindo!",
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
    stars: 5,
  },
  {
    name: "Renee P.",
    role: "E-commerce Manager",
    quote: "Our online shop looks fantastic and our revenue is up. Couldn’t be happier.",
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    stars: 5,
  },
  {
    name: "Michael O.",
    role: "Startup CTO",
    quote: "Cutting-edge tech, sharp problem-solving. We’re launching ahead of schedule.",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
    stars: 5,
  },
  {
    name: "Bianca V.",
    role: "Content Strategist",
    quote: "They understand digital storytelling. Our website content has never been stronger.",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    stars: 5,
  },
  {
    name: "Lebo K.",
    role: "Freelancer",
    quote: "Easy to work with and always delivers on time. Highly professional.",
    avatar: "https://randomuser.me/api/portraits/men/57.jpg",
    stars: 5,
  },
  {
    name: "Caroline F.",
    role: "Medical Practice Manager",
    quote: "Patients love our new booking system. The Maindo team really cares.",
    avatar: "https://randomuser.me/api/portraits/women/27.jpg",
    stars: 5,
  },
  {
    name: "Nathi M.",
    role: "Logistics CEO",
    quote: "From branding to automation, Maindo Digital is our long-term partner.",
    avatar: "https://randomuser.me/api/portraits/men/29.jpg",
    stars: 5,
  },
  {
    name: "Claire J.",
    role: "Travel Agent",
    quote: "Our site finally stands out, and bookings are up. Thank you for the outstanding work.",
    avatar: "https://randomuser.me/api/portraits/women/30.jpg",
    stars: 5,
  },
  {
    name: "Zanele D.",
    role: "SAAS Product Owner",
    quote: "Modern, reliable, and fast. The app looks great and works perfectly.",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const prevIdx = useRef(idx);

  // Direction for sliding animation: 1 = forward, -1 = backward
  const direction =
    idx === 0 && prevIdx.current === testimonials.length - 1
      ? 1
      : idx === testimonials.length - 1 && prevIdx.current === 0
      ? -1
      : idx > prevIdx.current
      ? 1
      : -1;
  useEffect(() => {
    prevIdx.current = idx;
  }, [idx]);

  // Auto-advance logic
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => {
      setIdx((prev) => (prev + 1) % testimonials.length);
    }, 5200);
    return () => clearTimeout(timer);
  }, [idx, paused]);

  // Pause on hover/touch
  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  const t = testimonials[idx];

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
              key={t.name}
              custom={direction}
              initial={{ x: direction > 0 ? 220 : -220, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction < 0 ? 220 : -220, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 32, duration: 0.5 }}
              className="flex flex-col items-center absolute w-full"
            >
              <div className="flex items-center mb-4">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={64}
                  height={64}
                  className="rounded-full border-4 border-blue-500 shadow-lg object-cover"
                />
              </div>
              <p className="text-lg md:text-xl font-medium italic mb-3 max-w-xl">&quot;{t.quote}&quot;</p>
              <div className="flex gap-1 mb-1">
                {[...Array(t.stars)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-blue-100 font-bold">
                {t.name} <span className="font-normal">| {t.role}</span>
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
