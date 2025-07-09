import React from "react";
import type { Card, User } from "@/types/tasks";

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  userTasks: Card[];
}

export default function UserProfileModal({
  open,
  onClose,
  user,
  userTasks,
}: UserProfileModalProps) {
  if (!open || !user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
        <button className="absolute top-3 right-4 text-2xl text-gray-400" onClick={onClose}>
          ×
        </button>
        <div className="mb-4">
          <div className="text-lg font-bold text-blue-900">{user.username}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
        <div className="font-bold mb-1 text-blue-700">Assigned Tasks:</div>
        {userTasks.length === 0 && <div className="text-gray-400 text-sm">No tasks assigned</div>}
        <ul className="space-y-1">
          {userTasks.map(task => (
            <li key={task.id} className="border p-2 rounded bg-blue-50">
              <div className="font-semibold">{task.title}</div>
              <div className="text-xs text-gray-500">{task.status}</div>
              <div className="text-xs">Start: {task.startDate} | Due: {task.dueDate}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
