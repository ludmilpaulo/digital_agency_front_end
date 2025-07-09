"use client";
import React, { useState } from "react";
// Do this everywhere!
import type { Card, List, User, TaskStatus } from "@/types/tasks";
// Never import from "/app/admin/types"


export interface TaskTableProps {
  cards: Card[];
  users: User[];
  onAssign: (cardId: number, userIds: number[]) => void;
  onStatusChange: (cardId: number, status: TaskStatus) => void;
}

const ALL_STATUS: TaskStatus[] = ["To Do", "In Progress", "Completed"];

export default function TaskTable({
  cards,
  users,
  onAssign,
  onStatusChange,
}: TaskTableProps) {
  const [userFilter, setUserFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  // Filter cards
  const filteredCards = cards.filter(card => {
    if (userFilter !== "all" && !(card.assignedTo || []).includes(userFilter)) return false;
    if (statusFilter !== "all" && card.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex gap-4 mb-4">
        {/* User filter */}
        <select
          className="border rounded px-2 py-1"
          value={userFilter}
          onChange={e =>
            setUserFilter(e.target.value === "all" ? "all" : Number(e.target.value))
          }
        >
          <option value="all">All Users</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>

        {/* Status filter */}
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
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <table className="w-full text-left border shadow bg-white">
        <thead className="bg-blue-100">
          <tr>
            <th className="p-2">Task</th>
            <th className="p-2">Assigned</th>
            <th className="p-2">Status</th>
            <th className="p-2">Start</th>
            <th className="p-2">Due</th>
          </tr>
        </thead>
        <tbody>
          {filteredCards.map(card => (
            <tr key={card.id} className="border-t">
              <td className="p-2">{card.title}</td>
              <td className="p-2">
                <select
                  multiple
                  className="border rounded px-1 text-xs"
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
                      {u.username}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2">
                <select
                  className="border rounded px-1 text-xs"
                  value={card.status}
                  onChange={e =>
                    onStatusChange(card.id, e.target.value as TaskStatus)
                  }
                >
                  {ALL_STATUS.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2">{card.startDate || "—"}</td>
              <td className="p-2">{card.dueDate || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 