"use client";
import React, { useState, useMemo, useRef } from "react";
import { useAddTaskMutation } from "@/redux/services/tasksApi";
import type { User, Board, List } from "@/types/tasks";
import { X, Loader2 } from "lucide-react";
import clsx from "clsx";

export interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  boards: Board[];
  onCreated?: () => void;
}

export default function AddTaskModal({
  open,
  onClose,
  users,
  boards,
  onCreated,
}: AddTaskModalProps) {
  // FORM STATE
  const [boardId, setBoardId] = useState<number | "">("");
  const [listId, setListId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [assignees, setAssignees] = useState<number[]>([]);
  const [dueDate, setDueDate] = useState<string>("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [image, setImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addTask, { isLoading, error }] = useAddTaskMutation();

  // Lists in the selected board
  const lists = useMemo<List[]>(() => {
    const board = boards.find((b) => b.id === boardId);
    return board ? (board.lists || []) : [];
  }, [boardId, boards]);

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !boardId || !listId) return;
    try {
      // If uploading file, use FormData, else just object
      let formData: FormData | Record<string, any>;
      if (image) {
        formData = new FormData();
        formData.append("title", title);
        formData.append("list", String(listId));
        formData.append("description", description);
        formData.append("due_date", dueDate);
        formData.append("priority", priority);
        assignees.forEach((a) => formData.append("assignees_ids", String(a)));
        formData.append("image", image);
      } else {
        formData = {
          title,
          list: listId,
          description,
          due_date: dueDate,
          priority,
          assignees_ids: assignees,
        };
      }
      await addTask(formData as any).unwrap();
      // Reset
      setBoardId(""); setListId(""); setTitle(""); setAssignees([]);
      setDueDate(""); setDescription(""); setPriority("Medium"); setImage(null);
      onCreated?.();
      onClose();
    } catch (e) {
      // handled by isLoading/error
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
      <form
        className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl relative animate-fadeIn"
        onSubmit={handleSubmit}
        encType={image ? "multipart/form-data" : undefined}
        autoComplete="off"
      >
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full"
        >
          <X size={22} />
        </button>
        <h2 className="font-bold text-2xl text-blue-900 mb-5">Add New Task</h2>
        {/* Board */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1 text-blue-800">Board</label>
          <select
            className="border rounded px-3 py-2 w-full bg-blue-50"
            value={boardId}
            onChange={e => { setBoardId(Number(e.target.value)); setListId(""); }}
            required
            disabled={isLoading}
          >
            <option value="">Select Board…</option>
            {boards.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        {/* List */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1 text-blue-800">List / Column</label>
          <select
            className="border rounded px-3 py-2 w-full bg-blue-50"
            value={listId}
            onChange={e => setListId(Number(e.target.value))}
            required
            disabled={isLoading || !lists.length}
          >
            <option value="">Select List…</option>
            {lists.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        {/* Title */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1 text-blue-800">Title</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            maxLength={100}
            placeholder="Task title"
            disabled={isLoading}
          />
        </div>
        {/* Assignees */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1 text-blue-800">Assignees</label>
          <select
            className="border rounded px-3 py-2 w-full bg-blue-50"
            value={assignees.map(String)}
            onChange={e => setAssignees(Array.from(e.target.selectedOptions).map(o => Number(o.value)))}
            multiple
            disabled={isLoading}
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>
        {/* Due Date & Priority */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-blue-800">Due Date</label>
            <input
              className="border rounded px-3 py-2 w-full"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-blue-800">Priority</label>
            <select
              className="border rounded px-3 py-2 w-full bg-blue-50"
              value={priority}
              onChange={e => setPriority(e.target.value)}
              disabled={isLoading}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
        {/* Description */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1 text-blue-800">Description</label>
          <textarea
            className="border rounded px-3 py-2 w-full"
            rows={3}
            maxLength={1000}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Details about this task…"
            disabled={isLoading}
          />
        </div>
        {/* File Upload */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1 text-blue-800">Image/File (optional)</label>
          <input
            ref={fileInputRef}
            className="border rounded px-3 py-2 w-full bg-blue-50"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          {image && (
            <div className="mt-1 text-xs text-gray-700 flex items-center gap-2">
              <span>Selected: {image.name}</span>
              <button type="button" className="text-red-600 ml-2" onClick={() => setImage(null)}>
                Remove
              </button>
            </div>
          )}
        </div>
        {/* Error */}
        {error && (
          <div className="mb-2 text-xs text-red-600">
            Could not add task. Please check all fields.
          </div>
        )}
        {/* Action */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            className={clsx("rounded px-6 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-2", {
              "opacity-70 pointer-events-none": isLoading
            })}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
            Add Task
          </button>
          <button
            type="button"
            className="rounded px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
