"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import type { Card, User } from "@/types/tasks";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (fields: Partial<Card>) => Promise<void>;
  users: User[];
  initial?: Partial<Card>;
  isEdit?: boolean;
}

const statusOptions = [
  "Not Started", "In Progress", "Completed", "Failed", "Reassigned"
];

const priorityOptions = [
  "Low", "Medium", "High", "Urgent"
];

export default function TaskEditModal({
  open,
  onClose,
  onSubmit,
  users,
  initial = {},
  isEdit = false,
}: Props) {
  const [fields, setFields] = useState<Partial<Card>>(initial);

  useEffect(() => { setFields(initial); }, [initial, open]);

  return (
    <Dialog open={open} onClose={onClose} className="z-50 fixed inset-0 flex items-center justify-center">
      {/* Overlay for modal background */}
      {open && <div className="fixed inset-0 bg-black/30" aria-hidden="true"></div>}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto z-50 relative">
        <Dialog.Title className="text-lg font-bold mb-2">
          {isEdit ? "Edit Task" : "Add Task"}
        </Dialog.Title>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Title"
          value={fields.title ?? ""}
          onChange={e => setFields(f => ({ ...f, title: e.target.value }))}
        />
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Description"
          value={fields.description ?? ""}
          onChange={e => setFields(f => ({ ...f, description: e.target.value }))}
        />
        <select
          className="border p-2 rounded w-full mb-2"
          value={fields.status || "Not Started"}
          onChange={e => setFields(f => ({ ...f, status: e.target.value as any }))}
        >
          {statusOptions.map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          className="border p-2 rounded w-full mb-2"
          value={fields.priority || "Medium"}
          onChange={e => setFields(f => ({ ...f, priority: e.target.value }))}
        >
          <option value="">Priority</option>
          {priorityOptions.map(p => <option key={p}>{p}</option>)}
        </select>
        <input
          type="date"
          className="border p-2 rounded w-full mb-2"
          value={fields.due_date || ""}
          onChange={e => setFields(f => ({ ...f, due_date: e.target.value }))}
        />
        <select
          className="border p-2 rounded w-full mb-2"
          multiple
          value={fields.assignees?.map(String) || []}
          onChange={e =>
            setFields(f => ({
              ...f,
              assignees: Array.from(e.target.selectedOptions).map(o => Number(o.value))
            }))
          }
        >
          {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
        </select>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            onClick={async () => { await onSubmit(fields); onClose(); }}
          >
            {isEdit ? "Save" : "Create"}
          </button>
          <button
            className="bg-gray-200 text-gray-600 px-4 py-2 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}
