"use client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronRight, FaLinkedin, FaQuoteLeft, FaStar, FaBriefcase } from "react-icons/fa";

// --- MOCK DATA ---
const ABOUT = {
  title: "Maindo Digital Agency",
  logo: "/logo.png",
  about: `<h2 class="text-2xl font-bold mb-2">Your Digital Growth Partner</h2>
    <p>Founded in 2018, Maindo Digital delivers world-class software, apps, and digital solutions for ambitious brands across Africa and beyond. We blend local expertise with international vision.</p>
    <ul>
      <li>Web & Mobile Development</li>
      <li>Custom SaaS & Automation</li>
      <li>Branding & Digital Marketing</li>
    </ul>
    <p class="font-semibold mt-2 text-blue-800">Let’s create your next success story—together.</p>`,
  address: "21 Royal Road, Maitland, Cape Town, South Africa",
  phone: "+27659031894",
  email: "support@maindodigital.com",
  whatsapp: "+27659031894",
};

const TIMELINE = [
  { year: "2018", title: "Founded", desc: "Maindo Digital is born, launching first apps for local startups." },
  { year: "2019", title: "African Expansion", desc: "Delivered projects for major brands and NGOs." },
  { year: "2021", title: "South Africa Office Opens", desc: "Cape Town becomes our base for Southern Africa and global work." },
  { year: "2024", title: "Global Clients", desc: "Serving clients in 10+ countries, trusted by global partners." },
];

const VALUES = [
  { icon: "/icons/global.svg", title: "Global Experience", desc: "We know the African market—and the world." },
  { icon: "/icons/client-first.svg", title: "Client-First", desc: "You get direct communication, fast feedback, and true partnership." },
  { icon: "/icons/tech.svg", title: "Tech Mastery", desc: "Modern stacks, automation, and robust scalable builds." },
  { icon: "/icons/hybrid.svg", title: "Hybrid Work", desc: "Flexible, always available for your success." },
];

const TEAM = [
  { name: "Ludmil Paulo", title: "Founder & CTO", img: "", bio: "Visionary full-stack, mobile, and cloud leader.", linkedin: "https://www.linkedin.com/in/ludmilpaulo/" },
  { name: "Sarah K.", title: "Lead Designer", img: "", bio: "Crafts pixel-perfect, human-first interfaces.", linkedin: "" },
  { name: "John D.", title: "Growth Strategist", img: "", bio: "Turns ideas into scalable global strategies.", linkedin: "" },
];

const PARTNERS = [
  { name: "Google", img: "/partners/google.svg", url: "https://google.com" },
  { name: "AWS", img: "/partners/aws.svg", url: "https://aws.amazon.com/" },
  { name: "HubSpot", img: "/partners/hubspot.svg", url: "https://hubspot.com" },
  { name: "Flutterwave", img: "/partners/flutterwave.svg", url: "https://flutterwave.com" },
];

const TESTIMONIALS = [
  {
    name: "Carlos S.",
    role: "CEO, FinTech Angola",
    avatar: "/testimonials/carlos.webp",
    quote: "Maindo Digital turned our ideas into a high-performance platform. Communication and results were fantastic.",
    stars: 5,
  },
  {
    name: "Maria P.",
    role: "CMO, Cape Town Retail",
    avatar: "/testimonials/maria.webp",
    quote: "After launching with Maindo, our sales and online engagement doubled in six months. Highly recommended!",
    stars: 5,
  },
  {
    name: "Helena N.",
    role: "CTO, Startup Mozambique",
    avatar: "/testimonials/helena.webp",
    quote: "They understood our needs and delivered a stunning mobile app—on time and on budget.",
    stars: 5,
  },
  {
    name: "Lebo D.",
    role: "Marketing Manager, SA",
    avatar: "/testimonials/lebo.webp",
    quote: "Their digital marketing transformed our brand presence. We keep coming back.",
    stars: 5,
  },
];

