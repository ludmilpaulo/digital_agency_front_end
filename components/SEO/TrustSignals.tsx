"use client";

import { motion } from "framer-motion";
import { Shield, Clock, Award, HeadphonesIcon, Rocket, Target } from "lucide-react";

export default function TrustSignals() {
  const signals = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Enterprise-grade security for all projects",
      color: "blue"
    },
    {
      icon: Clock,
      title: "On-Time Delivery",
      description: "98% projects delivered on schedule",
      color: "green"
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized excellence in digital solutions",
      color: "yellow"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
      color: "purple"
    },
    {
      icon: Rocket,
      title: "Fast Turnaround",
      description: "Quick delivery without compromising quality",
      color: "red"
    },
    {
      icon: Target,
      title: "Result-Driven",
      description: "Average 250% ROI for our clients",
      color: "indigo"
    }
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    green: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    yellow: "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white",
    purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    red: "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white",
    indigo: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">Maindo Digital?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're not just another digital agency. We're your partner in growth, committed to delivering exceptional results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {signals.map((signal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
            >
              <div
                className={`inline-flex p-4 rounded-xl mb-6 transition-all duration-300 ${
                  colorClasses[signal.color as keyof typeof colorClasses]
                }`}
              >
                <signal.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {signal.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{signal.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Client Logos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Trusted by Leading Brands Across South Africa
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 hover:opacity-75 transition-opacity">
            {/* Placeholder for client logos */}
            <div className="text-gray-400 italic">Client logos will appear here</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

