// components/HowWeWork.tsx
"use client";
import { motion } from "framer-motion";
import { FaLightbulb, FaComments, FaMobileAlt, FaRocket } from "react-icons/fa";

const steps = [
  {
    icon: <FaLightbulb className="text-yellow-400 text-4xl" />,
    title: "Share Your Idea",
    desc: "You tell us your vision, whether you have a rough concept or a clear goal. We listen.",
  },
  {
    icon: <FaComments className="text-blue-500 text-4xl" />,
    title: "Collaborate & Plan",
    desc: "We refine your idea together, plan features, and create wireframes or prototypes.",
  },
  {
    icon: <FaMobileAlt className="text-green-500 text-4xl" />,
    title: "Build & Test",
    desc: "Our team develops your web or mobile app using the latest technology, with full transparency.",
  },
  {
    icon: <FaRocket className="text-pink-500 text-4xl" />,
    title: "Launch & Grow",
    desc: "We launch your product, monitor performance, and help you scale with ongoing support.",
  },
];

export default function HowWeWork() {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-blue-100" id="process">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-900 mb-5">
          Our Process: <span className="text-blue-500">From Idea to Launch</span>
        </h2>
        <p className="text-center text-lg text-gray-700 mb-12">
          Whether you have a brilliant idea or a business goal, we help you bring it to life—step by step.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-7 h-full hover:-translate-y-2 hover:shadow-2xl transition-all"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 * idx, duration: 0.7, type: "spring" }}
            >
              <div className="mb-4">{step.icon}</div>
              <div className="text-2xl font-bold text-blue-900 mb-2 text-center">{step.title}</div>
              <p className="text-gray-600 text-center">{step.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <a
            href="/contact"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-800 text-white rounded-full text-lg font-bold shadow-lg transition-all"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  );
}
