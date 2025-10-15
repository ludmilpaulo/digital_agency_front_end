"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FaSpinner, FaPaperPlane, FaLinkedin, FaInstagram, FaFacebook, FaTwitter, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { baseAPI } from "@/useAPI/api";
import type { RootState } from "@/redux/store";

// Load Toaster only on the client (avoids any SSR hiccups)
const Toaster = dynamic(() => import("react-hot-toast").then(m => m.Toaster), { ssr: false });

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

export default function ProposalClient() {
  const aboutUs = useSelector((state: RootState) => state.aboutUs?.data) || fallback;
  const router = useRouter();
  const searchParams = useSearchParams();

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
  const [selectedPlan, setSelectedPlan] = useState<{
    service?: string;
    plan?: string;
    price?: string;
  }>({});

  // Pre-fill form from URL parameters
  useEffect(() => {
    const service = searchParams.get("service");
    const plan = searchParams.get("plan");
    const price = searchParams.get("price");

    if (service || plan || price) {
      setSelectedPlan({ service: service || "", plan: plan || "", price: price || "" });
      
      // Build service description
      let serviceText = service || "";
      if (plan) {
        serviceText += ` - ${plan}`;
      }
      if (price) {
        serviceText += ` (${price})`;
      }

      setForm(prev => ({
        ...prev,
        service: serviceText,
        message: plan && price 
          ? `I'm interested in the ${plan} plan for ${service} at ${price}. `
          : service 
          ? `I'm interested in ${service}. `
          : prev.message,
      }));
    }
  }, [searchParams]);

  const inputCls =
    "p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white/90 text-blue-900";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseAPI}/services/proposals/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        cache: "no-store",
      });

      if (res.ok) {
        setForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          time_frame: "",
          message: "",
        });
        toast.success("Your request was submitted! Please check your email for confirmation.");
        router.push("/");
      } else {
        // Try to show API error details if present
        let msg = "Something went wrong. Please try again.";
        try {
          const data = await res.json();
          msg =
            data?.detail ||
            data?.error ||
            Object.values(data || {}).flat().join(" ") ||
            msg;
        } catch {
          /* ignore */
        }
        toast.error(msg);
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
              <span className="font-semibold">WhatsApp:</span>{" "}
              {aboutUs.whatsapp || "+27 659031894"}
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
          <h1 className="md:hidden text-3xl font-extrabold text-blue-800 mb-2 text-center">
            Request a Proposal
          </h1>
          <p className="md:hidden text-center text-blue-600 mb-3 text-sm">
            Let's create something amazing together.<br />
            Our team replies within 24 hours.
          </p>

          {/* Selected Plan Indicator */}
          {selectedPlan.service && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
              <div className="flex items-start">
                <FaCheckCircle className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Selected Service</h3>
                  <p className="text-sm text-blue-800">
                    <strong>{selectedPlan.service}</strong>
                    {selectedPlan.plan && (
                      <>
                        <br />
                        <span className="text-blue-600">Plan: {selectedPlan.plan}</span>
                      </>
                    )}
                    {selectedPlan.price && (
                      <>
                        <br />
                        <span className="text-green-600 font-semibold">Price: {selectedPlan.price}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              name="name"
              placeholder="Your Name"
              className={inputCls}
              value={form.name}
              onChange={handleChange}
            />
            <input
              required
              name="email"
              type="email"
              placeholder="Your Email"
              className={inputCls}
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Phone (optional)"
              className={inputCls}
              value={form.phone}
              onChange={handleChange}
            />
            <input
              name="company"
              placeholder="Company (optional)"
              className={inputCls}
              value={form.company}
              onChange={handleChange}
            />
          </div>

          <input
            name="service"
            placeholder="Service Interested In"
            className={inputCls}
            value={form.service}
            onChange={handleChange}
          />
          <input
            name="time_frame"
            placeholder="Expected Time Frame (e.g. 2 weeks, ASAP)"
            className={inputCls}
            value={form.time_frame}
            onChange={handleChange}
          />
          <textarea
            required
            name="message"
            placeholder="What do you need? Tell us about your goals, project or vision…"
            rows={4}
            className={inputCls}
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
    </main>
  );
}
