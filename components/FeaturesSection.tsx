// components/FeaturesSection.tsx
"use client";
import { FaRocket, FaHandshake, FaMobileAlt, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    icon: <FaRocket className="text-blue-500 text-3xl" />,
    title: "Fast Launch",
    desc: "From idea to live product, we deliver fast with uncompromising quality.",
  },
  {
    icon: <FaHandshake className="text-blue-500 text-3xl" />,
    title: "True Partnership",
    desc: "We collaborate, advise, and walk the journey with you, not just deliver code.",
  },
  {
    icon: <FaMobileAlt className="text-blue-500 text-3xl" />,
    title: "Mobile-First",
    desc: "Everything we build is responsive and works seamlessly on every device.",
  },
  {
    icon: <FaShieldAlt className="text-blue-500 text-3xl" />,
    title: "Secure & Reliable",
    desc: "We use secure best-practices and provide ongoing support for peace of mind.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-blue-900">Why Choose Maindo Digital?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-5 bg-blue-50 rounded-xl shadow-md p-6">
              <div>{f.icon}</div>
              <div>
                <div className="font-bold text-lg text-blue-800">{f.title}</div>
                <div className="text-blue-900/80 mt-1">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
