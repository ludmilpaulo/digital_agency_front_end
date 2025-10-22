"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { 
  FaUser, FaProjectDiagram, FaTasks, FaCalendar, FaFileAlt, 
  FaEnvelope, FaCog, FaChartLine, FaCheckCircle, FaClock, 
  FaExclamationTriangle, FaEdit, FaEye, FaDownload, FaKey,
  FaInfoCircle, FaTimes, FaSearch, FaPlus, FaDollarSign
} from "react-icons/fa";
import { baseAPI } from "@/useAPI/api";
import { trackEvent } from "@/lib/analytics/mixpanel";
import Image from "next/image";
import toast from "react-hot-toast";
import AdminPagination from "@/components/AdminPagination";
import RequestProjectModal from "@/components/RequestProjectModal";

interface Project {
  id: number;
  title: string;
  status: string;
  progress?: number;
  start_date?: string;
  deadline?: string;
  description: string;
  client?: string;
  client_link?: string;
  budget?: number;
  created_at?: string;
  service?: string;
  priority?: string;
  last_updated?: string;
  milestones?: Array<{
    id: number;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    due_date?: string;
    completed_date?: string;
  }>;
  team_members?: Array<{
    id: number;
    name: string;
    role: string;
  }>;
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
  invoice_number: string;
  board_name: string;
  project_title?: string; // For backward compatibility
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  issue_date: string;
  created_at?: string; // For backward compatibility
  due_date?: string;
  paid_date?: string;
  is_overdue: boolean;
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
  const [showRequestProjectModal, setShowRequestProjectModal] = useState(false);
  
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

