"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaUsers, FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";
import { baseAPI } from "@/useAPI/api";
import toast from "react-hot-toast";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  email?: string;
  phone?: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  order: number;
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    email: "",
    phone: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    order: 0,
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseAPI}/info/teams/`);
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (error) {
      console.error("Error loading team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      position: "",
      bio: "",
      email: "",
      phone: "",
      linkedin: "",
      twitter: "",
      facebook: "",
      order: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio,
      email: member.email || "",
      phone: member.phone || "",
      linkedin: member.linkedin || "",
      twitter: member.twitter || "",
      facebook: member.facebook || "",
      order: member.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the team?`)) return;

    try {
      const response = await fetch(`${baseAPI}/info/teams/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Team member removed successfully");
        fetchTeamMembers();
      } else {
        toast.error("Failed to remove team member");
      }
    } catch (error) {
      toast.error("Error removing team member");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingMember
        ? `${baseAPI}/info/teams/${editingMember.id}/`
        : `${baseAPI}/info/teams/`;

      const method = editingMember ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          editingMember
            ? "Team member updated successfully"
            : "Team member added successfully"
        );
        setShowModal(false);
        fetchTeamMembers();
      } else {
        const data = await response.json();
        toast.error(data.detail || "Failed to save team member");
      }
    } catch (error) {
      toast.error("Error saving team member");
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
        <h1 className="text-3xl font-bold text-gray-800">Team Management</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaPlus /> Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex flex-col items-center mb-4">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={100}
                    height={100}
                    className="rounded-full mb-3"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-gray-900 text-center">{member.name}</h3>
                <p className="text-blue-600 font-medium text-center">{member.position}</p>
              </div>

              <p className="text-gray-600 text-sm text-center mb-4 line-clamp-3">{member.bio}</p>

              {(member.linkedin || member.twitter || member.facebook) && (
                <div className="flex justify-center gap-3 mb-4">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                      <FaLinkedin size={20} />
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                      <FaTwitter size={20} />
                    </a>
                  )}
                  {member.facebook && (
                    <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <FaFacebook size={20} />
                    </a>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.name)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaUsers className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-lg text-gray-500 mb-4">No team members yet</p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Team Member
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
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
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief bio..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Twitter URL</label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://twitter.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://facebook.com/..."
                  />
                </div>
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
                  {editingMember ? "Update Team Member" : "Add Team Member"}
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
