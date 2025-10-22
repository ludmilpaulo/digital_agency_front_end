"use client";

import { motion } from "framer-motion";
import MainBanner from "@/components/MainBanner";
import ServicesSection from "@/components/ServicesSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BadgesRow from "@/components/BadgesRow";
import ScrollToTop from "@/components/ScrollToTop";
import TrustSignals from "@/components/SEO/TrustSignals";
import CTASection from "@/components/SEO/CTASection";

export default function HomeClient() {
  return (
    <main>
      {/* Hero Section */}
      <MainBanner />

      {/* Services Section */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <ServicesSection />
      </motion.section>

      {/* Trust Signals - NEW */}
      <TrustSignals />

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <FeaturesSection />
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <TestimonialsSection />
      </motion.section>

      {/* CTA Section - NEW */}
      <CTASection />

      {/* Badges Row */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <BadgesRow />
      </motion.section>

      <ScrollToTop />
    </main>
  );
}
