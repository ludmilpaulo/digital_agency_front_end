import Link from "next/link";

export default function PrivacyContent() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-6 tracking-tight">
        Privacy Policy
      </h1>
      <p className="text-lg text-gray-700 mb-8">Last updated: 9 July 2025</p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">1. Introduction</h2>
        <p>
          Maindo Digital Agency (“we”, “us”, or “our”) is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you visit our website or use our services.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">2. What Information We Collect</h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Personal Information:</strong> Name, email address, phone number,
            company, etc.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our site and services.
          </li>
          <li>
            <strong>Cookies &amp; Tracking:</strong> We use cookies and similar technologies
            to enhance your experience.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">3. How We Use Your Information</h2>
        <ul className="list-disc pl-6">
          <li>To provide, operate, and maintain our services.</li>
          <li>To respond to your enquiries and requests.</li>
          <li>
            To send you updates, newsletters, or marketing communications (you can
            unsubscribe at any time).
          </li>
          <li>To improve our website and services.</li>
          <li>To comply with legal requirements.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">4. How We Share Information</h2>
        <ul className="list-disc pl-6">
          <li>
            We do <span className="font-semibold text-green-700">not</span> sell or rent your
            personal information to third parties.
          </li>
          <li>
            We may share data with trusted service providers who assist us in operating our
            business.
          </li>
          <li>
            We may disclose your information if required by law or to protect our rights.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">5. Data Security</h2>
        <p>
          We use industry-standard measures to protect your information. However, no electronic
          transmission or storage is 100% secure.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">6. Your Rights &amp; Choices</h2>
        <ul className="list-disc pl-6">
          <li>Access, update, or delete your information.</li>
          <li>Opt out of marketing communications at any time.</li>
          <li>
            Contact us to exercise your rights:{" "}
            <a href="mailto:support@maindodigital.com" className="text-blue-600 underline">
              support@maindodigital.com
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">7. Changes to This Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. Changes will be posted on this page.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:support@maindodigital.com" className="text-blue-600 underline">
            support@maindodigital.com
          </a>
          .
        </p>
      </section>

      <div className="mt-12">
        <Link
          href="/"
          className="text-blue-600 font-bold underline hover:text-blue-800 transition"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
