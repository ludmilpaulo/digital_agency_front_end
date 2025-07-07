"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FaSpinner, FaPaperPlane } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { FaLinkedin, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { baseAPI } from "@/useAPI/api";
import { RootState } from "@/redux/store";

// Utility for fallback if AboutUs is not loaded yet
const fallback = {
  logo: "/logo.png",
  title: "Maindo Digital Agency",
  email: "info@maindodigital.com",
  address: "Sandton, Johannesburg, South Africa",
  whatsapp: "+27 84 2368752",
  linkedin: "https://linkedin.com/company/maindodigital",
  facebook: "https://facebook.com/maindodigital",
  twitter: "https://twitter.com/maindodigital",
  instagram: "https://instagram.com/maindodigital",
};

export default function ProposalPage() {
  const aboutUs = useSelector((state: RootState) => state.aboutUs.data) || fallback;
    const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    time_frame: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseAPI}/services/proposals/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", email: "", phone: "", company: "", service: "", time_frame: "", message: "" });

        toast.success("Your request was submitted! Please check your email for confirmation.");
        router.push('/');
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-black flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row bg-white/95 rounded-3xl shadow-[0_4px_32px_0_#2563eb22] overflow-hidden">
        {/* Left: Brand panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900 px-10 py-16 w-1/2">
          <Image
            src={aboutUs.logo || fallback.logo}
            alt={`${aboutUs.title} Logo`}
            width={96}
            height={96}
            className="mb-5 rounded-2xl bg-white p-2 shadow-lg"
            priority
          />
          <h2 className="text-white text-3xl font-extrabold mb-2 text-center tracking-tight drop-shadow-xl">
            Request a Proposal
          </h2>
          <p className="text-blue-100 text-base font-medium mb-6 text-center leading-relaxed">
            Let’s create something amazing together.<br />
            Expect a response from our experts within 24 hours.
          </p>
          <ul className="text-blue-100 text-sm flex flex-col gap-1 mt-6">
            <li>
              <span className="font-semibold">Email:</span> {aboutUs.email}
            </li>
            <li>
              <span className="font-semibold">WhatsApp:</span> {aboutUs.whatsapp || "+27 60 536 3912"}
            </li>
            <li>
              <span className="font-semibold">Address:</span> {aboutUs.address}
            </li>
          </ul>
         <div className="flex gap-4 mt-6">
  {aboutUs.linkedin && (
    <a
      href={aboutUs.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      title="LinkedIn"
      className="hover:scale-110 transition"
    >
      <FaLinkedin size={28} className="text-[#0077b5]" />
    </a>
  )}
  {aboutUs.instagram && (
    <a
      href={aboutUs.instagram}
      target="_blank"
      rel="noopener noreferrer"
      title="Instagram"
      className="hover:scale-110 transition"
    >
      <FaInstagram size={28} className="text-[#e4405f]" />
    </a>
  )}
  {aboutUs.facebook && (
    <a
      href={aboutUs.facebook}
      target="_blank"
      rel="noopener noreferrer"
      title="Facebook"
      className="hover:scale-110 transition"
    >
      <FaFacebook size={28} className="text-[#1877f3]" />
    </a>
  )}
  {aboutUs.twitter && (
    <a
      href={aboutUs.twitter}
      target="_blank"
      rel="noopener noreferrer"
      title="Twitter"
      className="hover:scale-110 transition"
    >
      <FaTwitter size={28} className="text-[#1da1f2]" />
    </a>
  )}
</div>

        </div>

        {/* Right: Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 px-8 py-10 flex flex-col gap-5 justify-center"
        >
          <h1 className="md:hidden text-3xl font-extrabold text-blue-800 mb-2 text-center">Request a Proposal</h1>
          <p className="md:hidden text-center text-blue-600 mb-3 text-sm">
            Let’s create something amazing together.<br />
            Our team replies within 24 hours.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              name="name"
              placeholder="Your Name"
              className="input"
              value={form.name}
              onChange={handleChange}
            />
            <input
              required
              name="email"
              type="email"
              placeholder="Your Email"
              className="input"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Phone (optional)"
              className="input"
              value={form.phone}
              onChange={handleChange}
            />
            <input
              name="company"
              placeholder="Company (optional)"
              className="input"
              value={form.company}
              onChange={handleChange}
            />
          </div>
          <input
            name="service"
            placeholder="Service Interested In"
            className="input"
            value={form.service}
            onChange={handleChange}
          />
          <input
            name="time_frame"
            placeholder="Expected Time Frame (e.g. 2 weeks, ASAP)"
            className="input"
            value={form.time_frame}
            onChange={handleChange}
          />

          <textarea
            required
            name="message"
            placeholder="What do you need? Tell us about your goals, project or vision…"
            rows={4}
            className="input"
            value={form.message}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-8 rounded-full bg-blue-700 text-white font-bold text-lg shadow-lg transition-all hover:bg-blue-900 flex items-center justify-center gap-2"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
            {loading ? "Sending..." : "Send Request"}
          </button>
          <div className="text-center text-gray-400 text-xs mt-2">
            We respect your privacy. Your details are 100% safe and never shared.
          </div>
        </form>
      </div>
      {/* Tailwind className helper */}
      <style jsx global>{`
        .input {
          @apply p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white/90 text-blue-900;
        }
      `}</style>
    </main>
  );
}
