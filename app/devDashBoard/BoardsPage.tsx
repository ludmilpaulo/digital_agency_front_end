"use client";

import { useEffect, useState, useCallback } from "react";
import type { Board } from "./types";
import useApi from "./api"; // make sure this default-exports your axios instance hook

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoard, setNewBoard] = useState("");
  const [error, setError] = useState<string>("");

  const api = useApi(); // ✅ don't shadow an imported `API` symbol

  const fetchBoards = useCallback(async () => {
    try {
      const { data } = await api.get("/boards/");
      setBoards(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load boards");
    }
  }, [api]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const addBoard = async () => {
    try {
      const { data } = await api.post("/boards/", { name: newBoard, description: "" });
      setBoards(prev => [...prev, data]);
      setNewBoard("");
      setError("");
    } catch {
      setError("Failed to add board");
    }
  };

  const deleteBoard = async (id: number) => {
    try {
      await api.delete(`/boards/${id}/`);
      setBoards(prev => prev.filter(b => b.id !== id));
      setError("");
    } catch {
      setError("Failed to delete board");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <input
          value={newBoard}
          onChange={(e) => setNewBoard(e.target.value)}
          placeholder="Add new board"
          className="border rounded px-3 py-2 w-full"
        />
        <button onClick={addBoard} className="px-4 py-2 rounded bg-black text-white">
          Add Board
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {boards.map((board) => (
          <div key={board.id} className="border rounded p-3 flex items-center justify-between">
            <h3 className="font-semibold">{board.name}</h3>
            <button
              onClick={() => deleteBoard(board.id)}
              className="px-3 py-1 rounded border"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
