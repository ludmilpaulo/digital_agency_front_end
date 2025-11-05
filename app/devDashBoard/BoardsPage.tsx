"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import type { Board } from "./types";
import useApi from "./api";
import { selectUser } from "@/redux/slices/authSlice";
import { checkIsStaff } from "@/utils/checkIsStaff";
import { FaPlus, FaChartBar, FaTasks, FaUsers, FaCalendar, FaFileSignature, FaUserCircle, FaProjectDiagram } from "react-icons/fa";

// Dynamically import components to avoid SSR issues
const BoardManager = dynamic(() => import("./BoardManager"), { ssr: false });
const TaskManager = dynamic(() => import("./TaskManager"), { ssr: false });
const DocumentSigner = dynamic(() => import("./DocumentSigner"), { ssr: false });
const ProfileEditor = dynamic(() => import("./ProfileEditor"), { ssr: false });

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoard, setNewBoard] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'boards' | 'tasks' | 'documents' | 'profile'>('dashboard');
  const router = useRouter();
  const user = useSelector(selectUser);

  const api = useApi();

  // Authentication check - staff only
  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to login");
      router.replace("/LoginScreenUser");
      return;
    }
    
    let isMounted = true;
    
    (async () => {
      try {
        console.log("Checking staff status for user:", user.user_id || user.id);
        const { isStaff, detail } = await checkIsStaff(user.user_id || user.id);
        
        if (!isMounted) return;
        
        if (!isStaff) {
          console.warn(detail || "Access denied. Staff only.");
          alert("Access Denied: This dashboard is only accessible to staff members.");
          router.replace("/");
        } else {
          console.log("Staff access granted");
          setAuthed(true);
        }
      } catch (error) {
        console.error("Error checking staff status:", error);
        if (isMounted) {
          alert("Error verifying access. Please try again.");
          router.replace("/");
        }
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, [user, router]);

  const fetchBoards = useCallback(async () => {
    if (!authed) {
      console.log("Not authenticated yet, skipping board fetch");
      return;
    }
    
    try {
      console.log("Fetching boards...");
      setLoading(true);
      const { data } = await api.get("/boards/");
      console.log("Boards fetched successfully:", data);
      setBoards(data);
      setError("");
    } catch (err: any) {
      console.error("Error fetching boards:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.detail || "Failed to load boards");
    } finally {
      setLoading(false);
    }
  }, [api, authed]);

  useEffect(() => {
    if (authed) {
      fetchBoards();
    }
  }, [authed, fetchBoards]);

  const addBoard = async () => {
    if (!newBoard.trim()) return;
    try {
      const { data } = await api.post("/boards/", { name: newBoard, description: "" });
      setBoards(prev => [data, ...prev]);
      setNewBoard("");
      setError("");
    } catch {
      setError("Failed to add board");
    }
  };

  const deleteBoard = async (id: number) => {
    if (!confirm("Are you sure you want to delete this board?")) return;
    try {
      await api.delete(`/boards/${id}/`);
      setBoards(prev => prev.filter(b => b.id !== id));
      setError("");
    } catch {
      setError("Failed to delete board");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addBoard();
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg flex items-center gap-2 md:gap-3">
                <span className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <FaTasks className="text-2xl md:text-3xl" />
                </span>
                <span className="hidden sm:inline">Developer Dashboard</span>
                <span className="sm:hidden">Dev Dashboard</span>
              </h1>
              <p className="mt-2 text-sm md:text-lg text-purple-100">Manage your projects and track progress</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 md:mt-8 flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all font-semibold ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FaChartBar /> <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('boards')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all font-semibold ${
                activeTab === 'boards'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FaProjectDiagram /> <span className="hidden sm:inline">Boards</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all font-semibold ${
                activeTab === 'tasks'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FaTasks /> <span className="hidden sm:inline">Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all font-semibold ${
                activeTab === 'documents'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FaFileSignature /> <span className="hidden sm:inline">Documents</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all font-semibold ${
                activeTab === 'profile'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FaUserCircle /> <span className="hidden sm:inline">Profile</span>
            </button>
          </div>

          {/* Stats - Only show on dashboard tab */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all group border border-blue-200/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Total Boards</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{boards.length}</p>
                </div>
                <div className="p-2 md:p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl group-hover:scale-110 transition-transform self-end md:self-auto">
                  <FaTasks className="text-2xl md:text-3xl text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all group border border-green-200/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Active Projects</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{boards.filter(b => b.name).length}</p>
                </div>
                <div className="p-2 md:p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl group-hover:scale-110 transition-transform self-end md:self-auto">
                  <FaChartBar className="text-2xl md:text-3xl text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all group border border-purple-200/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Team Members</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">-</p>
                </div>
                <div className="p-2 md:p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl group-hover:scale-110 transition-transform self-end md:self-auto">
                  <FaUsers className="text-2xl md:text-3xl text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all group border border-orange-200/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Total Tasks</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">-</p>
                </div>
                <div className="p-2 md:p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl group-hover:scale-110 transition-transform self-end md:self-auto">
                  <FaTasks className="text-2xl md:text-3xl text-orange-600" />
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Dashboard Tab - Original simple board creator */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Add Board Section */}
            <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl p-4 md:p-8 mb-6 md:mb-8 border border-blue-100">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Quick Create Board</h2>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <input
                  value={newBoard}
                  onChange={(e) => setNewBoard(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter board name..."
                  className="flex-1 border-2 border-blue-200 rounded-xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                />
                <button 
                  onClick={addBoard} 
                  disabled={!newBoard.trim()}
                  className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-base rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-semibold whitespace-nowrap"
                >
                  <FaPlus /> <span className="hidden sm:inline">Add Board</span><span className="sm:hidden">Add</span>
                </button>
              </div>
              {error && <p className="text-red-600 mt-3 text-sm font-medium">{error}</p>}
            </div>

            {/* Boards Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Boards</h3>
              {loading && boards.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading boards...</p>
                </div>
              ) : boards.length === 0 ? (
                <div className="text-center py-12">
                  <FaTasks className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No boards yet. Create one above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {boards.map((board) => (
                    <div 
                      key={board.id} 
                      className="bg-gradient-to-br from-white to-gray-50 border-2 border-blue-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-300"
                      onClick={() => setSelectedBoard(board)}
                    >
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 mb-2">{board.name}</h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendar />
                          {new Date(board.created_at || Date.now()).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBoard(board.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Boards Tab - Full board management */}
        {activeTab === 'boards' && <BoardManager />}

        {/* Tasks Tab - Full task management */}
        {activeTab === 'tasks' && <TaskManager />}

        {/* Documents Tab - Document signing */}
        {activeTab === 'documents' && <DocumentSigner />}

        {/* Profile Tab - Profile editor */}
        {activeTab === 'profile' && <ProfileEditor />}
      </div>
    </div>
  );
}
