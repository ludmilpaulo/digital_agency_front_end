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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-3 md:gap-4">
              {profile.avatar ? (
                <div className="relative flex-shrink-0">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    width={64}
                    height={64}
                    className="md:w-20 md:h-20 rounded-full border-4 border-white shadow-xl"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
              ) : (
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl md:text-3xl font-bold shadow-xl border-4 border-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
              )}
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">Welcome back, {profile.name}!</h1>
                <p className="text-xs md:text-sm text-blue-100 flex items-center gap-2 mt-1">
                  <FaEnvelope className="text-xs" />
                  {profile.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("profile")}
              className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 border border-white/30 shadow-lg hover:shadow-xl"
            >
              <FaCog /> <span className="hidden sm:inline">Settings</span><span className="sm:hidden">Profile</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all border border-blue-200/50 group">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Active Projects</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{projects.length}</p>
                </div>
                <div className="p-2 md:p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl group-hover:scale-110 transition-transform self-end md:self-auto">
                  <FaProjectDiagram className="text-2xl md:text-3xl text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all border border-green-200/50 group">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Pending Tasks</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{tasks.filter(t => t.status !== "Completed").length}</p>
                </div>
                <div className="p-2 md:p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl group-hover:scale-110 transition-transform self-end md:self-auto">
                  <FaTasks className="text-2xl md:text-3xl text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all border border-purple-200/50 group">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Appointments</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{appointments.length}</p>
                </div>
                <div className="p-2 md:p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl group-hover:scale-110 transition-transform self-end md:self-auto">
                  <FaCalendar className="text-2xl md:text-3xl text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all border border-orange-200/50 group">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Proposals</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{proposals.length}</p>
                </div>
                <div className="p-2 md:p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl group-hover:scale-110 transition-transform self-end md:self-auto">
                  <FaFileAlt className="text-2xl md:text-3xl text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Tabs */}
        <div className="mb-6 md:mb-8 flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "overview", label: "Overview", icon: <FaChartLine />, gradient: "from-blue-500 to-indigo-500" },
            { id: "projects", label: "My Projects", icon: <FaProjectDiagram />, gradient: "from-purple-500 to-pink-500" },
            { id: "tasks", label: "My Tasks", icon: <FaTasks />, gradient: "from-green-500 to-emerald-500" },
            { id: "appointments", label: "Appointments", icon: <FaCalendar />, gradient: "from-orange-500 to-red-500" },
            { id: "proposals", label: "Proposals", icon: <FaFileAlt />, gradient: "from-cyan-500 to-blue-500" },
            { id: "profile", label: "Profile", icon: <FaUser />, gradient: "from-gray-500 to-slate-500" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                trackEvent("Dashboard Tab Changed", { tab: tab.id });
              }}
              className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-md hover:shadow-lg ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.gradient} text-white scale-105 shadow-xl`
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:scale-105"
              }`}
            >
              <span className="text-base md:text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.replace("My ", "")}</span>
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