// --- Page ---
export default function AboutPage() {
  // Testimonial slider logic
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide for testimonials
  // eslint-disable-next-line
  // @ts-ignore
  React.useEffect(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [testimonialIdx]);

  // Next/prev testimonial
  const goToTestimonial = (idx: number) => setTestimonialIdx(idx);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-800 to-black pb-20 overflow-x-hidden">
      <Head>
        <title>About Us | {ABOUT.title}</title>
        <meta name="description" content="Learn more about Maindo Digital Agency and our global journey." />
      </Head>
      <main className="flex flex-col items-center">

        {/* HERO & REGIONS */}
        <section className="w-full flex flex-col items-center justify-center py-16 px-2">

          <motion.div
            className="flex flex-col items-center mb-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="text-gray-100 font-semibold text-base text-center">
              {ABOUT.address} &nbsp; | &nbsp; 📞 {ABOUT.phone}
            </div>
            <div className="text-blue-200 text-sm mt-1">
              <span className="mr-3">✉️ {ABOUT.email}</span>
              <span>WhatsApp: {ABOUT.whatsapp}</span>
            </div>
          </motion.div>
          <motion.div
            className="w-full bg-white/90 rounded-2xl shadow-lg p-6 text-gray-800 mt-4 prose max-w-2xl"
            dangerouslySetInnerHTML={{ __html: ABOUT.about }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          />
        </section>

        {/* TIMELINE */}
        <section className="w-full max-w-4xl mx-auto py-10 px-2 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-200 text-center mb-8 tracking-tight">
            Company Milestones
          </h2>
          <ol className="relative border-l-4 border-blue-700/60 pl-6 space-y-10">
            {TIMELINE.map((item, idx) => (
              <motion.li
                key={item.year}
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.13 * idx }}
                className="relative"
              >
                <span className="absolute -left-8 top-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow text-lg border-4 border-white">
                  {idx + 1}
                </span>
                <div className="bg-white/95 rounded-xl shadow p-6 ml-2 border-l-4 border-blue-600">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-blue-700 font-bold text-xl">{item.year}</span>
                  </div>
                  <div className="text-lg font-semibold mb-1">{item.title}</div>
                  <div className="text-gray-700">{item.desc}</div>
                </div>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* WHY CHOOSE US */}
        <section className="w-full max-w-5xl mx-auto py-10 px-2 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-200 text-center mb-8 tracking-tight">
            Why Choose Maindo Digital?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                className="flex flex-col items-center bg-white/95 rounded-xl shadow-xl p-7 hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.09 * i }}
              >
                <Image src={val.icon} alt={val.title} width={44} height={44} className="mb-2" />
                <div className="font-bold text-lg text-blue-700 mb-1">{val.title}</div>
                <div className="text-gray-600 text-center">{val.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="w-full max-w-6xl mx-auto py-12 px-2 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-200 text-center mb-8 tracking-tight">
            Meet Our Team
          </h2>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {TEAM.map((person, idx) => (
              <motion.div
                key={person.name}
                className="relative bg-white/95 rounded-2xl shadow-2xl flex flex-col items-center text-center p-7 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 * idx }}
              >
                {/* Team avatar + overlay */}
                <div className="relative mb-3">
                  <Image
                    src={
                      person.img ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(person.name) +
                        "&size=256&background=2d6cdf&color=fff"
                    }
                    width={92}
                    height={92}
                    alt={person.name}
                    className="rounded-full shadow-md object-cover border-4 border-blue-600"
                  />
                  <motion.div
                    className="absolute inset-0 bg-blue-600/80 rounded-full opacity-0 group-hover:opacity-90 flex items-center justify-center transition-opacity duration-300"
                    initial={false}
                    whileHover={{ opacity: 0.95 }}
                  >
                    {person.linkedin && (
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white font-bold text-lg"
                      >
                        <FaLinkedin className="text-2xl" /> Connect
                      </a>
                    )}
                  </motion.div>
                </div>
                <div className="text-blue-700 font-bold text-lg mb-1">{person.name}</div>
                <div className="text-sm text-blue-400 font-semibold mb-2">{person.title}</div>
                <div className="text-gray-600 mb-2">{person.bio}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIAL SLIDER */}
        <section className="w-full max-w-4xl mx-auto py-12 px-2 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-200 text-center mb-8 tracking-tight">
            What Our Clients Say
          </h2>
          <div className="relative min-h-[300px] flex flex-col items-center justify-center">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={TESTIMONIALS[testimonialIdx].name}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.7 }}
                className="bg-white/90 rounded-xl shadow-xl px-8 py-7 flex flex-col items-center max-w-xl text-center"
              >
                <FaQuoteLeft className="text-blue-400 text-2xl mb-2" />
                <p className="text-lg font-medium text-gray-800 italic mb-4">
                  &quot;{TESTIMONIALS[testimonialIdx].quote}&quot;
                </p>
                <div className="flex gap-1 mb-1 justify-center">
                  {[...Array(TESTIMONIALS[testimonialIdx].stars)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <div className="flex flex-col items-center">
                  <Image
                    src={
                      TESTIMONIALS[testimonialIdx].avatar ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(TESTIMONIALS[testimonialIdx].name) +
                        "&size=128&background=2d6cdf&color=fff"
                    }
                    width={52}
                    height={52}
                    className="rounded-full border-2 border-blue-500 shadow mb-1"
                    alt={TESTIMONIALS[testimonialIdx].name}
                  />
                  <div className="text-blue-800 font-bold text-base">
                    {TESTIMONIALS[testimonialIdx].name}
                  </div>
                  <div className="text-sm text-blue-600">{TESTIMONIALS[testimonialIdx].role}</div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-5 flex justify-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full border border-blue-400 ${i === testimonialIdx ? "bg-blue-500 scale-110" : "bg-white"}`}
                  onClick={() => goToTestimonial(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* PARTNER LOGOS */}
        <section className="w-full max-w-5xl mx-auto py-10 px-2 md:px-6 flex flex-col items-center">
          <h2 className="text-xl md:text-2xl font-bold text-blue-200 text-center mb-6 tracking-tight">
            Trusted by Global Partners
          </h2>
          <div className="flex flex-wrap justify-center gap-7 items-center">
            {PARTNERS.map(partner => (
              <motion.a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block grayscale hover:grayscale-0 hover:scale-105 transition-all duration-300 bg-white rounded-xl px-4 py-2 shadow-lg"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Image
                  src={partner.img}
                  alt={partner.name}
                  width={90}
                  height={38}
                  className="object-contain h-10"
                />
              </motion.a>
            ))}
          </div>
        </section>

        {/* CAREER CTA */}
        <motion.div
          className="w-full flex justify-center pb-16 mt-8"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Link
            href="/careers"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 hover:from-blue-700 hover:to-black text-white font-extrabold rounded-full shadow-2xl text-xl transition-all duration-300 animate-pulse"
          >
            <FaBriefcase className="text-2xl" /> Join Our Global Team <FaChevronRight className="text-2xl" />
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
