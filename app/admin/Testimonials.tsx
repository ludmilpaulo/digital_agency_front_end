"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaStar, FaQuoteLeft } from "react-icons/fa";
import { baseAPI } from "@/useAPI/api";
import toast from "react-hot-toast";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
  featured: boolean;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    company: "",
    content: "",
    rating: 5,
    featured: false,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseAPI}/testimonials/testimonials/`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Error loading testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTestimonial(null);
    setFormData({
      name: "",
      position: "",
      company: "",
      content: "",
      rating: 5,
      featured: false,
    });
    setShowModal(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      featured: testimonial.featured,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete testimonial from "${name}"?`)) return;

    try {
      const response = await fetch(`${baseAPI}/testimonials/testimonials/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Testimonial deleted successfully");
        fetchTestimonials();
      } else {
        toast.error("Failed to delete testimonial");
      }
    } catch (error) {
      toast.error("Error deleting testimonial");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingTestimonial
        ? `${baseAPI}/testimonials/testimonials/${editingTestimonial.id}/`
        : `${baseAPI}/testimonials/testimonials/`;

      const method = editingTestimonial ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          editingTestimonial
            ? "Testimonial updated successfully"
            : "Testimonial created successfully"
        );
        setShowModal(false);
        fetchTestimonials();
      } else {
        const data = await response.json();
        toast.error(data.detail || "Failed to save testimonial");
      }
    } catch (error) {
      toast.error("Error saving testimonial");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Testimonials Management</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaPlus /> New Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start gap-4 mb-4">
              {testimonial.image ? (
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {testimonial.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.position}</p>
                <p className="text-sm text-gray-500">{testimonial.company}</p>
              </div>

              {testimonial.featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  Featured
                </span>
              )}
            </div>

            <div className="mb-3 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>

            <div className="relative bg-gray-50 rounded-lg p-4 mb-4">
              <FaQuoteLeft className="absolute top-2 left-2 text-blue-200 text-2xl" />
              <p className="text-gray-700 pl-6 italic">{testimonial.content}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(testimonial)}
                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(testimonial.id, testimonial.name)}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaQuoteLeft className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-lg text-gray-500 mb-4">No testimonials yet</p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Testimonial
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingTestimonial ? "Edit Testimonial" : "Create New Testimonial"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Position *</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Rating *</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Testimonial Content *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="What did the client say about your work?"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium">Featured Testimonial</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingTestimonial ? "Update Testimonial" : "Create Testimonial"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
