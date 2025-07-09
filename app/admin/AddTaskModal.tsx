import { TaskStatus, User } from "@/types/tasks";
import React, { useState } from "react";


interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  onAdd: (task: {
    title: string;
    assignedTo: number[];
    status: TaskStatus;
    startDate: string;
    dueDate: string;
  }) => void;
}
const STATUS: TaskStatus[] = ["To Do", "In Progress", "Completed"];

export default function AddTaskModal({
  open,
  onClose,
  users,
  onAdd,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState<number[]>([]);
  const [status, setStatus] = useState<TaskStatus>("To Do");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || assignedTo.length === 0 || !startDate || !dueDate) return;
    onAdd({ title, assignedTo, status, startDate, dueDate });
    setTitle(""); setAssignedTo([]); setStatus("To Do"); setStartDate(""); setDueDate("");
    onClose();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <form
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative"
        onSubmit={handleSubmit}
      >
        <button
          className="absolute top-3 right-4 text-2xl text-gray-400"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        <div className="font-bold text-lg mb-4 text-blue-900">Add New Task</div>
        <div className="mb-3">
          <label className="block text-xs font-bold mb-1">Title</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-bold mb-1">Assign To</label>
          <select
            className="border rounded px-2 py-1 w-full"
            multiple
            value={assignedTo.map(String)}
            onChange={e =>
              setAssignedTo(Array.from(e.target.selectedOptions).map(opt => Number(opt.value)))
            }
            required
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-xs font-bold mb-1">Status</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={status}
            onChange={e => setStatus(e.target.value as TaskStatus)}
          >
            {STATUS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="mb-3 flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold mb-1">Start Date</label>
            <input
              className="border rounded px-2 py-1 w-full"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold mb-1">Due Date</label>
            <input
              className="border rounded px-2 py-1 w-full"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          className="mt-3 bg-blue-600 hover:bg-blue-800 text-white rounded px-4 py-2 font-bold"
          type="submit"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
