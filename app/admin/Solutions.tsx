"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaLightbulb } from "react-icons/fa";
import { baseAPI } from "@/useAPI/api";
import toast from "react-hot-toast";
import Image from "next/image";

interface Solution {
  id: number;
  title: string;
  slug: string;
  description: string;
  image?: string;
  features: string[];
  order: number;
}

export default function Solutions() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    features: "",
    order: 0,
  });

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseAPI}/solutions/solutions/`);
      if (response.ok) {
        const data = await response.json();
        setSolutions(data);
      }
    } catch (error) {
      console.error("Error loading solutions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSolution(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      features: "",
      order: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (solution: Solution) => {
    setEditingSolution(solution);
    setFormData({
      title: solution.title,
      slug: solution.slug,
      description: solution.description,
      features: solution.features?.join('\n') || "",
      order: solution.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete solution "${title}"?`)) return;

    try {
      const response = await fetch(`${baseAPI}/solutions/solutions/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Solution deleted successfully");
        fetchSolutions();
      } else {
        toast.error("Failed to delete solution");
      }
    } catch (error) {
      toast.error("Error deleting solution");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSolution
        ? `${baseAPI}/solutions/solutions/${editingSolution.id}/`
        : `${baseAPI}/solutions/solutions/`;

      const method = editingSolution ? "PUT" : "POST";

      const payload = {
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim()),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          editingSolution ? "Solution updated successfully" : "Solution created successfully"
        );
        setShowModal(false);
        fetchSolutions();
      } else {
        const data = await response.json();
        toast.error(data.detail || "Failed to save solution");
      }
    } catch (error) {
      toast.error("Error saving solution");
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
        <h1 className="text-3xl font-bold text-gray-800">Solutions Management</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaPlus /> New Solution
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {solutions.map((solution) => (
          <div key={solution.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            {solution.image && (
              <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={solution.image}
                  alt={solution.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{solution.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
            
            {solution.features && solution.features.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                <ul className="space-y-1">
                  {solution.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                  {solution.features.length > 3 && (
                    <li className="text-sm text-gray-500">+{solution.features.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(solution)}
                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(solution.id, solution.title)}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {solutions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaLightbulb className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-lg text-gray-500 mb-4">No solutions yet</p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Solution
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingSolution ? "Edit Solution" : "Create New Solution"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Features (one per line)</label>
                <textarea
                  rows={5}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingSolution ? "Update Solution" : "Create Solution"}
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
