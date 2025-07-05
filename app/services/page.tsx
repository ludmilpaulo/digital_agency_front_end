"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCogs, FaRocket, FaMobileAlt, FaCode, FaCloud, FaChartLine, FaArrowRight } from "react-icons/fa";

// --- MOCK DATA (replace with API!) ---
const SERVICES = [
  {
    title: "Web Development",
    desc: "Custom, scalable websites and portals that grow with your business. From landing pages to full e-commerce.",
    icon: <FaCode className="text-blue-600 text-4xl mb-3" />,
    href: "/services/web-development",
  },
  {
    title: "Mobile App Development",
    desc: "iOS & Android apps that wow your users. Fast, secure, and beautiful.",
    icon: <FaMobileAlt className="text-green-600 text-4xl mb-3" />,
    href: "/services/app-development",
  },
  {
    title: "Digital Marketing",
    desc: "SEO, PPC, social media & content strategies proven to drive real results.",
    icon: <FaChartLine className="text-pink-600 text-4xl mb-3" />,
    href: "/services/digital-marketing",
  },
  {
    title: "Automation & SaaS",
    desc: "We automate your processes or build your next SaaS product. More productivity, less stress.",
    icon: <FaCogs className="text-yellow-600 text-4xl mb-3" />,
    href: "/services/automation",
  },
  {
    title: "Cloud Solutions",
    desc: "Cloud migration, DevOps, managed hosting, and secure global scale.",
    icon: <FaCloud className="text-purple-600 text-4xl mb-3" />,
    href: "/services/cloud",
  },
  {
    title: "Branding & Creative",
    desc: "Brand strategy, logo, and all creative for a bold digital presence.",
    icon: <FaRocket className="text-red-600 text-4xl mb-3" />,
    href: "/services/branding",
  },
];

const WHY_US = [
  {
    icon: "/icons/client-first.svg",
    title: "Client-First Approach",
    desc: "You get dedicated support, direct communication, and real results.",
  },
  {
    icon: "/icons/tech.svg",
    title: "Tech & Design Mastery",
    desc: "Our senior team crafts modern, robust and beautiful solutions.",
  },
  {
    icon: "/icons/fast.svg",
    title: "Fast & Agile Delivery",
    desc: "You move fast, so do we—no slow agency processes here.",
  },
  {
    icon: "/icons/africa.svg",
    title: "Built for Africa & the World",
    desc: "We understand the unique challenges and opportunities in African markets and global scale.",
  },
];

export default function ServicesPage() {
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
        {SERVICES.map((service, idx) => (
          <motion.div
            key={service.title}
            className="bg-white/90 rounded-2xl shadow-xl p-7 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.07 * idx }}
          >
            {service.icon}
            <div className="text-2xl font-bold text-blue-900 mb-1">{service.title}</div>
            <div className="text-gray-700 mb-5">{service.desc}</div>
            <Link href={service.href} className="inline-flex gap-2 items-center font-semibold text-blue-600 group-hover:text-blue-800 transition underline">
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
              <Image src={val.icon} alt={val.title} width={44} height={44} className="mb-2" />
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
          href="/contact"
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 hover:from-blue-700 hover:to-black text-white font-extrabold rounded-full shadow-2xl text-xl transition-all duration-300 animate-pulse"
        >
          Get a Free Consultation <FaArrowRight className="text-2xl" />
        </Link>
      </motion.section>
    </main>
  );
}
