"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaCogs,
  FaRocket,
  FaMobileAlt,
  FaCode,
  FaCloud,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";
import { useGetServicesQuery } from "@/redux/services/servicesApi";

// === ICON MAP (in-house) ===
const SERVICE_ICONS: Record<string, JSX.Element> = {
  "fa-code": <FaCode className="text-blue-600 text-5xl mb-3" />,
  "fa-mobile-alt": <FaMobileAlt className="text-green-600 text-5xl mb-3" />,
  "fa-chart-line": <FaChartLine className="text-pink-600 text-5xl mb-3" />,
  "fa-cogs": <FaCogs className="text-yellow-500 text-5xl mb-3" />,
  "fa-cloud": <FaCloud className="text-purple-600 text-5xl mb-3" />,
  "fa-rocket": <FaRocket className="text-red-600 text-5xl mb-3" />,
};

import { FaHandshake, FaLightbulb, FaBolt, FaGlobeAfrica } from "react-icons/fa"; // Pick icons that fit your themes

const WHY_US = [
  {
    icon: <FaHandshake className="text-blue-600 text-4xl mb-2" />,
    title: "Client-First Approach",
    desc: "You get dedicated support, direct communication, and real results.",
  },
  {
    icon: <FaLightbulb className="text-yellow-500 text-4xl mb-2" />,
    title: "Tech & Design Mastery",
    desc: "Our senior team crafts modern, robust and beautiful solutions.",
  },
  {
    icon: <FaBolt className="text-green-600 text-4xl mb-2" />,
    title: "Fast & Agile Delivery",
    desc: "You move fast, so do we—no slow agency processes here.",
  },
  {
    icon: <FaGlobeAfrica className="text-purple-600 text-4xl mb-2" />,
    title: "Built for Africa & the World",
    desc: "We understand the unique challenges and opportunities in African markets and global scale.",
  },
];

export default function ServicesPage() {
  const { data: services = [], isLoading } = useGetServicesQuery();

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-800 to-black pb-24">
      {/* HERO */}
      <section className="w-full py-14 flex flex-col items-center px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-white mb-3 text-center tracking-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Our Services
        </motion.h1>
        <motion.p
          className="max-w-2xl text-blue-100 text-xl text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          From idea to execution, we deliver digital growth for Africa and the world.
        </motion.p>
      </section>

      {/* SERVICES GRID */}
      <motion.section
        className="w-full max-w-5xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
      >
        {services.map((service, idx) => (
          <motion.div
            key={service.title}
            className="bg-white/90 rounded-2xl shadow-xl p-7 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.07 * idx }}
          >
            {/* Icon rendering (from the in-house map, fallback = "?") */}
            {SERVICE_ICONS[service.icon] ?? (
              <div className="text-4xl text-gray-300 mb-3">?</div>
            )}
            <div className="text-2xl font-bold text-blue-900 mb-1">{service.title}</div>
            <div className="text-gray-700 mb-5">{service.description}</div>
            <Link
              href={`/services/${service.slug}`}
              className="inline-flex gap-2 items-center font-semibold text-blue-600 group-hover:text-blue-800 transition underline"
            >
              Learn More <FaArrowRight />
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* WHY CHOOSE US */}
      <motion.section
        className="w-full max-w-5xl mx-auto mt-16 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-blue-200 text-center mb-8 tracking-tight">
          Why Choose Maindo Digital?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {WHY_US.map((val, i) => (
            <motion.div
              key={val.title}
              className="flex flex-col items-center bg-white/95 rounded-xl shadow-lg p-7"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.09 * i }}
            >
              {val.icon}
              <div className="font-bold text-lg text-blue-700 mb-1">{val.title}</div>
              <div className="text-gray-600 text-center">{val.desc}</div>
            </motion.div>
          ))}

          </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="w-full flex justify-center mt-16"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        <Link
          href="/appointment"
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 hover:from-blue-700 hover:to-black text-white font-extrabold rounded-full shadow-2xl text-xl transition-all duration-300 animate-pulse"
        >
          Get a Free Consultation <FaArrowRight className="text-2xl" />
        </Link>
      </motion.section>
    </main>
  );
}
