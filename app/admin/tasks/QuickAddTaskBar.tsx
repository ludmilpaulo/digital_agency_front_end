"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAddCardMutation } from "@/redux/services/boardsApi";
import type { User, Board, List } from "@/types/kanban";

interface Props {
  users: User[];
  boards: Board[];
  onSuccess?: () => void;
}

export default function QuickAddTaskBar({ users, boards, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState<number | "">("");
  const [selectedListId, setSelectedListId] = useState<number | "">("");
  const [assignees, setAssignees] = useState<number[]>([]);
  const [addCard, { isLoading }] = useAddCardMutation();

  // Find the selected board and its lists
  const selectedBoard = useMemo(
    () => boards && boards.length ? boards.find((b) => b.id === selectedBoardId) : undefined,
    [selectedBoardId, boards]
  );
  const boardLists = selectedBoard?.lists || [];

  // When Board changes, reset list
  useEffect(() => {
    setSelectedListId("");
  }, [selectedBoardId]);

  const handleAdd = async () => {
    if (!title.trim() || !selectedListId) return;
    try {
      await addCard({
        title,
        description: "",
        list: selectedListId,
        status: "Not Started",
        assignees_ids: assignees,
      }).unwrap();
      setTitle("");
      setSelectedListId("");
      setAssignees([]);
      onSuccess?.();
    } catch {
      alert("Could not create task. Try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 bg-white border rounded-lg p-3 shadow mb-3 items-center">
      {/* Board Dropdown */}
      <select
        className="border px-2 py-1 rounded text-sm w-full md:w-auto"
        value={selectedBoardId}
        onChange={e => setSelectedBoardId(e.target.value ? Number(e.target.value) : "")}
        disabled={isLoading}
      >
        <option value="">Select Board...</option>
        {boards?.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      {/* List Dropdown */}
      <select
        className="border px-2 py-1 rounded text-sm w-full md:w-auto"
        value={selectedListId}
        onChange={e => setSelectedListId(e.target.value ? Number(e.target.value) : "")}
        disabled={isLoading || !selectedBoardId}
      >
        <option value="">Select List...</option>
        {boardLists.map((l) => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>

      {/* Task title */}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title..."
        className="flex-1 border px-2 py-1 rounded text-sm bg-blue-50"
        disabled={isLoading}
      />

      {/* Assignees */}
      <select
        className="border px-2 py-1 rounded text-sm w-full md:w-auto"
        multiple
        value={assignees.map(String)}
        onChange={e => {
          setAssignees(Array.from(e.target.selectedOptions).map(o => Number(o.value)));
        }}
        disabled={isLoading}
      >
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.username}</option>
        ))}
      </select>

      <button
        className="px-4 py-1 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800 flex items-center gap-1"
        onClick={handleAdd}
        disabled={isLoading || !title.trim() || !selectedBoardId || !selectedListId}
      >
        <Plus size={16} /> {isLoading ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
