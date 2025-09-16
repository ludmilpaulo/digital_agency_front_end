"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useGetAboutUsQuery } from "@/redux/services/aboutUsApi";
import { baseAPI } from "@/useAPI/api";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

// Lottie Player (client-only)
const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

interface FormData {
  subject: string;
  from_email: string;
  phone: string;
  message: string;
}

const socials = [
  { icon: FaFacebookF, key: "facebook", url: (about: any) => about?.facebook },
  { icon: FaInstagram, key: "instagram", url: (about: any) => about?.instagram },
  { icon: FaLinkedinIn, key: "linkedin", url: (about: any) => about?.linkedin },
  { icon: FaTwitter, key: "twitter", url: (about: any) => about?.twitter },
];

export default function ContactClient() {
  const { data: about } = useGetAboutUsQuery();
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    from_email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.subject || !formData.from_email || !formData.phone || !formData.message) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseAPI}/info/contacts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess("Your message was sent successfully!");
        setFormData({ subject: "", from_email: "", phone: "", message: "" });
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101725] via-[#23316B] to-[#0e253e] px-4 py-16"
      style={{
        backgroundImage: about?.backgroundApp ? `url(${about.backgroundApp})` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* WhatsApp Floating Button */}
      {about?.whatsapp && (
        <a
          href={`https://wa.me/${about.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-50 bottom-8 right-8 shadow-xl bg-green-500 hover:bg-green-600 rounded-full p-4 animate-bounce"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={24} color="white" />
        </a>
      )}

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 bg-transparent">
        {/* Company Info */}
        <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-blue-100 text-center animate-fade-in-up">
          <LottiePlayer
            autoplay
            loop
            src="/lottie/contact-animation.json"
            style={{ height: "100px", width: "100px" }}
            className="mx-auto mb-3"
          />
          <div className="w-20 h-20 relative mx-auto mb-3">
            <Image
              src={about?.logo || "/logo.png"}
              alt="Agency Logo"
              fill
              className="rounded-full border-4 border-blue-500 shadow-lg object-contain bg-white"
              sizes="80px"
              priority={false}
            />
          </div>

          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            {about?.title || "Maindo Digital"}
          </h2>
          <div
            className="text-gray-700 dark:text-gray-300 mb-5"
            dangerouslySetInnerHTML={{ __html: about?.about || "Contact us for digital solutions." }}
          />

          <div className="flex items-center justify-center text-blue-700 gap-2 mb-2">
            <FaMapMarkerAlt />
            <span>{about?.address || "Our Address"}</span>
          </div>
          <div className="flex items-center justify-center text-blue-700 gap-2 mb-2">
            <FaPhoneAlt />
            <span>{about?.phone || "+000000000"}</span>
          </div>
          <div className="flex items-center justify-center text-blue-700 gap-2 mb-2">
            <FaEnvelope />
            <span>{about?.email || "support@domain.com"}</span>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            {socials.map(({ icon: Icon, key, url }) => {
              const socialLink = url(about);
              if (!socialLink) return null;
              return (
                <a
                  key={key}
                  href={socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 p-2 rounded-full hover:scale-110 transition"
                  aria-label={key}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

          {about?.address && (
            <div className="mt-6">
              <iframe
                title="Google Map"
                width="100%"
                height="180"
                className="rounded-xl border shadow"
                style={{ maxWidth: 380 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(about.address)}&output=embed`}
              />
            </div>
          )}
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-blue-100 animate-fade-in-up"
        >
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Get In Touch</h2>
          <div className="space-y-5">
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              name="from_email"
              value={formData.from_email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              rows={4}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-transparent shadow-sm resize-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {error && <div className="text-red-600">{error}</div>}
            {success && <div className="text-green-600 font-medium">{success}</div>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.75s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
