"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { baseAPI } from "@/useAPI/api";

interface FormData {
  name: string;
  designation: string;
  testimonial: string;
  image: File | null;
}

const TestimonialClient: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    designation: "",
    testimonial: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target as HTMLInputElement;
    if (name === "image" && (e.target as HTMLInputElement).files) {
      setFormData((prev) => ({ ...prev, image: (e.target as HTMLInputElement).files![0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const body = new FormData();
    body.append("name", formData.name);
    body.append("designation", formData.designation);
    body.append("testimonial", formData.testimonial);
    if (formData.image) body.append("image", formData.image);

    try {
      const res = await fetch(`${baseAPI}/testimonials/`, {
        method: "POST",
        body,
      });

      if (!res.ok) throw new Error("Failed to submit testimonial");

      // Success → go to your list/thank-you page
      router.push("/testimonials");
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      alert("Could not submit testimonial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="max-w-lg mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add Your Testimonial</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
          <input
            id="designation"
            name="designation"
            type="text"
            required
            value={formData.designation}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700">Testimonial</label>
          <textarea
            id="testimonial"
            name="testimonial"
            rows={4}
            required
            value={formData.testimonial}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Testimonial"}
        </button>
      </form>
    </div>
  );
};

export default TestimonialClient;
