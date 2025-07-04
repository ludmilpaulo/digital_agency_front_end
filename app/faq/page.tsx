"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Trust badge images (public web sources)
const badges = [
  {
    label: "Proudly South African",
    img: "https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg",
    alt: "Proudly South African",
  },
  {
    label: "Top Rated Digital Agency",
    img: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    alt: "Top Rated Digital Agency",
  },
  {
    label: "Google Partner",
    img: "https://upload.wikimedia.org/wikipedia/commons/2/28/Google_Partners_logo.svg",
    alt: "Google Partner",
  },
];

// FAQ categories
const CATEGORIES = [
  "General",
  "Web Development",
  "Mobile Apps",
  "Design & Branding",
  "E-commerce",
  "Digital Marketing",
  "Automation & Integrations",
  "Pricing & Payment",
  "Support & Maintenance",
  "Business & Ownership",
];

// 50 Q&As (now with categories!)
const faqs = [
  {
    q: "What services does Maindo Digital offer?",
    a: "We offer website development, mobile app development, UI/UX design, digital marketing (SEO, PPC, social media), branding, e-commerce, and automation solutions.",
    cat: "General",
  },
  {
    q: "How experienced is the Maindo Digital team?",
    a: "Our team is made up of senior engineers, designers, marketers, and project managers with years of experience delivering solutions for startups, SMEs, and large enterprises.",
    cat: "General",
  },
  {
    q: "Can you help if I only have a business idea, not a plan?",
    a: "Absolutely! We love working with founders and entrepreneurs at the idea stage. We'll help shape your idea, define requirements, and bring it to life.",
    cat: "General",
  },
  {
    q: "Do you provide free consultations?",
    a: "Yes, we offer a free initial consultation to understand your goals, needs, and how we can help.",
    cat: "General",
  },
  {
    q: "Do you build mobile apps for both iOS and Android?",
    a: "Yes. We use cross-platform technologies like React Native and Flutter to deliver seamless iOS and Android apps efficiently.",
    cat: "Mobile Apps",
  },
  {
    q: "What is your website development process?",
    a: "Our process includes requirements gathering, wireframing, design, development, testing, client review, deployment, and support.",
    cat: "Web Development",
  },
  {
    q: "How long does it take to build a typical website?",
    a: "Basic sites can be completed in as little as 5 days. More complex sites take 2-4 weeks, while custom platforms or e-commerce solutions may take longer.",
    cat: "Web Development",
  },
  {
    q: "How do you ensure my website is secure?",
    a: "We follow security best practices, use SSL, ensure secure hosting, and keep your site updated. For web apps, we implement secure authentication and data protection.",
    cat: "Web Development",
  },
  {
    q: "Do you provide e-commerce development?",
    a: "Yes! We build modern online stores with secure payment integration, inventory management, and mobile-friendly design.",
    cat: "E-commerce",
  },
  {
    q: "Can you redesign my existing website or app?",
    a: "Absolutely. We provide redesign and optimization services to modernize your digital presence and improve results.",
    cat: "Web Development",
  },
  {
    q: "Will my site or app be mobile-friendly?",
    a: "Yes. All our websites and apps are designed with a mobile-first approach to look and work great on any device.",
    cat: "Web Development",
  },
  {
    q: "Do you provide hosting for websites and apps?",
    a: "We offer reliable hosting packages, or we can help you choose the best hosting solution for your needs.",
    cat: "Support & Maintenance",
  },
  {
    q: "What platforms and technologies do you use?",
    a: "We specialize in React, Next.js, Django, Node.js, React Native, Flutter, WordPress, Shopify, and more. We always pick the best stack for your project.",
    cat: "Web Development",
  },
  {
    q: "How does Maindo Digital handle project management?",
    a: "We use agile methodology with clear milestones and regular updates. You’ll always know your project’s progress.",
    cat: "General",
  },
  {
    q: "How much does a new website cost?",
    a: "Our packages start from R3,900 for one-page sites. Business sites start from R8,900, and custom platforms/apps from R14,900. We'll always give a transparent quote.",
    cat: "Pricing & Payment",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept EFT (bank transfer), credit/debit card, PayPal, and more. Payment schedules are milestone-based.",
    cat: "Pricing & Payment",
  },
  {
    q: "Can you help with digital marketing after the site is live?",
    a: "Yes! We offer ongoing SEO, PPC, content, and social media marketing packages.",
    cat: "Digital Marketing",
  },
  {
    q: "Do you work with clients outside South Africa?",
    a: "Yes, we serve clients globally, including Africa, Europe, and the US. All our processes are remote-friendly.",
    cat: "General",
  },
  {
    q: "What if I need ongoing support or changes?",
    a: "We provide post-launch support and offer affordable retainer packages for ongoing maintenance and improvements.",
    cat: "Support & Maintenance",
  },
  {
    q: "How do I get a quote for my project?",
    a: "Just contact us via our website or book a call. We'll discuss your needs and send a detailed quote.",
    cat: "General",
  },
  {
    q: "Do you provide UI/UX design services?",
    a: "Yes, our designers can create intuitive, beautiful user interfaces and experiences for your website or app.",
    cat: "Design & Branding",
  },
  {
    q: "Can you automate my business processes?",
    a: "Definitely! We build automation solutions and integrations that save you time and reduce manual work.",
    cat: "Automation & Integrations",
  },
  {
    q: "Can you migrate my website to a new platform?",
    a: "Yes, we handle migrations from old sites, WordPress, Wix, etc. to modern, fast, and scalable platforms.",
    cat: "Web Development",
  },
  {
    q: "What is your approach to accessibility?",
    a: "We follow best practices to ensure our websites and apps are usable for everyone, including those with disabilities.",
    cat: "Web Development",
  },
  {
    q: "Do you help with branding and logos?",
    a: "Yes. Our team provides complete branding packages, including logos, brand guides, and design assets.",
    cat: "Design & Branding",
  },
  {
    q: "How do you handle SEO?",
    a: "We include technical SEO in all projects and offer ongoing SEO campaigns to improve your rankings and reach.",
    cat: "Digital Marketing",
  },
  {
    q: "Will I be able to edit my own website?",
    a: "Yes, if you need a CMS or admin dashboard, we'll build you an easy-to-use solution to update your site anytime.",
    cat: "Web Development",
  },
  {
    q: "What if I need a quick change after launch?",
    a: "We're always here for you. Most small changes are completed within 1 business day.",
    cat: "Support & Maintenance",
  },
  {
    q: "Do you offer white-label services for other agencies?",
    a: "Yes, we offer white-label development and support for agencies and freelancers who want to scale their offerings.",
    cat: "Business & Ownership",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. We respect your privacy and are happy to sign a non-disclosure agreement if required.",
    cat: "Business & Ownership",
  },
  {
    q: "Can you build multi-language websites?",
    a: "Yes, we offer multi-language and localization features for websites and apps.",
    cat: "Web Development",
  },
  {
    q: "How do you communicate during a project?",
    a: "We use email, WhatsApp, Zoom, Slack, and phone—whatever works best for you! You'll have a dedicated contact.",
    cat: "General",
  },
  {
    q: "Can you help with Google Ads and Analytics?",
    a: "Yes, we manage Google Ads, Analytics, Facebook Pixel, and more as part of our digital marketing services.",
    cat: "Digital Marketing",
  },
  {
    q: "Do you offer domain registration?",
    a: "Yes, we can register and manage domains for you or assist with transferring your existing domain.",
    cat: "Support & Maintenance",
  },
  {
    q: "How do I send you my requirements?",
    a: "You can send a document, a list, or just have a call with us. We’ll help you organize everything you need.",
    cat: "General",
  },
  {
    q: "Can you integrate payment gateways (PayFast, PayPal, Stripe, etc.)?",
    a: "Yes! We integrate all major payment solutions securely and efficiently.",
    cat: "E-commerce",
  },
  {
    q: "How do you ensure project quality?",
    a: "We follow best practices, run tests at every stage, and always get your approval before going live.",
    cat: "General",
  },
  {
    q: "Do you offer training for our team?",
    a: "Yes, we can provide training sessions or guides so your team can manage the new site or app confidently.",
    cat: "Support & Maintenance",
  },
  {
    q: "What is the first step to start a project?",
    a: "Just reach out via our contact form or WhatsApp. We'll set up a call or send you a quick questionnaire.",
    cat: "General",
  },
  {
    q: "How do you handle deadlines?",
    a: "We set clear milestones and deliverables. If anything changes, you’ll know right away.",
    cat: "General",
  },
  {
    q: "Can you fix my hacked or broken website?",
    a: "Yes, we offer website rescue and security cleanup services for hacked or malfunctioning sites.",
    cat: "Support & Maintenance",
  },
  {
    q: "What happens if I want to cancel my project?",
    a: "You can cancel before development starts for a full refund. Once started, we’ll only charge for work completed.",
    cat: "Pricing & Payment",
  },
  {
    q: "Can you help with content writing?",
    a: "Yes, our content team can create SEO-optimized website copy, blogs, product descriptions, and more.",
    cat: "Digital Marketing",
  },
  {
    q: "Can I see examples of your previous work?",
    a: "Absolutely! View our portfolio on the Projects page or ask for relevant case studies.",
    cat: "General",
  },
  {
    q: "Are your solutions scalable for future growth?",
    a: "Yes, we build with modern, scalable tech so your business can grow without limits.",
    cat: "Web Development",
  },
  {
    q: "What industries have you worked with?",
    a: "We’ve worked with retail, finance, agriculture, education, hospitality, health, and more.",
    cat: "General",
  },
  {
    q: "What if I need urgent support?",
    a: "We offer priority support and quick turnaround for urgent requests. Just WhatsApp us directly.",
    cat: "Support & Maintenance",
  },
  {
    q: "Can you optimize my site for speed?",
    a: "Yes, we specialize in speed and performance optimization for better user experience and SEO.",
    cat: "Web Development",
  },
  {
    q: "Do you offer API or 3rd-party integrations?",
    a: "Yes, we integrate with ERPs, CRMs, payment systems, booking platforms, and other APIs.",
    cat: "Automation & Integrations",
  },
  {
    q: "Can you help migrate my email accounts?",
    a: "Absolutely. We provide email migration and setup with Google Workspace, Microsoft 365, and others.",
    cat: "Support & Maintenance",
  },
  {
    q: "Is Maindo Digital black-owned?",
    a: "Yes, Maindo Digital is a proudly black-owned and African-led digital agency.",
    cat: "Business & Ownership",
  },
];

