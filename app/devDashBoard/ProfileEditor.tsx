'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/slices/authSlice';
import axios from 'axios';
import { baseAPI } from '@/useAPI/api';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaCamera, FaSave, FaLock } from 'react-icons/fa';
import Image from 'next/image';

interface ProfileData {
  user: {
    id: number;
    username: string;
    email: string;
  };
  profile: {
    role: string;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar: string | null;
    bio: string;
    phone: string;
    skills: string[];
    line_manager: {
      id: number;
      username: string;
      email: string;
    } | null;
    department: string;
    job_title: string;
  };
}

export default function ProfileEditor() {
  const user = useSelector(selectUser);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Password change
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = user?.token || localStorage.getItem('token');
      const response = await axios.get(`${baseAPI}/account/profile/me/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;

    try {
      const token = user?.token || localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await axios.post(
        `${baseAPI}/account/profile/upload_avatar/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (profileData) {
        setProfileData({
          ...profileData,
          profile: { ...profileData.profile, avatar: response.data.avatar }
        });
      }
      
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };

  const handleProfileUpdate = async () => {
    if (!profileData) return;

    try {
      setSaving(true);
      const token = user?.token || localStorage.getItem('token');
      
      const response = await axios.put(
        `${baseAPI}/account/profile/update_me/`,
        profileData.profile,
        {
          headers: { Authorization: `Token ${token}` }
        }
      );

      setProfileData({ ...profileData, profile: response.data });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setSaving(true);
      const token = user?.token || localStorage.getItem('token');
      
      await axios.post(
        `${baseAPI}/account/profile/change_password/`,
        {
          old_password: passwordData.old_password,
          new_password: passwordData.new_password
        },
        {
          headers: { Authorization: `Token ${token}` }
        }
      );

      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      setShowPasswordChange(false);
      toast.success('Password changed successfully!');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.detail || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        My Profile
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <div className="relative inline-block">
              {avatarPreview || profileData.profile.avatar ? (
                <Image
                  src={avatarPreview || profileData.profile.avatar || '/default-avatar.png'}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-blue-200 object-cover"
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <FaUser className="text-6xl text-blue-400" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition shadow-lg">
                <FaCamera className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            
            {avatarFile && (
              <button
                onClick={uploadAvatar}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Upload Avatar
              </button>
            )}
            
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              {profileData.profile.full_name}
            </h3>
            <p className="text-sm text-gray-600">@{profileData.user.username}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {profileData.profile.role === 'PM' ? 'Project Manager' : 
               profileData.profile.role === 'Dev' ? 'Developer' : profileData.profile.role}
            </span>
          </div>

          {/* Password Change Section */}
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
            >
              <FaLock /> Change Password
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={profileData.profile.first_name}
                onChange={(e) => setProfileData({
                  ...profileData,
                  profile: { ...profileData.profile, first_name: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={profileData.profile.last_name}
                onChange={(e) => setProfileData({
                  ...profileData,
                  profile: { ...profileData.profile, last_name: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaEnvelope className="inline mr-1" /> Email (Read-only)
              </label>
              <input
                type="email"
                value={profileData.user.email}
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaPhone className="inline mr-1" /> Phone
              </label>
              <input
                type="tel"
                value={profileData.profile.phone}
                onChange={(e) => setProfileData({
                  ...profileData,
                  profile: { ...profileData.profile, phone: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+27 123 456 789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaBriefcase className="inline mr-1" /> Job Title
              </label>
              <input
                type="text"
                value={profileData.profile.job_title}
                onChange={(e) => setProfileData({
                  ...profileData,
                  profile: { ...profileData.profile, job_title: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={profileData.profile.department}
                onChange={(e) => setProfileData({
                  ...profileData,
                  profile: { ...profileData.profile, department: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Engineering"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={profileData.profile.bio}
                onChange={(e) => setProfileData({
                  ...profileData,
                  profile: { ...profileData.profile, bio: e.target.value }
                })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={Array.isArray(profileData.profile.skills) ? profileData.profile.skills.join(', ') : ''}
                onChange={(e) => {
                  const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                  setProfileData({
                    ...profileData,
                    profile: { ...profileData.profile, skills: skillsArray }
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, Node.js, Python, Django"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.isArray(profileData.profile.skills) && profileData.profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {profileData.profile.line_manager && (
              <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Line Manager</p>
                <p className="text-gray-900 font-semibold">{profileData.profile.line_manager.username}</p>
                <p className="text-sm text-gray-600">{profileData.profile.line_manager.email}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleProfileUpdate}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
            >
              <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPasswordChange(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

