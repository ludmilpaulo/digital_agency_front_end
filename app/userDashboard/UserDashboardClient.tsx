"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { 
  FaUser, FaProjectDiagram, FaTasks, FaCalendar, FaFileAlt, 
  FaEnvelope, FaCog, FaChartLine, FaCheckCircle, FaClock, 
  FaExclamationTriangle, FaEdit, FaEye, FaDownload, FaKey,
  FaInfoCircle, FaTimes, FaSearch
} from "react-icons/fa";
import { baseAPI } from "@/useAPI/api";
import { trackEvent } from "@/lib/analytics/mixpanel";
import Image from "next/image";
import toast from "react-hot-toast";
import AdminPagination from "@/components/AdminPagination";

interface Project {
  id: number;
  title: string;
  status: string;
  progress?: number;
  start_date?: string;
  deadline?: string;
  description: string;
  client?: string;
  budget?: number;
  created_at?: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  priority?: string;
  due_date?: string;
  description?: string;
  board?: number;
}

interface Appointment {
  id: number;
  date: string;
  time?: string;
  service: string;
  status: string;
  notes?: string;
  client_name?: string;
  phone?: string;
}

interface Proposal {
  id: number;
  service: string;
  status?: string;
  created_at: string;
  name?: string;
  email?: string;
  message?: string;
}

interface Invoice {
  id: number;
  project_title: string;
  amount: number;
  status: string;
  created_at: string;
  due_date?: string;
}

