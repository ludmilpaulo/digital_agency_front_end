"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useGetServicesQuery } from "@/redux/services/servicesApi";
import { FaCode, FaMobileAlt, FaBullhorn, FaCloud, FaCogs, FaRocket, FaChartLine } from "react-icons/fa";
import Image from "next/image";

// Icon mapping
const iconMap: Record<string, JSX.Element> = {
  "web-development": <FaCode className="text-blue-600 text-4xl mb-2" />,
  "mobile-apps": <FaMobileAlt className="text-green-600 text-4xl mb-2" />,
  "digital-marketing": <FaBullhorn className="text-pink-600 text-4xl mb-2" />,
  "cloud": <FaCloud className="text-yellow-600 text-4xl mb-2" />,
  "automation": <FaCogs className="text-yellow-600 text-4xl mb-2" />,
  "branding": <FaRocket className="text-red-600 text-4xl mb-2" />,
  "analytics": <FaChartLine className="text-blue-400 text-4xl mb-2" />,
};

export default function ServicesSection() {
  const { data: services = [], isLoading } = useGetServicesQuery();

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-900 mb-4">
          What We Do
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          Our core services are tailored to grow your business, digitally.
        </p>
        {/* Horizontal Scroll: Services */}
        <motion.div
          className="flex gap-6 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-blue-200 mb-20"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } }
          }}
        >
          {services.map((service, idx) => (
            <motion.div
              key={service.id || service.slug || service.title}
              className="min-w-[260px] w-[270px] rounded-2xl bg-white shadow-lg p-7 flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Icon fallback: use slug or title */}
              {iconMap[service.slug] || iconMap[service.title?.toLowerCase().replace(/\s/g, "-")] || <FaCogs className="text-gray-300 text-4xl mb-2" />}
              <h3 className="text-xl font-bold text-blue-900 mb-1">{service.title}</h3>
              <p className="text-gray-600 text-center mb-3">{service.description}</p>
              {service.image && (
                <div className="mb-2">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={60}
                    height={60}
                    className="rounded"
                  />
                </div>
              )}
              <Link
                href={`/services/${service.slug}`}
                className="mt-2 text-blue-500 font-semibold underline hover:text-blue-700"
              >
                Learn More
              </Link>

            </motion.div>
          ))}
          {isLoading && (
            <div className="text-blue-500 font-bold py-10 text-center">Loading services…</div>
          )}
        </motion.div>
        {/* Pricing Table */}
        <h3 className="text-2xl font-bold text-center text-blue-900 mb-8">Website Packages</h3>
        <div className="flex gap-8 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-blue-200">
          {(services[0]?.plans || []).map((pkg, i) => (
            <motion.div
              key={pkg.id}
              className={`relative rounded-2xl shadow-xl p-8 min-w-[300px] bg-white border-2 ${
                pkg.popular ? "border-blue-500 scale-105 z-10" : "border-gray-100"
              } flex flex-col items-center`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.10 * i }}
            >
              <div className="text-lg font-bold uppercase text-blue-600 mb-2">{pkg.name}</div>
              <div className="text-3xl font-extrabold mb-4 text-blue-900">{pkg.price}</div>
              <ul className="mb-6 text-gray-600 flex-1">
                {pkg.features.map((f: string) => (
                  <li key={f} className="py-1 flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/appointment"
                className={`px-5 py-2 rounded-full font-bold text-white transition-all shadow-lg ${
                  pkg.popular
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-700 hover:bg-gray-900"
                }`}
              >
                {pkg.cta}
              </Link>
              {pkg.popular && (
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs rounded px-3 py-1 shadow font-bold">
                  Most Popular
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
