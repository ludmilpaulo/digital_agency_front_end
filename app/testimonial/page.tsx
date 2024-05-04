"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  designation: string;
  testimonial: string;
  image: File | null;
}

const AddTestimonial: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    designation: "",
    testimonial: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (
      name === "image" &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("designation", formData.designation);
    formDataToSend.append("testimonial", formData.testimonial);
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      await axios.post(
        "http://localhost:8000/api/testimonials/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      router.push("/testimonials"); // Redirect to testimonials page or a confirmation page
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add Your Testimonial
        </h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="designation"
            className="block text-sm font-medium text-gray-700"
          >
            Designation
          </label>
          <input
            type="text"
            name="designation"
            id="designation"
            value={formData.designation}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="testimonial"
            className="block text-sm font-medium text-gray-700"
          >
            Testimonial
          </label>
          <textarea
            name="testimonial"
            id="testimonial"
            value={formData.testimonial}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
            rows={4}
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Testimonial"}
        </button>
      </form>
    </div>
  );
};

export default AddTestimonial;
