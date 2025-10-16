"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaImage } from "react-icons/fa";
import { baseAPI } from "@/useAPI/api";
import toast from "react-hot-toast";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  image?: string;
  client_name?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  featured: boolean;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    client_name: "",
    status: "Active",
    featured: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseAPI}/project/projects/`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      client_name: "",
      status: "Active",
      featured: false,
    });
    setShowModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      client_name: project.client_name || "",
      status: project.status,
      featured: project.featured,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete project "${title}"?`)) return;

    try {
      const response = await fetch(`${baseAPI}/project/projects/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Project deleted successfully");
        fetchProjects();
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      toast.error("Error deleting project");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProject
        ? `${baseAPI}/project/projects/${editingProject.id}/`
        : `${baseAPI}/project/projects/`;

      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          editingProject ? "Project updated successfully" : "Project created successfully"
        );
        setShowModal(false);
        fetchProjects();
      } else {
        const data = await response.json();
        toast.error(data.detail || "Failed to save project");
      }
    } catch (error) {
      toast.error("Error saving project");
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
        <h1 className="text-3xl font-bold text-gray-800">Projects Management</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaPlus /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            {project.image && (
              <div className="relative w-full h-48">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
              {project.client_name && (
                <p className="text-sm text-gray-600 mb-2">Client: {project.client_name}</p>
              )}
              <p className="text-gray-700 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="flex gap-2 items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === "Active" ? "bg-green-100 text-green-700" :
                  project.status === "Completed" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {project.status}
                </span>
                {project.featured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.open(`/projectDetails?id=${project.id}`, '_blank')}
                  className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  <FaEye /> View
                </button>
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaImage className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-lg text-gray-500 mb-4">No projects yet</p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Project
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProject ? "Edit Project" : "Create New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Title *</label>
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
                <label className="block text-sm font-medium mb-1">Client Name</label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Featured Project</label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingProject ? "Update Project" : "Create Project"}
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