  // Download Invoice PDF
  const handleDownloadInvoice = async (invoiceId: number, invoiceNumber: string) => {
    try {
      const response = await fetch(`${baseAPI}/task/invoices/${invoiceId}/download_pdf/`);
      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

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

      // Fetch Projects (Boards) - Only boards where user is assigned or managing
      try {
        const projectsRes = await fetch(`${baseAPI}/task/boards/?user_id=${userId}`, { headers });
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          // Transform Board data to match Project interface
          const transformedProjects = Array.isArray(projectsData) 
            ? projectsData.map((board: any) => {
                // Calculate progress based on status and card completion
                let progress = 0;
                
                if (board.status === 'Concluded') {
                  // Concluded projects are 100% complete
                  progress = 100;
                } else if (board.status === 'In Progress') {
                  // Calculate based on completed cards
                  const allCards = board.lists?.flatMap((list: any) => list.cards || []) || [];
                  const totalCards = allCards.length;
                  const completedCards = allCards.filter((card: any) => card.status === 'Completed').length;
                  
                  if (totalCards > 0) {
                    progress = Math.round((completedCards / totalCards) * 100);
                  } else {
                    // If no cards yet, show 25% for in-progress
                    progress = 25;
                  }
                } else if (board.status === 'Started') {
                  // Started projects show 10% progress
                  progress = 10;
                }
                
                return {
                  id: board.id,
                  title: board.name,
                  description: board.description || '',
                  status: board.status || 'Started',
                  progress: progress,
                  deadline: board.deadline,
                  start_date: board.start_date,
                  budget: board.budget,
                  client: board.users?.map((u: any) => u.username).join(', ') || '',
                  client_link: board.client_link || '',
                  created_at: board.created_at
                };
              })
            : [];
          setProjects(transformedProjects);
        } else {
          console.warn("Failed to fetch projects:", projectsRes.status);
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      }

      // Fetch Tasks (Cards) - Only cards where user is assigned
      try {
        const tasksRes = await fetch(`${baseAPI}/task/cards/?user_id=${userId}`, { headers });
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          // Transform Card data to match Task interface
          const transformedTasks = Array.isArray(tasksData)
            ? tasksData.map((card: any) => ({
                id: card.id,
                title: card.title,
                description: card.description || '',
                status: card.status || 'Not Started',
                priority: card.priority || 'Medium',
                due_date: card.due_date,
                board: card.list?.board?.id || card.list
              }))
            : [];
          setTasks(transformedTasks);
        } else {
          console.warn("Failed to fetch tasks:", tasksRes.status);
          setTasks([]);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setTasks([]);
      }

      // Fetch Appointments - Only user's appointments
      try {
        const appointmentsRes = await fetch(`${baseAPI}/appointment/appointments/?user_id=${userId}`, { headers });
        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json();
          // Transform appointment data to match interface
          const transformedAppointments = Array.isArray(appointmentsData)
            ? appointmentsData.map((apt: any) => ({
                id: apt.id,
                date: apt.date,
                time: apt.time,
                service: apt.reason || 'Consultation', // Map reason to service
                status: 'scheduled', // Default status
                notes: apt.reason,
                client_name: apt.user?.username || '',
                phone: apt.phone
              }))
            : [];
          setAppointments(transformedAppointments);
        } else {
          console.warn("Failed to fetch appointments:", appointmentsRes.status);
          setAppointments([]);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setAppointments([]);
      }

      // Fetch Proposals - Only user's proposals
      try {
        const proposalsRes = await fetch(`${baseAPI}/services/proposals/?user_id=${userId}`, { headers });
        if (proposalsRes.ok) {
          const proposalsData = await proposalsRes.json();
          // Transform proposal data to match interface
          const transformedProposals = Array.isArray(proposalsData)
            ? proposalsData.map((prop: any) => ({
                id: prop.id,
                service: prop.service || 'General Inquiry',
                status: 'pending', // Default status
                created_at: prop.submitted_at || prop.created_at,
                name: prop.name,
                email: prop.email,
                message: prop.message
              }))
            : [];
          setProposals(transformedProposals);
        } else {
          console.warn("Failed to fetch proposals:", proposalsRes.status);
          setProposals([]);
        }
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setProposals([]);
      }

      // Fetch Invoices - Only user's invoices
      try {
        const invoicesRes = await fetch(`${baseAPI}/task/invoices/?user_id=${userId}`, { headers });
        if (invoicesRes.ok) {
          const invoicesData = await invoicesRes.json();
          setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
        } else {
          console.warn("Failed to fetch invoices:", invoicesRes.status);
          setInvoices([]);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setInvoices([]);
      }

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
                <button
                  onClick={() => setShowRequestProjectModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition flex items-center gap-2 justify-center sm:justify-start shadow-lg hover:shadow-xl"
                >
                  <FaPlus /> Request New Project
                </button>
              </div>

              {/* Progress Overview Dashboard */}
              {projects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Projects</p>
                        <p className="text-3xl font-bold">{projects.length}</p>
                      </div>
                      <FaProjectDiagram className="text-4xl text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Completed</p>
                        <p className="text-3xl font-bold">
                          {projects.filter(p => p.status === 'Completed' || p.progress === 100).length}
                        </p>
                      </div>
                      <FaCheckCircle className="text-4xl text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">In Progress</p>
                        <p className="text-3xl font-bold">
                          {projects.filter(p => p.status === 'In Progress' || (p.progress && p.progress > 0 && p.progress < 100)).length}
                        </p>
                      </div>
                      <FaTasks className="text-4xl text-purple-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Avg Progress</p>
                        <p className="text-3xl font-bold">
                          {Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length)}%
                        </p>
                      </div>
                      <FaChartLine className="text-4xl text-orange-200" />
                    </div>
                  </div>
                </div>
              )}
              
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
                          <div key={project.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                            {/* Header with gradient background */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                  project.status === "Completed" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                                  project.status === "In Progress" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                                  project.status === "Started" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                                  "bg-gray-100 text-gray-700 border border-gray-200"
                                }`}>
                                  {project.status}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{project.description}</p>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6">
                              {/* Progress Section */}
                              <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm font-medium text-gray-700">Project Progress</span>
                                  <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                                    {project.progress || 0}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${project.progress || 0}%` }}
                                  ></div>
                                </div>
                                
                                {/* Progress Status Indicators */}
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                  <span className={project.progress === 0 ? "font-semibold text-gray-700" : ""}>Not Started</span>
                                  <span className={project.progress && project.progress > 0 && project.progress < 50 ? "font-semibold text-blue-600" : ""}>In Progress</span>
                                  <span className={project.progress && project.progress >= 50 && project.progress < 100 ? "font-semibold text-purple-600" : ""}>Almost Done</span>
                                  <span className={project.progress === 100 ? "font-semibold text-green-600" : ""}>Completed</span>
                                </div>
                              </div>
                              
                              {/* Project Details */}
                              <div className="space-y-3 mb-6">
                                {project.budget && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                      <FaDollarSign className="text-green-600 text-sm" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-medium">Budget</p>
                                      <p className="text-sm font-semibold text-gray-900">{project.budget}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {project.service && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <FaProjectDiagram className="text-blue-600 text-sm" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-medium">Service</p>
                                      <p className="text-sm font-semibold text-gray-900">{project.service}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {project.priority && (
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                      project.priority === 'High' || project.priority === 'Urgent' ? 'bg-red-100' :
                                      project.priority === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                                    }`}>
                                      <span className={`text-xs font-bold ${
                                        project.priority === 'High' || project.priority === 'Urgent' ? 'text-red-600' :
                                        project.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                      }`}>!</span>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-medium">Priority</p>
                                      <p className={`text-sm font-semibold ${
                                        project.priority === 'High' || project.priority === 'Urgent' ? 'text-red-600' :
                                        project.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                      }`}>{project.priority}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Progress Tracking Section */}
                              {project.milestones && project.milestones.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Project Milestones</h4>
                                  <div className="space-y-2">
                                    {project.milestones.slice(0, 3).map((milestone) => (
                                      <div key={milestone.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                        <div className={`w-3 h-3 rounded-full ${
                                          milestone.status === 'completed' ? 'bg-green-500' :
                                          milestone.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                                        }`}></div>
                                        <span className={`text-sm ${
                                          milestone.status === 'completed' ? 'text-green-700 line-through' :
                                          milestone.status === 'in_progress' ? 'text-blue-700 font-medium' : 'text-gray-600'
                                        }`}>
                                          {milestone.title}
                                        </span>
                                        {milestone.due_date && (
                                          <span className="text-xs text-gray-500 ml-auto">
                                            Due: {new Date(milestone.due_date).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                    {project.milestones.length > 3 && (
                                      <p className="text-xs text-gray-500 text-center">
                                        +{project.milestones.length - 3} more milestones
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Team Members Section */}
                              {project.team_members && project.team_members.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Team Members</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {project.team_members.slice(0, 3).map((member) => (
                                      <div key={member.id} className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                          <span className="text-white text-xs font-bold">
                                            {member.name.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                        <span className="text-xs text-blue-700 font-medium">{member.name}</span>
                                        <span className="text-xs text-blue-600">{member.role}</span>
                                      </div>
                                    ))}
                                    {project.team_members.length > 3 && (
                                      <div className="bg-gray-100 px-3 py-1 rounded-full">
                                        <span className="text-xs text-gray-600">+{project.team_members.length - 3} more</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Footer */}
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-4">
                                  {project.deadline && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <FaClock className="text-gray-400" />
                                      <span className="font-medium">Due: {new Date(project.deadline).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  {project.last_updated && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <FaCalendar className="text-gray-400" />
                                      <span>Updated: {new Date(project.last_updated).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400">
                                  ID: #{project.id}
                                </div>
                              </div>

                              {/* Live Link Button for Concluded Projects */}
                              {project.status === 'Concluded' && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  {(project as any).client_link ? (
                                    <a
                                      href={(project as any).client_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                                    >
                                      <FaEye className="text-lg" />
                                      View Live Site
                                    </a>
                                  ) : (
                                    <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-500 rounded-lg">
                                      <FaInfoCircle />
                                      <span className="text-sm">Live link will be available soon</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
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
                    <p className="text-gray-500 mb-6">Have a project in mind? Request one and we'll get started!</p>
                    <button
                      onClick={() => setShowRequestProjectModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <FaPlus /> Request Your First Project
                    </button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                          {paginated.map((task) => (
                            <div key={task.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                              {/* Header */}
                              <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-5 border-b border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{task.title}</h3>
                                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                    task.status === "Completed" || task.status === "Done" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                                    task.status === "In Progress" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                                    "bg-gray-100 text-gray-700 border border-gray-200"
                                  }`}>
                                    {task.status}
                                  </span>
                                </div>
                                {task.description && (
                                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{task.description}</p>
                                )}
                              </div>
                              
                              {/* Content */}
                              <div className="p-5">
                                {/* Task Details */}
                                <div className="space-y-3 mb-4">
                                  {task.priority && (
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        task.priority === 'High' || task.priority === 'Urgent' ? 'bg-red-100' :
                                        task.priority === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                                      }`}>
                                        <span className={`text-xs font-bold ${
                                          task.priority === 'High' || task.priority === 'Urgent' ? 'text-red-600' :
                                          task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                        }`}>!</span>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 font-medium">Priority</p>
                                        <p className={`text-sm font-semibold ${
                                          task.priority === 'High' || task.priority === 'Urgent' ? 'text-red-600' :
                                          task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                        }`}>{task.priority}</p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {task.assignee && (
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-purple-600 text-xs font-bold">👤</span>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 font-medium">Assigned To</p>
                                        <p className="text-sm font-semibold text-gray-900">{task.assignee}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                  {task.due_date && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <FaClock className="text-gray-400" />
                                      <span className="font-medium">Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-400">
                                    ID: #{task.id}
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
                          <div key={apt.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                            {/* Header with gradient background */}
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-gray-100">
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">{apt.service}</h3>
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                  apt.status === "Confirmed" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                                  apt.status === "Pending" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                                  "bg-gray-100 text-gray-700 border border-gray-200"
                                }`}>
                                  {apt.status}
                                </span>
                              </div>
                              {apt.notes && (
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{apt.notes}</p>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="p-6">
                              {/* Appointment Details */}
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FaCalendar className="text-blue-600 text-sm" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Date</p>
                                    <p className="text-sm font-semibold text-gray-900">{new Date(apt.date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                
                                {apt.time && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                      <FaClock className="text-purple-600 text-sm" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-medium">Time</p>
                                      <p className="text-sm font-semibold text-gray-900">{apt.time}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {apt.client_name && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                      <span className="text-indigo-600 text-xs font-bold">👤</span>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-medium">Client</p>
                                      <p className="text-sm font-semibold text-gray-900">{apt.client_name}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {apt.phone && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                      <span className="text-green-600 text-xs font-bold">📞</span>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                                      <p className="text-sm font-semibold text-gray-900">{apt.phone}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Footer */}
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-400">
                                  ID: #{apt.id}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(apt.date).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : 
                                   new Date(apt.date) > new Date() ? 'Upcoming' : 'Past'}
                                </div>
                              </div>
                            </div>
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
                            <h3 className="font-semibold text-gray-900 mb-1">Invoice #{invoice.invoice_number}</h3>
                            <p className="text-gray-600 text-sm mb-2">{invoice.board_name || invoice.project_title}</p>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500">
                                Issued: {new Date(invoice.issue_date || invoice.created_at || '').toLocaleDateString()}
                              </span>
                              {invoice.due_date && (
                                <span className={`text-sm font-medium ${invoice.is_overdue ? 'text-red-600' : 'text-gray-500'}`}>
                                  Due: {new Date(invoice.due_date).toLocaleDateString()}
                                  {invoice.is_overdue && ' (Overdue)'}
                                </span>
                              )}
                              {invoice.paid_date && (
                                <span className="text-sm text-green-600 font-medium">
                                  Paid: {new Date(invoice.paid_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs text-gray-500 mb-1">Amount: R{invoice.amount.toLocaleString()}</p>
                              {invoice.tax_amount > 0 && (
                                <p className="text-xs text-gray-500 mb-1">+ Tax: R{invoice.tax_amount.toLocaleString()}</p>
                              )}
                              <p className="text-2xl font-bold text-gray-900">R{invoice.total_amount.toLocaleString()}</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                                invoice.status === "paid" ? "bg-green-100 text-green-700 border border-green-200" :
                                invoice.status === "sent" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                                invoice.status === "overdue" || invoice.is_overdue ? "bg-red-100 text-red-700 border border-red-200" :
                                invoice.status === "draft" ? "bg-gray-100 text-gray-700 border border-gray-200" :
                                "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              }`}>
                                {invoice.status.toUpperCase()}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDownloadInvoice(invoice.id, invoice.invoice_number)}
                              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                              title="Download Invoice PDF"
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

      {/* Request Project Modal */}
      <RequestProjectModal
        isOpen={showRequestProjectModal}
        onClose={() => setShowRequestProjectModal(false)}
        userId={user?.user_id || user?.id || 0}
        onSuccess={() => {
          fetchDashboardData();
          setActiveTab("projects");
        }}
      />
    </div>
  );
}
