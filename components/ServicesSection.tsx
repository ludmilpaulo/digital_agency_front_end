// components/ServicesSection.tsx
"use client";
import { motion } from "framer-motion";
import { FaCode, FaMobileAlt, FaBullhorn, FaCloud } from "react-icons/fa";
import Link from "next/link";

const services = [
  {
    icon: <FaCode className="text-blue-500 text-4xl" />,
    title: "Web Development",
    desc: "Stunning, scalable websites & web apps. From landing pages to custom platforms.",
  },
  {
    icon: <FaMobileAlt className="text-green-500 text-4xl" />,
    title: "Mobile Apps",
    desc: "iOS & Android apps with great UX, built fast with React Native or Flutter.",
  },
  {
    icon: <FaBullhorn className="text-pink-500 text-4xl" />,
    title: "Digital Marketing",
    desc: "SEO, PPC, content, and social media campaigns to boost your online reach.",
  },
  {
    icon: <FaCloud className="text-yellow-500 text-4xl" />,
    title: "Cloud & Automation",
    desc: "Modern infrastructure, API integrations, AI and business process automation.",
  },
];

const pricing = [
  {
    plan: "Starter",
    price: "R3,900",
    features: [
      "1 Page Modern Website",
      "Mobile Responsive",
      "Basic SEO Setup",
      "Contact Form",
      "Delivery: 5 days",
    ],
    cta: "Get Started",
  },
  {
    plan: "Business",
    price: "R8,900",
    features: [
      "5-8 Pages, Blog, Portfolio",
      "Advanced SEO",
      "Performance Optimization",
      "Whatsapp/Chat Integration",
      "Delivery: 10 days",
    ],
    cta: "Book Now",
    popular: true,
  },
  {
    plan: "Growth",
    price: "R14,900",
    features: [
      "E-commerce or App",
      "Custom Integrations",
      "Marketing Setup",
      "Ongoing Support (2 mo)",
      "Delivery: 14-21 days",
    ],
    cta: "Consult Us",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-900 mb-4">
          What We Do
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          Our core services are tailored to grow your business, digitally.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              className="rounded-2xl bg-white shadow-lg p-7 flex flex-col items-center gap-4 hover:-translate-y-2 hover:shadow-2xl transition-all"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 * idx, duration: 0.7, type: "spring" }}
            >
              {service.icon}
              <h3 className="text-xl font-bold text-blue-900">{service.title}</h3>
              <p className="text-gray-600 text-center">{service.desc}</p>
            </motion.div>
          ))}
        </div>
        {/* Pricing Table */}
        <h3 className="text-2xl font-bold text-center text-blue-900 mb-8">Website Packages</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {pricing.map((pkg, i) => (
            <motion.div
              key={pkg.plan}
              className={`rounded-2xl shadow-xl p-8 bg-white border-2 ${
                pkg.popular ? "border-blue-500 scale-105 z-10" : "border-gray-100"
              } flex flex-col items-center`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 * i }}
            >
              <div className="text-lg font-bold uppercase text-blue-600 mb-2">{pkg.plan}</div>
              <div className="text-3xl font-extrabold mb-4 text-blue-900">{pkg.price}</div>
              <ul className="mb-6 text-gray-600 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="py-1 flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
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
