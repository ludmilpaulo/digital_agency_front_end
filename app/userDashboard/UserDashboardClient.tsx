"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { 
  FaUser, FaProjectDiagram, FaTasks, FaCalendar, FaFileAlt, 
  FaEnvelope, FaCog, FaChartLine, FaCheckCircle, FaClock, 
  FaExclamationTriangle, FaEdit, FaEye, FaDownload 
} from "react-icons/fa";
import { baseAPI } from "@/useAPI/api";
import { trackEvent } from "@/lib/analytics/mixpanel";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  status: string;
  progress: number;
  startDate: string;
  deadline: string;
  description: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedTo: string;
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  status: string;
  notes: string;
}

interface Proposal {
  id: number;
  service: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserDashboardClient() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    avatar: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/LoginScreenUser");
      return;
    }

    fetchDashboardData();
    trackEvent("User Dashboard Viewed", { userId: user.user_id || user.id });
  }, [user, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch user profile
      setProfile({
        name: user?.username || user?.first_name || "User",
        email: user?.email || "",
        phone: (user as any)?.phone || "",
        company: (user as any)?.company || "",
        avatar: user?.avatar || "",
      });

      // TODO: Fetch real data from backend
      // For now, using mock data
      setProjects([
        {
          id: 1,
          title: "Website Redesign",
          status: "In Progress",
          progress: 65,
          startDate: "2025-09-15",
          deadline: "2025-11-30",
          description: "Modern responsive website with Next.js",
        },
        {
          id: 2,
          title: "Mobile App Development",
          status: "Planning",
          progress: 25,
          startDate: "2025-10-01",
          deadline: "2026-01-15",
          description: "Native iOS and Android app",
        },
      ]);

      setTasks([
        { id: 1, title: "Review design mockups", status: "Completed", priority: "High", dueDate: "2025-10-10", assignedTo: "Design Team" },
        { id: 2, title: "Approve homepage content", status: "In Progress", priority: "High", dueDate: "2025-10-18", assignedTo: "You" },
        { id: 3, title: "Provide brand assets", status: "Pending", priority: "Medium", dueDate: "2025-10-20", assignedTo: "You" },
      ]);

      setAppointments([
        { id: 1, date: "2025-10-20", time: "10:00 AM", service: "Project Review Meeting", status: "Scheduled", notes: "Discuss progress and next steps" },
        { id: 2, date: "2025-10-25", time: "2:00 PM", service: "Design Consultation", status: "Scheduled", notes: "Review UI/UX designs" },
      ]);

      setProposals([
        { id: 1, service: "Web Development - Professional", status: "Approved", createdAt: "2025-09-10", updatedAt: "2025-09-12" },
        { id: 2, service: "Mobile App Development", status: "Under Review", createdAt: "2025-10-01", updatedAt: "2025-10-01" },
      ]);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "approved":
        return "text-green-600 bg-green-100";
      case "in progress":
      case "scheduled":
        return "text-blue-600 bg-blue-100";
      case "pending":
      case "under review":
        return "text-yellow-600 bg-yellow-100";
      case "planning":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile.name}!</h1>
                <p className="text-sm text-gray-600">{profile.email}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("profile")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FaCog /> Settings
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active Projects</p>
                  <p className="text-3xl font-bold">{projects.length}</p>
                </div>
                <FaProjectDiagram className="text-4xl opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Pending Tasks</p>
                  <p className="text-3xl font-bold">{tasks.filter(t => t.status !== "Completed").length}</p>
                </div>
                <FaTasks className="text-4xl opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Appointments</p>
                  <p className="text-3xl font-bold">{appointments.length}</p>
                </div>
                <FaCalendar className="text-4xl opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Proposals</p>
                  <p className="text-3xl font-bold">{proposals.length}</p>
                </div>
                <FaFileAlt className="text-4xl opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: <FaChartLine /> },
            { id: "projects", label: "My Projects", icon: <FaProjectDiagram /> },
            { id: "tasks", label: "My Tasks", icon: <FaTasks /> },
            { id: "appointments", label: "Appointments", icon: <FaCalendar /> },
            { id: "proposals", label: "Proposals", icon: <FaFileAlt /> },
            { id: "profile", label: "Profile", icon: <FaUser /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                trackEvent("Dashboard Tab Changed", { tab: tab.id });
              }}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              
              {/* Recent Projects */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaProjectDiagram className="text-blue-600" />
                  Recent Projects
                </h3>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="border-l-4 border-blue-600 pl-4 py-2 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          <div className="mt-2">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                              <span>Progress: {project.progress}%</span>
                              <span>•</span>
                              <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab("projects")}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View all projects →
                </button>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaCalendar className="text-purple-600" />
                  Upcoming Appointments
                </h3>
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <FaCalendar className="text-purple-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{apt.service}</h4>
                        <p className="text-sm text-gray-600">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                        <p className="text-xs text-gray-500 mt-1">{apt.notes}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Request New Project
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Start Date</p>
                          <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Deadline</p>
                          <p className="font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2">
                        <FaEye /> View Details
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                        <FaEnvelope />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Tasks</h2>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500">{task.assignedTo}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800">
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
                <button 
                  onClick={() => router.push("/appointment")}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Book New Appointment
                </button>
              </div>
              
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-4 rounded-lg">
                          <FaCalendar className="text-purple-600 text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{apt.service}</h3>
                          <p className="text-gray-600">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{apt.notes}</p>
                    
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                        Reschedule
                      </button>
                      <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposals Tab */}
          {activeTab === "proposals" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Proposals</h2>
                <button 
                  onClick={() => router.push("/proposal")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  New Proposal Request
                </button>
              </div>
              
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{proposal.service}</h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>Submitted: {new Date(proposal.createdAt).toLocaleDateString()}</p>
                          <p>Last Updated: {new Date(proposal.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.status}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2">
                        <FaEye /> View Details
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                        <FaDownload /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
              
              <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                <div className="mb-6 text-center">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      width={120}
                      height={120}
                      className="rounded-full mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                    Change Photo
                  </button>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        trackEvent("Profile Updated", { userId: user?.user_id || user?.id });
                        alert("Profile updated successfully!");
                      }}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      Change Password
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      Notification Preferences
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
