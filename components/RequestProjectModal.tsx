"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaProjectDiagram, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { baseAPI } from "@/useAPI/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  name: string;
  slug: string;
}

interface RequestProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onSuccess?: () => void;
}

export default function RequestProjectModal({
  isOpen,
  onClose,
  userId,
  onSuccess
}: RequestProjectModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [showAppointmentRedirect, setShowAppointmentRedirect] = useState(false);
  
  const [formData, setFormData] = useState({
    project_name: "",
    service: "",
    description: "",
    budget: "",
    deadline: "",
    priority: "Medium"
  });

  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${baseAPI}/services/services/`);
      if (res.ok) {
        const data = await res.json();
        setServices(data || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, service: value });
    
    // If "Other" is selected, show appointment redirect option
    if (value === "Other") {
      setShowAppointmentRedirect(true);
    } else {
      setShowAppointmentRedirect(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.project_name.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    
    if (!formData.service) {
      toast.error("Please select a service");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Please describe your project");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${baseAPI}/project-management/project-requests/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : null
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("✅ Project request submitted! We'll review it shortly.");
        
        // Reset form
        setFormData({
          project_name: "",
          service: "",
          description: "",
          budget: "",
          deadline: "",
          priority: "Medium"
        });
        
        onClose();
        
        if (onSuccess) {
          onSuccess();
        }
        
        // Optionally refresh the page to show the new project
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to submit project request");
      }
    } catch (error) {
      console.error("Error submitting project request:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    onClose();
    router.push("/appointment");
    toast.info("Redirecting to appointment booking...");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaProjectDiagram className="text-white text-3xl" />
              <h2 className="text-2xl font-bold text-white">Request New Project</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <FaTimes size={24} />
            </button>
          </div>
          <p className="text-blue-100 mt-2">
            Tell us about your project and we'll get started!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              placeholder="e.g., E-commerce Website for Online Store"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Type *
            </label>
            <select
              value={formData.service}
              onChange={handleServiceChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">-- Select a Service --</option>
              {services.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name}
                </option>
              ))}
              <option value="Other">Other (Book Appointment)</option>
            </select>
          </div>

          {/* Show appointment option if "Other" selected */}
          {showAppointmentRedirect && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium mb-3">
                💡 Can't find the service you need?
              </p>
              <p className="text-sm text-blue-700 mb-3">
                Book an appointment with our team to discuss your custom requirements.
              </p>
              <button
                type="button"
                onClick={handleBookAppointment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaCalendarAlt />
                Book Appointment
              </button>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project requirements, goals, and any specific features you need..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Be as detailed as possible to help us understand your needs
            </p>
          </div>

          {/* Budget & Deadline Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget (Optional)
              </label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="e.g., 5000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">ZAR (South African Rand)</p>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Desired Deadline (Optional)
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || showAppointmentRedirect}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Project Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

