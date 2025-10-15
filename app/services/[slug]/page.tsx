"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { baseAPI } from "@/useAPI/api";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCode,
  FaMobileAlt,
  FaBullhorn,
  FaCloud,
  FaCogs,
  FaRocket,
  FaChartLine,
} from "react-icons/fa";

interface Plan {
  id: number;
  service: number;
  name: string;
  price: string;
  features: string[];
  cta: string;
  popular: boolean;
  order: number;
}

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  featured: boolean;
  order: number;
  plans: Plan[];
}

const SERVICE_ICONS: Record<string, JSX.Element> = {
  "fa-code": <FaCode className="text-blue-600 text-5xl mb-3" />,
  "fa-mobile-alt": <FaMobileAlt className="text-green-600 text-5xl mb-3" />,
  "fa-bullhorn": <FaBullhorn className="text-pink-600 text-5xl mb-3" />,
  "fa-cloud": <FaCloud className="text-purple-600 text-5xl mb-3" />,
  "fa-cogs": <FaCogs className="text-yellow-600 text-5xl mb-3" />,
  "fa-rocket": <FaRocket className="text-red-600 text-5xl mb-3" />,
  "fa-chart-line": <FaChartLine className="text-blue-500 text-5xl mb-3" />,
};

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchService() {
      setLoading(true);
      try {
        const res = await fetch(`${baseAPI}/services/services/${slug}/`);
        if (!res.ok) throw new Error("Service not found");
        const data = await res.json();
        setService(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-blue-500 text-2xl font-bold animate-pulse">Loading…</div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">{error || "Service Not Found"}</h1>
        <Link href="/services" className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-800 text-white font-bold shadow flex items-center gap-2">
          <FaArrowLeft /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black">
      {/* Hero Section */}
{/* Hero Section */}
<section className="relative h-[50vh] w-full">
  <div className="absolute inset-0">
    <Image
      src="/logo.png" // fallback image always
      alt={service.title}
      fill
      priority
      className="object-cover opacity-60"
    />
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        {/* Icon */}
        <div className="mb-3">
          {SERVICE_ICONS[service.icon] || <FaCode className="text-white text-5xl" />}
        </div>

        {/* Title */}
        <h1 className="text-white text-4xl md:text-5xl font-bold">{service.title}</h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto mt-3 text-lg text-gray-200">
          {service.description}
        </p>

        {/* CTA Button */}
        <Link
          href={`/proposal?service=${encodeURIComponent(service.title)}`}
          className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-lg"
        >
          Request a Proposal <FaArrowRight />
        </Link>
      </motion.div>
    </div>
  </div>
</section>



      {/* Pricing Section */}
      {service.plans?.length > 0 && (
        <section className="max-w-6xl mx-auto py-16 px-4">
          <h2 className="text-white text-3xl font-bold mb-12 text-center">Plans & Pricing</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {service.plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-8 bg-white border-2 shadow-xl transform transition duration-300 hover:scale-105 ${
                  plan.popular ? "border-blue-500 relative z-10" : "border-gray-200"
                }`}
              >
                <h3 className="text-xl font-bold text-blue-600 mb-2">{plan.name}</h3>
                <div className="text-3xl font-extrabold mb-4 text-blue-900">{plan.price}</div>
                <ul className="mb-6 text-gray-700">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="py-1 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span> {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/proposal?service=${encodeURIComponent(service.title)}&plan=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(plan.price)}`}
                  className={`block w-full text-center py-2 rounded-full font-semibold shadow-md transition ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-800 text-white hover:bg-black"
                  }`}
                >
                  {plan.cta}
                </Link>
                {plan.popular && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded shadow">
                    Popular
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
