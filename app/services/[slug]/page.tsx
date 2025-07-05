"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaCode } from "react-icons/fa";
import { useGetServiceBySlugQuery } from "@/redux/services/servicesApi";
import { SERVICE_ICONS } from "@/utils/serviceIcons";

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug as string;
  const { data: service, isLoading, error } = useGetServiceBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-blue-500 text-2xl font-bold animate-pulse">Loading…</div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Service Not Found</h1>
        <Link href="/services" className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-800 text-white font-bold shadow flex items-center gap-2">
          <FaArrowLeft /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-black">
      {/* Hero Section */}
      <section className="w-full relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        {service.heroImg ? (
          <Image
            src={service.heroImg}
            alt={service.title}
            fill
            priority
            className="object-cover object-center opacity-50"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-black opacity-70" />
        )}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            {SERVICE_ICONS[service.icon] || <FaCode className="text-blue-400 text-5xl" />}
            <h1 className="text-white text-4xl md:text-5xl font-extrabold mt-4 drop-shadow-lg mb-4">
              {service.title}
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-blue-100 font-medium mb-4">
              {service.summary}
            </p>
            <Link href="/contact">
              <span className="inline-block px-8 py-3 mt-3 bg-blue-600 hover:bg-blue-800 text-white font-bold text-lg rounded-full shadow-lg transition-all duration-200">
                Request a Proposal <FaArrowRight className="inline ml-2" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Service Details */}
      <motion.section
        className="max-w-5xl mx-auto py-12 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-blue-200 text-2xl font-bold mb-4">What We Offer</h2>
            <ul className="space-y-4 text-lg text-blue-100">
              {service.details?.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-2 h-2 mt-2 rounded-full bg-blue-400 inline-block"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-blue-200 text-2xl font-bold mb-4">Key Features</h2>
            <ul className="space-y-4 text-lg text-blue-100">
              {service.features?.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-400 inline-block" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="flex justify-center mt-8 mb-14"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 hover:from-blue-700 hover:to-black text-white font-extrabold rounded-full shadow-2xl text-xl transition-all duration-300 animate-pulse"
        >
          Start Your Project <FaArrowRight className="text-2xl" />
        </Link>
      </motion.section>
    </main>
  );
}
