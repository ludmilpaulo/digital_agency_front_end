"use client";
import React, { useState } from "react";
import type { Card, User, Board, TaskStatus } from "@/types/tasks";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

export interface TaskTableProps {
  cards: Card[];
  users: User[];
  boards: Board[];
  onAssign: (cardId: number, userIds: number[]) => void;
  onStatusChange: (cardId: number, status: TaskStatus) => void;
}

const ALL_STATUS: TaskStatus[] = ["To Do", "In Progress", "Completed"];

function getBoardName(boards: Board[], cardId: number): string {
  for (const board of boards) {
    for (const list of board.lists || []) {
      if ((list.cards || []).some((c: Card) => c.id === cardId)) {
        return board.name;
      }
    }
  }
  return "—";
}

export default function TaskTable({
  cards,
  users,
  boards,
  onAssign,
  onStatusChange,
}: TaskTableProps) {
  const [userFilter, setUserFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [actionCard, setActionCard] = useState<Card | null>(null);

  // Filter cards
  const filteredCards = cards.filter(card => {
    if (userFilter !== "all" && !(card.assignedTo || []).includes(userFilter)) return false;
    if (statusFilter !== "all" && card.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border p-6">
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Filter by User</label>
          <select
            className="border rounded px-2 py-1"
            value={userFilter}
            onChange={e =>
              setUserFilter(e.target.value === "all" ? "all" : Number(e.target.value))
            }
          >
            <option value="all">All Users</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Filter by Status</label>
          <select
            className="border rounded px-2 py-1"
            value={statusFilter}
            onChange={e =>
              setStatusFilter(
                e.target.value === "all" ? "all" : (e.target.value as TaskStatus)
              )
            }
          >
            <option value="all">All Status</option>
            {ALL_STATUS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead className="bg-blue-50 rounded-xl">
          <tr>
            <th className="p-3 rounded-tl-xl text-lg font-bold text-blue-900">Task</th>
            <th className="p-3 text-lg font-bold text-blue-900">Board</th>
            <th className="p-3 text-lg font-bold text-blue-900">Assigned</th>
            <th className="p-3 text-lg font-bold text-blue-900">Status</th>
            <th className="p-3 text-lg font-bold text-blue-900">Start</th>
            <th className="p-3 text-lg font-bold text-blue-900">Due</th>
            <th className="p-3 rounded-tr-xl text-lg font-bold text-blue-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCards.map(card => (
            <tr key={card.id} className="bg-blue-50 hover:bg-blue-100 transition rounded-xl shadow">
              {/* Task Title */}
              <td className="p-3 font-semibold text-blue-900">{card.title}</td>
              {/* Board Name */}
              <td className="p-3">{getBoardName(boards, card.id)}</td>
              {/* Assigned Users */}
              <td className="p-3">
                <select
                  multiple
                  className="border rounded px-2 py-1 text-xs bg-blue-100 min-w-[130px] max-h-20"
                  value={(card.assignedTo || []).map(String)}
                  onChange={e => {
                    const userIds = Array.from(e.target.selectedOptions).map(
                      opt => Number(opt.value)
                    );
                    onAssign(card.id, userIds);
                  }}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.username} {u.email && `(${u.email})`}
                    </option>
                  ))}
                </select>
              </td>
              {/* Status */}
              <td className="p-3">
                <select
                  className="border rounded px-2 py-1 text-xs bg-blue-100"
                  value={card.status}
                  onChange={e =>
                    onStatusChange(card.id, e.target.value as TaskStatus)
                  }
                >
                  {ALL_STATUS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              {/* Start Date */}
              <td className="p-3">{card.startDate || "—"}</td>
              {/* Due Date */}
              <td className="p-3">{card.dueDate || "—"}</td>
              {/* Actions */}
              <td className="p-3 relative">
                <button
                  onClick={() => setActionCard(card)}
                  className="p-2 rounded hover:bg-blue-200 transition"
                  aria-label="More actions"
                >
                  <MoreVertical size={20} />
                </button>
                {/* Popover for actions */}
                {actionCard?.id === card.id && (
                  <div className="absolute z-50 right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg animate-fadeIn">
                    <button
                      onClick={() => {
                        // Trigger edit modal here!
                        setActionCard(null);
                        alert(`Edit Task: ${card.title}`);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-blue-900"
                    >
                      <Edit size={16} /> Edit Task
                    </button>
                    <button
                      onClick={() => {
                        setActionCard(null);
                        if (confirm(`Delete task "${card.title}"?`)) {
                          // Call delete here if needed!
                        }
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-700"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                    <button
                      onClick={() => setActionCard(null)}
                      className="w-full flex items-center justify-center px-4 py-2 text-xs text-gray-500"
                    >
                      Close
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {/* No data */}
          {filteredCards.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-6 text-gray-400">No tasks found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
