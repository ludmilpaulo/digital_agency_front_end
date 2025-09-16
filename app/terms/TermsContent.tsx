import Link from "next/link";

export default function TermsContent() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-6 tracking-tight">
        Terms of Service
      </h1>
      <p className="text-lg text-gray-700 mb-8">Last updated: 9 July 2025</p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using the Maindo Digital Agency website or services, you agree to these
          Terms of Service.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">2. Services</h2>
        <p>
          Maindo Digital Agency provides digital solutions, including web development, digital
          marketing, and related services.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">
          3. User Responsibilities
        </h2>
        <ul className="list-disc pl-6">
          <li>You agree to use our services in compliance with all applicable laws.</li>
          <li>You must not misuse, copy, or redistribute our content without permission.</li>
          <li>Any information you provide must be accurate and up to date.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">
          4. Intellectual Property
        </h2>
        <p>
          All content, logos, and materials on this site are the property of Maindo Digital Agency
          or its partners and are protected by intellectual property laws. You may not use them
          without written consent.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">
          5. Limitation of Liability
        </h2>
        <p>
          Maindo Digital Agency is not liable for any indirect or consequential damages arising from
          your use of our site or services.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">6. Termination</h2>
        <p>
          We reserve the right to suspend or terminate access to our services for violation of these
          terms.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">7. Governing Law</h2>
        <p>
          These terms are governed by the laws of South Africa. Any disputes will be resolved in the
          courts of South Africa.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">
          8. Changes to Terms
        </h2>
        <p>
          We may modify these Terms of Service at any time. Updates will be posted on this page.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, contact us at{" "}
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
