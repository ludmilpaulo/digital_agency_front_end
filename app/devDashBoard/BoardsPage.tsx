"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Board } from "./types";
import useApi from "./api";
// import BoardList from "./BoardList"; // TODO: Implement BoardList component
import { FaPlus, FaChartBar, FaTasks, FaUsers, FaCalendar } from "react-icons/fa";

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoard, setNewBoard] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const router = useRouter();

  const api = useApi();

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/boards/");
      setBoards(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load boards");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Developer Dashboard...</p>
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
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={() => router.push("/admin")}
                className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all border border-white/30 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaChartBar />
                <span className="hidden sm:inline">Admin Panel</span>
                <span className="sm:hidden">Admin</span>
              </button>
            </div>
          </div>

          {/* Stats */}
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Add Board Section */}
        <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl p-4 md:p-8 mb-6 md:mb-8 border border-blue-100">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Create New Board</h2>
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

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Your Boards</h2>
          <div className="flex gap-2 bg-white rounded-xl p-1 shadow-md">
            <button
              onClick={() => setView("grid")}
              className={`px-6 py-2 rounded-lg transition-all font-medium ${view === "grid" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"}`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-6 py-2 rounded-lg transition-all font-medium ${view === "list" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"}`}
            >
              List
            </button>
          </div>
        </div>

        {/* Boards Display */}
        {boards.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-16 text-center border border-gray-200">
            <div className="p-6 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FaTasks className="text-gray-400 text-5xl" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">No boards yet</h3>
            <p className="text-sm md:text-base text-gray-600 mb-6">Create your first board to start organizing your projects!</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 md:px-8 py-2 md:py-3 text-sm md:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              Create First Board
            </button>
          </div>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {boards.map((board) => (
              <div 
                key={board.id} 
                className="bg-gradient-to-br from-white to-gray-50/50 border-2 border-blue-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:border-blue-300 hover:scale-105"
                onClick={() => setSelectedBoard(board)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{board.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBoard(board.id);
                    }}
                    className="text-red-500 hover:text-white hover:bg-red-500 text-sm px-4 py-2 rounded-lg border border-red-300 hover:border-red-500 transition-all"
                  >
                    Delete
                  </button>
                </div>
                {board.description && (
                  <p className="text-gray-600 text-sm mb-4">{board.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FaCalendar className="text-blue-500" />
                    {new Date(board.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Board Details */}
        {selectedBoard && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedBoard.name}</h2>
                <button 
                  onClick={() => setSelectedBoard(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600">{selectedBoard.description}</p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Board details coming soon...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
