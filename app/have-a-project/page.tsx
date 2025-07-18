"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaPhone, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { baseAPI } from '@/useAPI/api';

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  project: "",
  budget: "",
  message: "",
};
const budgets = [
  "Under R2,000",
  "R2,000 - R5,000",
  "R5,000 - R15,000",
  "R15,000 - R50,000",
  "Above R50,000",
];

export default function HaveAProjectPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);
  setSubmitted(false);
  try {
    const res = await fetch(`${baseAPI}/project/submit-inquiry/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted(true);
      setForm(initialForm);
    } else {
      const data = await res.json();
      setError(
        data.detail ||
        data.non_field_errors?.[0] ||
        "Something went wrong. Please try again."
      );
    }
  } catch (err) {
    setError("Network error. Please try again.");
  }
  setLoading(false);
};


  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-gray-950 flex flex-col items-center justify-center px-2 sm:px-4">
      {/* HERO CARD */}
      <motion.section
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl mt-12"
      >
        <div className="bg-white/90 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 drop-shadow-lg mb-4 text-center">
            Have a Project in Mind?<br />
            <span className="text-blue-600">Let’s Build it Together!</span>
          </h1>
          <p className="text-gray-700 text-base sm:text-lg md:text-xl font-medium mb-6 text-center">
            Share your vision. Let our team help you plan, design, and launch a solution that transforms your business.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mt-3 w-full">
            <Link href="https://wa.me/27659031894" target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition justify-center">
              <FaWhatsapp /> WhatsApp
            </Link>
            <a href="mailto:support@maindodigital.com" className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow transition justify-center">
              <FaEnvelope /> Email Us
            </a>
            <a href="tel:+27659031894" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-blue-900 text-white font-semibold shadow transition justify-center">
              <FaPhone /> +27 65 903 1894
            </a>
          </div>
        </div>
      </motion.section>

      {/* FORM */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full max-w-2xl bg-white/95 rounded-2xl shadow-xl p-4 sm:p-8"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-3 text-blue-900">Project Brief</h2>
        <AnimatePresence>
          {submitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center py-8"
            >
              <div className="text-4xl mb-3">✅</div>
              <p className="text-blue-700 font-semibold text-lg mb-2">Thank you! We&#39;ll contact you soon.</p>
              <button
                className="mt-4 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold"
                onClick={() => setSubmitted(false)}
              >
                Send another project
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4"
              onSubmit={handleSubmit}
            >
              {/* Responsive: flex-col on mobile, flex-row on md+ */}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  className="flex-1 border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-300"
                  placeholder="Your Name"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  disabled={loading}
                />
                <input
                  className="flex-1 border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-300"
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  className="flex-1 border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-300"
                  placeholder="Phone"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  disabled={loading}
                />
                <input
                  className="flex-1 border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-300"
                  placeholder="Company (optional)"
                  value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  disabled={loading}
                />
              </div>
              <input
                className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-300"
                placeholder="Project Title or Type (eg. E-commerce Website)"
                required
                value={form.project}
                onChange={e => setForm({ ...form, project: e.target.value })}
                disabled={loading}
              />
              <select
                className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-300"
                value={form.budget}
                onChange={e => setForm({ ...form, budget: e.target.value })}
                required
                disabled={loading}
              >
                <option value="">Estimated Budget</option>
                {budgets.map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              <textarea
                className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-300 min-h-[100px]"
                placeholder="Describe your project or idea in detail..."
                required
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                disabled={loading}
              />
              <button
                type="submit"
                className="flex items-center gap-2 justify-center mt-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-800 text-white font-bold text-lg shadow transition-all"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin mr-2">⏳</span>
                ) : (
                  <FaArrowRight />
                )}
                {loading ? "Sending..." : "Send Project Brief"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 sm:mt-16 max-w-3xl w-full text-center px-2"
      >
        <h3 className="text-lg sm:text-xl font-bold text-blue-100 mb-6 uppercase tracking-wider">Why Choose Maindo Digital?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          <div className="bg-white/90 rounded-lg shadow-lg p-5">
            <div className="text-4xl text-blue-400 mb-2">🚀</div>
            <div className="text-blue-900 font-bold mb-1">Results-Driven</div>
            <div className="text-gray-700 text-sm">We measure our success by your growth—ROI, leads, and engagement.</div>
          </div>
          <div className="bg-white/90 rounded-lg shadow-lg p-5">
            <div className="text-4xl text-blue-400 mb-2">🤝</div>
            <div className="text-blue-900 font-bold mb-1">Real Partnership</div>
            <div className="text-gray-700 text-sm">You get dedicated experts, transparent progress, and true collaboration.</div>
          </div>
          <div className="bg-white/90 rounded-lg shadow-lg p-5">
            <div className="text-4xl text-blue-400 mb-2">💡</div>
            <div className="text-blue-900 font-bold mb-1">Tech & Creativity</div>
            <div className="text-gray-700 text-sm">Web, mobile, automation, design & marketing—all under one roof.</div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
