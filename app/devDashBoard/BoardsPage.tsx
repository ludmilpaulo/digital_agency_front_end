"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Board } from "./types";
import useApi from "./api";
// import BoardList from "./BoardList"; // TODO: Implement BoardList component
import { FaPlus, FaChartBar, FaTasks, FaUsers } from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Manage your projects and tasks</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/admin")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Admin Dashboard
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center">
              <FaTasks className="text-blue-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Boards</p>
                <p className="text-2xl font-bold text-gray-900">{boards.length}</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 flex items-center">
              <FaChartBar className="text-green-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{boards.filter(b => b.name).length}</p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 flex items-center">
              <FaUsers className="text-purple-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 flex items-center">
              <FaTasks className="text-orange-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Tasks</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Board Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Board</h2>
          <div className="flex gap-3">
        <input
          value={newBoard}
          onChange={(e) => setNewBoard(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter board name..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={addBoard} 
              disabled={!newBoard.trim()}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaPlus /> Add Board
        </button>
          </div>
          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Boards</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded-lg ${view === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded-lg ${view === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            >
              List
            </button>
          </div>
        </div>

        {/* Boards Display */}
        {boards.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaTasks className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No boards yet</h3>
            <p className="text-gray-500">Create your first board to get started!</p>
          </div>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
            {boards.map((board) => (
              <div 
                key={board.id} 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedBoard(board)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{board.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBoard(board.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded border border-red-300 hover:border-red-500"
                  >
                    Delete
                  </button>
                </div>
                {board.description && (
                  <p className="text-gray-600 text-sm">{board.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>Created: {new Date(board.created_at || Date.now()).toLocaleDateString()}</span>
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
