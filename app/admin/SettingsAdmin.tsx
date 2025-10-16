"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { 
  FaUser, FaLock, FaBell, FaShieldAlt, FaGlobe, FaPalette, 
  FaEnvelope, FaKey, FaSave, FaCamera 
} from "react-icons/fa";
import toast from "react-hot-toast";
import { baseAPI } from "@/useAPI/api";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics/mixpanel";

export default function SettingsAdmin() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeSection, setActiveSection] = useState("profile");
  
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: "",
    bio: "",
    avatar: user?.avatar || "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    task_reminders: true,
    project_updates: true,
    weekly_summary: false,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    language: "en",
    timezone: "UTC",
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement actual API call
      toast.success("Profile updated successfully!");
      trackEvent("Profile Updated", { userId: user?.user_id || user?.id });
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      // TODO: Implement actual API call
      toast.success("Password changed successfully!");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      trackEvent("Password Changed", { userId: user?.user_id || user?.id });
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      // TODO: Implement actual API call
      toast.success("Notification preferences updated!");
      trackEvent("Notifications Updated", { userId: user?.user_id || user?.id });
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  const handleAppearanceUpdate = async () => {
    try {
      // TODO: Implement actual API call
      toast.success("Appearance settings updated!");
      trackEvent("Appearance Updated", { userId: user?.user_id || user?.id });
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const sections = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "password", label: "Password", icon: <FaLock /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "appearance", label: "Appearance", icon: <FaPalette /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                activeSection === section.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

              <div className="mb-6 flex flex-col items-center md:items-start">
                {profileData.avatar ? (
                  <Image
                    src={profileData.avatar}
                    alt={profileData.username}
                    width={120}
                    height={120}
                    className="rounded-full mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                    {profileData.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2">
                  <FaCamera /> Change Photo
                </button>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                >
                  <FaSave /> Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Password Section */}
          {activeSection === "password" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Change Password</h2>

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                >
                  <FaKey /> Change Password
                </button>
              </form>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { key: "email_notifications", label: "Email Notifications", desc: "Receive updates via email" },
                  { key: "push_notifications", label: "Push Notifications", desc: "Browser push notifications" },
                  { key: "task_reminders", label: "Task Reminders", desc: "Reminders for upcoming tasks" },
                  { key: "project_updates", label: "Project Updates", desc: "Updates on your projects" },
                  { key: "weekly_summary", label: "Weekly Summary", desc: "Weekly activity summary" },
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{setting.label}</h3>
                      <p className="text-sm text-gray-600">{setting.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [setting.key]: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}

                <button
                  onClick={handleNotificationUpdate}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                >
                  <FaSave /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Appearance Section */}
          {activeSection === "appearance" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Appearance & Language</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: "light" })}
                      className={`p-4 border-2 rounded-lg transition ${
                        appearanceSettings.theme === "light"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-full h-20 bg-white border rounded mb-2"></div>
                      <p className="font-medium">Light</p>
                    </button>
                    <button
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: "dark" })}
                      className={`p-4 border-2 rounded-lg transition ${
                        appearanceSettings.theme === "dark"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-full h-20 bg-gray-800 border rounded mb-2"></div>
                      <p className="font-medium">Dark</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    value={appearanceSettings.language}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, language: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select
                    value={appearanceSettings.timezone}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, timezone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="Africa/Johannesburg">South Africa (SAST)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="America/New_York">New York (EST)</option>
                    <option value="America/Los_Angeles">Los Angeles (PST)</option>
                  </select>
                </div>

                <button
                  onClick={handleAppearanceUpdate}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                >
                  <FaSave /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                  <h3 className="font-bold text-blue-900 mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Enable 2FA
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Active Sessions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-gray-600">Windows • Chrome • Active now</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Login Activity</h3>
                  <p className="text-sm text-gray-600 mb-3">Recent login attempts</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">Successful login from Johannesburg, South Africa</p>
                      <p className="text-xs text-gray-500">Today at 10:30 AM</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
                  <h3 className="font-bold text-red-900 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-800 mb-4">
                    Permanently delete your account and all associated data
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
