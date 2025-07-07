"use client";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function RequestProposalForm({ service }: { service?: string }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: service || "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", email: "", phone: "", company: "", service: service || "", message: "" });
        toast.success("Your request was submitted! We'll contact you soon.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white/80 rounded-2xl shadow-xl p-8 mt-8 flex flex-col gap-5"
    >
      <Toaster />
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Request a Proposal</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          required
          name="name"
          placeholder="Your Name"
          className="input"
          value={form.name}
          onChange={handleChange}
        />
        <input
          required
          name="email"
          type="email"
          placeholder="Your Email"
          className="input"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone (optional)"
          className="input"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="company"
          placeholder="Company (optional)"
          className="input"
          value={form.company}
          onChange={handleChange}
        />
      </div>
      <input
        name="service"
        placeholder="Service Interested In"
        className="input"
        value={form.service}
        onChange={handleChange}
      />
      <textarea
        required
        name="message"
        placeholder="What do you need? Tell us a bit about your project…"
        rows={4}
        className="input"
        value={form.message}
        onChange={handleChange}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-8 rounded-full bg-blue-700 text-white font-bold text-lg shadow-lg transition-all hover:bg-blue-900 flex items-center justify-center"
      >
        {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
        {loading ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}

// Add this Tailwind to your globals.css or module.css:
/*
.input {
  @apply p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition;
}
*/