const FAQS_PER_PAGE = 10;

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("All");

  // --- Filtered and searched FAQs ---
  const filteredFaqs = useMemo(() => {
    let items = faqs;
    if (cat && cat !== "All") {
      items = items.filter((f) => f.cat === cat);
    }
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      items = items.filter(
        (f) =>
          f.q.toLowerCase().includes(term) ||
          (typeof f.a === "string"
            ? f.a.toLowerCase().includes(term)
            : false)
      );
    }
    return items;
  }, [search, cat]);

  const totalPages = Math.ceil(filteredFaqs.length / FAQS_PER_PAGE);
  const startIdx = (page - 1) * FAQS_PER_PAGE;
  const currentFaqs = filteredFaqs.slice(startIdx, startIdx + FAQS_PER_PAGE);

  function handleCategory(newCat: string) {
    setCat(newCat);
    setPage(1);
    setOpen(null);
  }
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
    setOpen(null);
  }

  return (
    <main className="min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 py-14 px-2">
      <section className="max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-center text-lg text-gray-600 mb-8">
          Have more questions?{" "}
          <a
            href="/contact"
            className="text-blue-500 font-bold underline hover:text-blue-700"
          >
            Contact us
          </a>{" "}
          any time.
        </p>

        {/* Search & Category Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 text-base"
            placeholder="Search FAQs..."
            value={search}
            onChange={handleSearch}
          />
          <select
            className="px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 text-base"
            value={cat}
            onChange={(e) => handleCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option value={c} key={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-3">
          {currentFaqs.length === 0 && (
            <div className="text-center text-gray-400 p-8">No FAQs found.</div>
          )}
          {currentFaqs.map((faq, i) => {
            const faqIdx = startIdx + i;
            return (
              <div
                key={faqIdx}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100"
              >
                <button
                  onClick={() => setOpen(open === faqIdx ? null : faqIdx)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left text-blue-900 font-semibold text-lg focus:outline-none"
                  aria-expanded={open === faqIdx}
                  aria-controls={`faq-panel-${faqIdx}`}
                >
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: open === faqIdx ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-blue-400 ml-2"
                  >
                    ▶
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === faqIdx && (
                    <motion.div
                      key="content"
                      id={`faq-panel-${faqIdx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="px-6 pb-5 text-gray-600 text-base overflow-hidden"
                    >
                      {/* Support both string (plain) and string as HTML */}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: faq.a,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <button
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                setOpen(null);
              }}
              className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 disabled:opacity-50"
              disabled={page === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPage(idx + 1);
                  setOpen(null);
                }}
                className={`px-3 py-1 rounded ${
                  page === idx + 1
                    ? "bg-blue-600 text-white font-bold shadow"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-200"
                } transition`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                setOpen(null);
              }}
              className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 disabled:opacity-50"
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>
      {/* Trust Badges */}
      <section className="flex flex-wrap justify-center items-center gap-8 py-7 mt-4 max-w-3xl mx-auto border-t border-blue-100">
        {badges.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.img}
              alt={b.alt}
              width={50}
              height={50}
              className="rounded bg-white p-2 shadow-md"
              style={{ minWidth: 50, minHeight: 50, objectFit: "contain" }}
            />
            <span className="text-xs text-blue-900 font-semibold">
              {b.label}
            </span>
          </div>
        ))}
      </section>
      <div className="text-center text-gray-400 mt-10 text-xs">
        Didn’t find your answer?{" "}
        <a
          href="/contact"
          className="text-blue-500 font-bold underline hover:text-blue-700"
        >
          Get in touch &rarr;
        </a>
      </div>
    </main>
  );
}