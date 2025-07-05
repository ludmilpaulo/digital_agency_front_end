"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaCode } from "react-icons/fa";
import { useGetServiceQuery } from "@/redux/services/servicesApi";
import { SERVICE_ICONS } from "@/utils/serviceIcons";

// Handles slug routing (e.g. /services/web-development)
export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug as string;

  // Use getService with the slug (or id), assuming your API supports lookup by slug.
  // If not, fetch all and find by slug.
  const { data: service, isLoading, error } = useGetServiceQuery(slug);

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
        <Image
          src={service.image}
          alt={service.title}
          fill
          priority
          className="object-cover object-center opacity-50"
        />
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
              {service.description}
            </p>
            <Link href="/contact">
              <span className="inline-block px-8 py-3 mt-3 bg-blue-600 hover:bg-blue-800 text-white font-bold text-lg rounded-full shadow-lg transition-all duration-200">
                Request a Proposal <FaArrowRight className="inline ml-2" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Service Plans */}
      {service.plans?.length > 0 && (
        <motion.section
          className="max-w-5xl mx-auto py-12 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-blue-200 text-2xl font-bold mb-8 text-center">Plans & Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {service.plans.map((plan) => (
              <motion.div
                key={plan.id}
                className={`rounded-2xl shadow-xl p-8 bg-white border-2 ${
                  plan.popular ? "border-blue-500 scale-105 z-10" : "border-gray-100"
                } flex flex-col items-center relative`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="text-lg font-bold uppercase text-blue-600 mb-2">{plan.name}</div>
                <div className="text-3xl font-extrabold mb-4 text-blue-900">{plan.price}</div>
                <ul className="mb-6 text-gray-600 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="py-1 flex items-center">
                      <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`px-5 py-2 rounded-full font-bold text-white transition-all shadow-lg ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-900"
                  }`}
                >
                  {plan.cta}
                </Link>
                {plan.popular && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs rounded px-3 py-1 shadow font-bold">
                    Most Popular
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </main>
  );
}