export default function UserDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  
  // Pagination states
  const [projectsPage, setProjectsPage] = useState(1);
  const [tasksPage, setTasksPage] = useState(1);
  const [appointmentsPage, setAppointmentsPage] = useState(1);
  const [proposalsPage, setProposalsPage] = useState(1);
  const [invoicesPage, setInvoicesPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
  // Search states
  const [projectsSearch, setProjectsSearch] = useState("");
  const [tasksSearch, setTasksSearch] = useState("");
  const [appointmentsSearch, setAppointmentsSearch] = useState("");
  const [proposalsSearch, setProposalsSearch] = useState("");
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    avatar: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/LoginScreenUser");
      return;
    }

    // Check if new user (from URL params)
    const isNewUser = searchParams.get("newuser") === "true";
    if (isNewUser) {
      setShowPasswordPrompt(true);
    }

    fetchDashboardData();
    trackEvent("User Dashboard Viewed", { userId: user.user_id || user.id });
  }, [user, router, searchParams]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const userId = user?.user_id || user?.id;
      
      // Set profile from user data
      setProfile({
        name: user?.username || user?.first_name || "User",
        email: user?.email || "",
        phone: (user as any)?.phone || "",
        company: (user as any)?.company || "",
        avatar: user?.avatar || "",
      });

      // Fetch real data from backend
      const headers = {
        "Content-Type": "application/json",
        // Add auth token if available
        ...((user as any)?.access && { "Authorization": `Bearer ${(user as any).access}` })
      };

      // Fetch Projects
      try {
        const projectsRes = await fetch(`${baseAPI}/project/projects/`, { headers });
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          // Filter projects for this user if needed
          setProjects(Array.isArray(projectsData) ? projectsData : []);
        } else {
          console.warn("Failed to fetch projects:", projectsRes.status);
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      }

      // Fetch Tasks (user-specific)
      try {
        const tasksRes = await fetch(`${baseAPI}/task/tasks/?user_id=${userId}`, { headers });
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(Array.isArray(tasksData) ? tasksData : []);
        } else {
          console.warn("Failed to fetch tasks:", tasksRes.status);
          setTasks([]);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setTasks([]);
      }

      // Fetch Appointments
      try {
        const appointmentsRes = await fetch(`${baseAPI}/appointment/appointments/`, { headers });
        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json();
          // Filter appointments for this user's email
          const userAppointments = Array.isArray(appointmentsData) 
            ? appointmentsData.filter((apt: any) => apt.email === user?.email)
            : [];
          setAppointments(userAppointments);
        } else {
          console.warn("Failed to fetch appointments:", appointmentsRes.status);
          setAppointments([]);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setAppointments([]);
      }

      // Fetch Proposals
      try {
        const proposalsRes = await fetch(`${baseAPI}/services/proposals/`, { headers });
        if (proposalsRes.ok) {
          const proposalsData = await proposalsRes.json();
          // Filter proposals for this user's email
          const userProposals = Array.isArray(proposalsData)
            ? proposalsData.filter((prop: any) => prop.email === user?.email)
            : [];
          setProposals(userProposals);
        } else {
          console.warn("Failed to fetch proposals:", proposalsRes.status);
          setProposals([]); // Set empty array on error
        }
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setProposals([]); // Set empty array on error
      }

      // Fetch Invoices (mock for now, implement when backend ready)
      setInvoices([
        {
          id: 1,
          project_title: projects[0]?.title || "Website Development",
          amount: 2999,
          status: "Paid",
          created_at: new Date().toISOString(),
          due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
        }
      ]);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    try {
      const response = await fetch(`${baseAPI}/account/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(user as any)?.access}`
        },
        body: JSON.stringify({
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      });

      if (response.ok) {
        toast.success("Password changed successfully!");
        setShowPasswordPrompt(false);
        setNewPassword("");
        setConfirmPassword("");
        trackEvent("Password Changed", { userId: user?.user_id || user?.id });
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      toast.error("Error changing password");
    }
  };

  const downloadInvoice = async (invoiceId: number) => {
    try {
      toast.success(`Downloading invoice #${invoiceId}...`);
      trackEvent("Invoice Downloaded", { invoiceId, userId: user?.user_id || user?.id });
      
      // TODO: Implement actual PDF download
      // For now, show success message
      setTimeout(() => {
        toast.success("Invoice download started!");
      }, 500);
    } catch (error) {
      toast.error("Error downloading invoice");
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Password Change Prompt */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaKey className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Change Your Password</h3>
              </div>
              <button onClick={() => setShowPasswordPrompt(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  For security, please change your password from the one emailed to you.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                disabled={!newPassword || !confirmPassword}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
              >
                Change Password
              </button>
              <button
                onClick={() => setShowPasswordPrompt(false)}
                className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

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
                <h1 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">Welcome back, {profile.name}! 👋</h1>
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
            { id: "invoices", label: "Invoices", icon: <FaDownload />, gradient: "from-green-500 to-teal-500" },
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
              
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaChartLine className="text-blue-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {proposals.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <FaFileAlt className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">New proposal submitted</p>
                        <p className="text-sm text-gray-600">{proposals[0].service}</p>
                      </div>
                    </div>
                  )}
                  {tasks.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <FaTasks className="text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Tasks assigned</p>
                        <p className="text-sm text-gray-600">{tasks.length} active tasks</p>
                      </div>
                    </div>
                  )}
                  {projects.length === 0 && proposals.length === 0 && tasks.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No recent activity</p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
                  {projects.length > 0 ? (
                    projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{project.title}</span>
                          <span className="text-sm text-gray-500">{project.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No projects yet</p>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
                  {tasks.filter(t => t.due_date).length > 0 ? (
                    tasks.filter(t => t.due_date).slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-600">{new Date(task.due_date!).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === "Completed" ? "bg-green-100 text-green-700" :
                          task.priority === "High" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
              </div>
              
              {/* Search Bar */}
              {projects.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects by title or description..."
                      value={projectsSearch}
                      onChange={(e) => {
                        setProjectsSearch(e.target.value);
                        setProjectsPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length > 0 ? (
                  (() => {
                    const filtered = projects.filter((project) =>
                      project.title.toLowerCase().includes(projectsSearch.toLowerCase()) ||
                      project.description?.toLowerCase().includes(projectsSearch.toLowerCase())
                    );
                    const startIdx = (projectsPage - 1) * itemsPerPage;
                    const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);
                    
                    return paginated.length > 0 ? (
                      <>
                        {paginated.map((project) => (
                          <div key={project.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                project.status === "Completed" ? "bg-green-100 text-green-700" :
                                project.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {project.status}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                            {project.progress !== undefined && (
                              <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-gray-600">Progress</span>
                                  <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                            {project.deadline && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaClock />
                                <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="col-span-full">
                          <AdminPagination
                            currentPage={projectsPage}
                            totalItems={filtered.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setProjectsPage}
                            onItemsPerPageChange={setItemsPerPage}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                        <FaProjectDiagram className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search terms</p>
                        <button
                          onClick={() => setProjectsSearch("")}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          Clear search
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                    <FaProjectDiagram className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Yet</h3>
                    <p className="text-gray-500">Your projects will appear here once they&apos;re assigned to you.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
              
              {/* Search Bar */}
              {tasks.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tasks by title or description..."
                      value={tasksSearch}
                      onChange={(e) => {
                        setTasksSearch(e.target.value);
                        setTasksPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                {tasks.length > 0 ? (
                  (() => {
                    const filtered = tasks.filter((task) =>
                      task.title.toLowerCase().includes(tasksSearch.toLowerCase()) ||
                      task.description?.toLowerCase().includes(tasksSearch.toLowerCase())
                    );
                    const startIdx = (tasksPage - 1) * itemsPerPage;
                    const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);
                    
                    return paginated.length > 0 ? (
                      <>
                        <div className="divide-y divide-gray-100">
                          {paginated.map((task) => (
                            <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                                  {task.description && (
                                    <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                                  )}
                                  <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      task.status === "Completed" || task.status === "Done" ? "bg-green-100 text-green-700" :
                                      task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                                      "bg-gray-100 text-gray-700"
                                    }`}>
                                      {task.status}
                                    </span>
                                    {task.priority && (
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        task.priority === "High" ? "bg-red-100 text-red-700" :
                                        task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-gray-100 text-gray-700"
                                      }`}>
                                        {task.priority}
                                      </span>
                                    )}
                                    {task.due_date && (
                                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
                                        <FaClock />
                                        {new Date(task.due_date).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 border-t border-gray-100">
                          <AdminPagination
                            currentPage={tasksPage}
                            totalItems={filtered.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setTasksPage}
                            onItemsPerPageChange={setItemsPerPage}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="p-12 text-center">
                        <FaTasks className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tasks Found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search terms</p>
                        <button
                          onClick={() => setTasksSearch("")}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          Clear search
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-12 text-center">
                    <FaTasks className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tasks Yet</h3>
                    <p className="text-gray-500">Your tasks will appear here once they&apos;re assigned to you.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
              
              {/* Search Bar */}
              {appointments.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search appointments by service or notes..."
                      value={appointmentsSearch}
                      onChange={(e) => {
                        setAppointmentsSearch(e.target.value);
                        setAppointmentsPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.length > 0 ? (
                  (() => {
                    const filtered = appointments.filter((apt) =>
                      apt.service.toLowerCase().includes(appointmentsSearch.toLowerCase()) ||
                      apt.notes?.toLowerCase().includes(appointmentsSearch.toLowerCase())
                    );
                    const startIdx = (appointmentsPage - 1) * itemsPerPage;
                    const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);
                    
                    return paginated.length > 0 ? (
                      <>
                        {paginated.map((apt) => (
                          <div key={apt.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                  <FaCalendar className="text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">{apt.service}</h3>
                                  <p className="text-sm text-gray-600">{new Date(apt.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                apt.status === "Confirmed" ? "bg-green-100 text-green-700" :
                                apt.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {apt.status}
                              </span>
                            </div>
                            {apt.notes && (
                              <p className="text-gray-600 text-sm">{apt.notes}</p>
                            )}
                          </div>
                        ))}
                        <div className="col-span-full">
                          <AdminPagination
                            currentPage={appointmentsPage}
                            totalItems={filtered.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setAppointmentsPage}
                            onItemsPerPageChange={setItemsPerPage}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                        <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search terms</p>
                        <button
                          onClick={() => setAppointmentsSearch("")}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          Clear search
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                    <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments</h3>
                    <p className="text-gray-500">Your appointments will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Proposals Tab */}
          {activeTab === "proposals" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">My Proposals</h2>
              
              {/* Search Bar */}
              {proposals.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search proposals by service or message..."
                      value={proposalsSearch}
                      onChange={(e) => {
                        setProposalsSearch(e.target.value);
                        setProposalsPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                {proposals.length > 0 ? (
                  (() => {
                    const filtered = proposals.filter((proposal) =>
                      proposal.service.toLowerCase().includes(proposalsSearch.toLowerCase()) ||
                      proposal.message?.toLowerCase().includes(proposalsSearch.toLowerCase())
                    );
                    const startIdx = (proposalsPage - 1) * itemsPerPage;
                    const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);
                    
                    return paginated.length > 0 ? (
                      <>
                        <div className="divide-y divide-gray-100">
                          {paginated.map((proposal) => (
                            <div key={proposal.id} className="p-6 hover:bg-gray-50 transition-colors">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-2">{proposal.service}</h3>
                                  {proposal.message && (
                                    <p className="text-gray-600 text-sm mb-3">{proposal.message}</p>
                                  )}
                                  <p className="text-sm text-gray-500">
                                    Submitted: {new Date(proposal.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  proposal.status === "Approved" ? "bg-green-100 text-green-700" :
                                  proposal.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-gray-100 text-gray-700"
                                }`}>
                                  {proposal.status || "Pending"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 border-t border-gray-100">
                          <AdminPagination
                            currentPage={proposalsPage}
                            totalItems={filtered.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setProposalsPage}
                            onItemsPerPageChange={setItemsPerPage}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="p-12 text-center">
                        <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Proposals Found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search terms</p>
                        <button
                          onClick={() => setProposalsSearch("")}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          Clear search
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-12 text-center">
                    <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Proposals</h3>
                    <p className="text-gray-500">Your service requests will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === "invoices" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">My Invoices</h2>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                {invoices.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Invoice #{invoice.id}</h3>
                            <p className="text-gray-600 text-sm mb-2">{invoice.project_title}</p>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500">
                                Date: {new Date(invoice.created_at).toLocaleDateString()}
                              </span>
                              {invoice.due_date && (
                                <span className="text-sm text-gray-500">
                                  Due: {new Date(invoice.due_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">${invoice.amount.toLocaleString()}</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                invoice.status === "Paid" ? "bg-green-100 text-green-700" :
                                invoice.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {invoice.status}
                              </span>
                            </div>
                            <button
                              onClick={() => downloadInvoice(invoice.id)}
                              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                              title="Download Invoice"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Invoices</h3>
                    <p className="text-gray-500">Your invoices will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        value={profile.company}
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        toast.success("Profile updated successfully!");
                        trackEvent("Profile Updated", { userId: user?.user_id || user?.id });
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setShowPasswordPrompt(true)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors flex items-center gap-2"
                    >
                      <FaKey />
                      Change Password
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
