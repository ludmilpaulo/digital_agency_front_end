"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaHandPointer,
  FaFileSignature,
  FaCogs,
  FaCheckCircle,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const STEPS = [
  {
    icon: <FaHandPointer className="text-blue-600 text-3xl mb-2" />,
    title: "1. Request & Quote",
    desc: "Tell us your needs and get a fast, clear proposal.",
  },
  {
    icon: <FaFileSignature className="text-green-600 text-3xl mb-2" />,
    title: "2. 50% Deposit",
    desc: "Reserve your spot with a 50% upfront deposit—industry standard.",
  },
  {
    icon: <FaCogs className="text-yellow-500 text-3xl mb-2" />,
    title: "3. We Build & You Review",
    desc: "Track your project’s progress with regular updates.",
  },
  {
    icon: <FaCheckCircle className="text-blue-500 text-3xl mb-2" />,
    title: "4. Final Review",
    desc: "Review the completed work, request tweaks if needed.",
  },
  {
    icon: <FaMoneyCheckAlt className="text-green-500 text-3xl mb-2" />,
    title: "5. Final Payment & Delivery",
    desc: "Pay the balance and get full access—simple, safe, and fair.",
  },
];

export default function HowItWorksClient() {
  return (
    <section className="bg-gradient-to-br from-blue-950 via-blue-800 to-blue-900 py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-center">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              className="bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300 group border border-blue-100"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.09 * i }}
            >
              {step.icon}
              <div className="font-bold text-lg text-blue-900 mb-2">{step.title}</div>
              <div className="text-gray-600 text-sm">{step.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-800 text-white font-bold text-xl rounded-full shadow-lg transition-all duration-200"
          >
            Request a Free Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
