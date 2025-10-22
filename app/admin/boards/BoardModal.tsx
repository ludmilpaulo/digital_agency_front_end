import React, { useEffect } from "react";
import { PlusCircle, Save, X } from "lucide-react";
import type { User, BoardFields } from "@/types/kanban";

type BoardModalMode = "add" | "edit";

interface BoardModalProps {
  mode: BoardModalMode;
  show: boolean;
  boardFields: BoardFields;
  setBoardFields: React.Dispatch<React.SetStateAction<BoardFields>>;
  users: User[];
  onClose: () => void;
  onSubmit: () => void;
}

const statusOptions = [
  { value: "Started", label: "Started" },
  { value: "In Progress", label: "In Progress" },
  { value: "Concluded", label: "Concluded" },
];

const BoardModal: React.FC<BoardModalProps> = ({
  mode,
  show,
  boardFields,
  setBoardFields,
  users,
  onClose,
  onSubmit,
}) => {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  // Utility for select fields (avoid duplicated code)
  const handleMultiSelect = (field: "managers_ids" | "users_ids") => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setBoardFields(prev => ({
      ...prev,
      [field]: Array.from(e.target.selectedOptions).map(opt => Number(opt.value)),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto animate-fadeIn relative overflow-y-auto max-h-[95vh]">
        {/* Close */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={22} />
        </button>
        {/* Header */}
        <h3 className="font-bold text-2xl mb-4 text-blue-900 flex items-center gap-2">
          {mode === "add" ? <PlusCircle className="w-7 h-7" /> : <Save className="w-7 h-7" />}
          {mode === "add" ? "Create New Board" : "Edit Board"}
        </h3>
        {/* Fields */}
        <div className="grid grid-cols-1 gap-3">
          <input
            className="border px-3 py-2 rounded-xl w-full"
            placeholder="Board Name"
            value={boardFields.name}
            onChange={e => setBoardFields(f => ({ ...f, name: e.target.value }))}
            autoFocus
          />
          <textarea
            className="border px-3 py-2 rounded-xl w-full"
            placeholder="Board Description"
            rows={2}
            value={boardFields.description}
            onChange={e => setBoardFields(f => ({ ...f, description: e.target.value }))}
          />
          <input
            className="border px-3 py-2 rounded-xl w-full"
            placeholder="Development Link (https://...)"
            value={boardFields.development_link}
            onChange={e => setBoardFields(f => ({ ...f, development_link: e.target.value }))}
          />
          <input
            className="border px-3 py-2 rounded-xl w-full"
            placeholder="Repository Link (https://...)"
            value={boardFields.repository_link}
            onChange={e => setBoardFields(f => ({ ...f, repository_link: e.target.value }))}
          />
          <input
            className="border px-3 py-2 rounded-xl w-full"
            placeholder="Client Link (https://...)"
            value={boardFields.client_link}
            onChange={e => setBoardFields(f => ({ ...f, client_link: e.target.value }))}
          />
          <input
            className="border px-3 py-2 rounded-xl w-full"
            placeholder="Sample Link (https://...)"
            value={boardFields.sample_link}
            onChange={e => setBoardFields(f => ({ ...f, sample_link: e.target.value }))}
          />
          {/* Managers */}
          <label className="block text-xs font-semibold text-gray-600 mt-2">Select Managers</label>
          <select
            className="border px-2 py-2 rounded-xl w-full"
            multiple
            value={boardFields.managers_ids.map(String)}
            onChange={handleMultiSelect("managers_ids")}
          >
            {users.map((u) => (
              <option value={u.id} key={u.id}>{u.username}</option>
            ))}
          </select>
          {/* Users */}
          <label className="block text-xs font-semibold text-gray-600 mt-2">Select Users</label>
          <select
            className="border px-2 py-2 rounded-xl w-full"
            multiple
            value={boardFields.users_ids.map(String)}
            onChange={handleMultiSelect("users_ids")}
          >
            {users.map((u) => (
              <option value={u.id} key={u.id}>{u.username}</option>
            ))}
          </select>
          {/* Budget, Dates, Status */}
          <input
            className="border px-3 py-2 rounded-xl w-full"
            placeholder="Budget"
            type="number"
            value={boardFields.budget}
            onChange={e => setBoardFields(f => ({ ...f, budget: e.target.value }))}
          />
          <input
            className="border px-3 py-2 rounded-xl w-full"
            placeholder="Deadline (YYYY-MM-DD)"
            type="date"
            value={boardFields.deadline}
            onChange={e => setBoardFields(f => ({ ...f, deadline: e.target.value }))}
          />
          <input
            className="border px-3 py-2 rounded-xl w-full"
            placeholder="Start Date (YYYY-MM-DD)"
            type="date"
            value={boardFields.start_date}
            onChange={e => setBoardFields(f => ({ ...f, start_date: e.target.value }))}
          />
          <input
            className="border px-3 py-2 rounded-xl w-full"
            placeholder="End Date (YYYY-MM-DD)"
            type="date"
            value={boardFields.end_date}
            onChange={e => setBoardFields(f => ({ ...f, end_date: e.target.value }))}
          />
          <select
            className="border px-2 py-2 rounded-xl w-full"
            value={boardFields.status}
            onChange={e =>
              setBoardFields(f => ({ ...f, status: e.target.value }))
            }
          >
            {statusOptions.map(s => (
              <option value={s.value} key={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            className="flex-1 bg-blue-600 text-white rounded-xl px-4 py-3 font-bold hover:bg-blue-700 transition"
            onClick={onSubmit}
          >
            {mode === "add" ? "Add Board" : "Save Changes"}
          </button>
          <button
            className="flex-1 bg-gray-100 text-gray-600 rounded-xl px-4 py-3 font-semibold hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardModal;
