"use client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronRight, FaLinkedin, FaQuoteLeft, FaStar, FaBriefcase } from "react-icons/fa";
import {
  useGetAboutUsQuery,
  useGetWhyChooseUsQuery,
  useGetTeamsQuery,
  useGetTimelineQuery,
  useGetPartnersQuery,
  useGetTestimonialsQuery,
} from "@/redux/services/aboutUsApi";

export default function AboutPage() {
  const { data: about, isLoading: aboutLoading } = useGetAboutUsQuery();
  const { data: whyUs = [], isLoading: whyLoading } = useGetWhyChooseUsQuery();
  const { data: team = [], isLoading: teamLoading } = useGetTeamsQuery();
  const { data: timeline = [], isLoading: timelineLoading } = useGetTimelineQuery();
  const { data: partners = [], isLoading: partnersLoading } = useGetPartnersQuery();
  const { data: testimonials = [], isLoading: testimonialsLoading } = useGetTestimonialsQuery();

  // Testimonial slider logic
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

React.useEffect(() => {
  if (testimonials.length < 2) return;

  if (timeoutRef.current) clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => {
    setTestimonialIdx((i) => (i + 1) % testimonials.length);
  }, 6000);

  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}, [testimonialIdx, testimonials.length]);


  const goToTestimonial = (idx: number) => setTestimonialIdx(idx);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-800 to-black pb-20 overflow-x-hidden">
      <Head>
        <title>About Us | {about?.title || "Maindo Digital Agency"}</title>
        <meta name="description" content="Learn more about Maindo Digital Agency and our global journey." />
      </Head>
      <main className="flex flex-col items-center">

        {/* HERO & REGIONS */}
        <section className="w-full flex flex-col items-center justify-center py-16 px-2">
          {aboutLoading ? (
            <div className="text-white text-center py-12">Loading company info...</div>
          ) : about && (
            <>
              <motion.div
                className="flex flex-col items-center mb-3"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="text-gray-100 font-semibold text-base text-center">
                  {about.address} &nbsp; | &nbsp; 📞 {about.phone}
                </div>
                <div className="text-blue-200 text-sm mt-1">
                  <span className="mr-3">✉️ {about.email}</span>
                  {about.whatsapp && <span>WhatsApp: {about.whatsapp}</span>}
                </div>
              </motion.div>
              <motion.div
                className="w-full bg-white/90 rounded-2xl shadow-lg p-6 text-gray-800 mt-4 prose max-w-2xl"
                dangerouslySetInnerHTML={{ __html: about.about }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              />
            </>
          )}
        </section>

        {/* TIMELINE */}
        <section className="w-full max-w-4xl mx-auto py-10 px-2 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-200 text-center mb-8 tracking-tight">
            Company Milestones
          </h2>
          {timelineLoading ? (
            <div className="text-white text-center py-12">Loading milestones...</div>
          ) : (
            <ol className="relative border-l-4 border-blue-700/60 pl-6 space-y-10">
              {timeline.map((item, idx) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.13 * idx }}
                  className="relative"
                >
                  <span className="absolute -left-8 top-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow text-lg border-4 border-white">
                    {idx + 1}
                  </span>
                  <div className="bg-white/95 rounded-xl shadow p-6 ml-2 border-l-4 border-blue-600">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-blue-700 font-bold text-xl">{item.year}</span>
                    </div>
                    <div className="text-lg font-semibold mb-1">{item.title}</div>
                    <div className="text-gray-700">{item.desc}</div>
                  </div>
                </motion.li>
              ))}
            </ol>
          )}
        </section>

        {/* WHY CHOOSE US */}
        <section className="w-full max-w-5xl mx-auto py-10 px-2 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-200 text-center mb-8 tracking-tight">
            Why Choose Maindo Digital?
          </h2>
          {whyLoading ? <div className="text-white py-10 text-center">Loading...</div> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {whyUs.map((val, i) => (
                <motion.div
                  key={val.id}
                  className="flex flex-col items-center bg-white/95 rounded-xl shadow-xl p-7 hover:scale-105 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.09 * i }}
                >
                  <div className="font-bold text-lg text-blue-700 mb-1">{val.title}</div>
                  <div className="text-gray-600 text-center">{val.content}</div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

   {/* TEAM */}
<section className="w-full max-w-6xl mx-auto py-16 px-2 md:px-6">
  <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white text-center mb-12 tracking-tight drop-shadow">
    Meet Our Team
  </h2>
  {teamLoading ? (
    <div className="text-white py-10 text-center">Loading team...</div>
  ) : (
    <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {team.map((person, idx) => (
        <motion.div
          key={person.id}
          className="relative group bg-white/90 dark:bg-blue-900/80 rounded-3xl shadow-2xl pt-20 pb-8 px-7 flex flex-col items-center text-center border border-blue-100 hover:shadow-blue-200/80 dark:border-blue-800 overflow-visible transition-all duration-300"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06 * idx }}
        >
          {/* Floating Avatar with animated ring */}
          <div className="absolute left-1/2 -top-14 -translate-x-1/2 z-20">
            <div className="relative">
              <Image
                src={
                  person.image ||
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(person.name) +
                  "&size=256&background=2d6cdf&color=fff"
                }
                width={112}
                height={112}
                alt={person.name}
                className="rounded-full shadow-xl border-4 border-blue-600 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 object-cover bg-white"
              />
              {/* LinkedIn Button */}
              {person.linkedin && (
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -bottom-2 -right-2 bg-blue-700 hover:bg-blue-900 text-white rounded-full p-2 border-2 border-white shadow-md transition-all"
                  title={`Connect with ${person.name} on LinkedIn`}
                >
                  <FaLinkedin className="text-xl" />
                </a>
              )}
            </div>
          </div>
          {/* Glass overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600/60 via-blue-400/30 to-transparent opacity-0 group-hover:opacity-90 pointer-events-none transition-all duration-500 rounded-3xl"
            initial={false}
            whileHover={{ opacity: 0.85 }}
          />
          {/* Info */}
          <div className="mt-8 mb-2">
            <div className="text-2xl font-extrabold text-blue-800 dark:text-white mb-1 drop-shadow">
              {person.name}
            </div>
            <div className="inline-block bg-blue-100/80 dark:bg-blue-800/80 text-blue-700 dark:text-blue-200 px-4 py-1 rounded-full text-xs font-bold tracking-wide shadow mb-2 uppercase">
              {person.title}
            </div>
          </div>
          <div className="text-gray-600 dark:text-blue-100 mb-4 text-sm line-clamp-4 transition-all group-hover:line-clamp-none">
            {person.bio}
          </div>
          {/* Skill tags (optional) */}
          {Array.isArray(person.tags) && person.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {person.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-blue-50 dark:bg-blue-800/60 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold shadow"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {/* Fancy Contact Button (visible on hover) */}
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="opacity-0 group-hover:opacity-100 mt-4 inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            >
              Contact
            </a>
          )}
        </motion.div>
      ))}
    </div>
  )}
</section>


        {/* TESTIMONIAL SLIDER */}
        <section className="w-full max-w-4xl mx-auto py-12 px-2 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-200 text-center mb-8 tracking-tight">
            What Our Clients Say
          </h2>
          {testimonialsLoading ? (
            <div className="text-white text-center py-12">Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-blue-200 text-center py-12">No testimonials yet.</div>
          ) : (
            <div className="relative min-h-[300px] flex flex-col items-center justify-center">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={testimonials[testimonialIdx].id}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.7 }}
                  className="bg-white/90 rounded-xl shadow-xl px-8 py-7 flex flex-col items-center max-w-xl text-center"
                >
                  <FaQuoteLeft className="text-blue-400 text-2xl mb-2" />
                  <p className="text-lg font-medium text-gray-800 italic mb-4">
                    &quot;{testimonials[testimonialIdx].quote}&quot;
                  </p>
                  <div className="flex gap-1 mb-1 justify-center">
                    {[...Array(testimonials[testimonialIdx].stars)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <div className="flex flex-col items-center">
                    <Image
                      src={
                        testimonials[testimonialIdx].avatar ||
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(testimonials[testimonialIdx].name) +
                        "&size=128&background=2d6cdf&color=fff"
                      }
                      width={52}
                      height={52}
                      className="rounded-full border-2 border-blue-500 shadow mb-1"
                      alt={testimonials[testimonialIdx].name}
                    />
                    <div className="text-blue-800 font-bold text-base">
                      {testimonials[testimonialIdx].name}
                    </div>
                    <div className="text-sm text-blue-600">{testimonials[testimonialIdx].role}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 flex justify-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`w-3 h-3 rounded-full border border-blue-400 ${i === testimonialIdx ? "bg-blue-500 scale-110" : "bg-white"}`}
                    onClick={() => goToTestimonial(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* PARTNER LOGOS */}
        <section className="w-full max-w-5xl mx-auto py-10 px-2 md:px-6 flex flex-col items-center">
          <h2 className="text-xl md:text-2xl font-bold text-blue-200 text-center mb-6 tracking-tight">
            Trusted by Global Partners
          </h2>
          {partnersLoading ? (
            <div className="text-white text-center py-12">Loading partners...</div>
          ) : (
            <div className="flex flex-wrap justify-center gap-7 items-center">
              {partners.map((partner) => (
                <motion.a
                  key={partner.id}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block grayscale hover:grayscale-0 hover:scale-105 transition-all duration-300 bg-white rounded-xl px-4 py-2 shadow-lg"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={partner.img}
                    alt={partner.name}
                    width={90}
                    height={38}
                    className="object-contain h-10"
                  />
                </motion.a>
              ))}
            </div>
          )}
        </section>

        {/* CAREER CTA */}
        <motion.div
          className="w-full flex justify-center pb-16 mt-8"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Link
            href="/careers"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 hover:from-blue-700 hover:to-black text-white font-extrabold rounded-full shadow-2xl text-xl transition-all duration-300 animate-pulse"
          >
            <FaBriefcase className="text-2xl" /> Join Our Global Team <FaChevronRight className="text-2xl" />
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
