import React, { useState } from "react";
import { User, TaskStatus } from "@/types/kanban";

interface CardEditModalProps {
  mode: "add" | "edit";
  show: boolean;
  initial: {
    title: string;
    description: string;
    status: TaskStatus;
    assignees: number[];
  };
  users: User[];
  onClose: () => void;
  onSubmit: (fields: {
    title: string;
    description: string;
    status: TaskStatus;
    assignees: number[];
  }) => void;
}

const CardEditModal: React.FC<CardEditModalProps> = ({
  mode, show, initial, users, onClose, onSubmit,
}) => {
  const [fields, setFields] = useState(initial);

  React.useEffect(() => {
    setFields(initial);
  }, [show, initial]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">{mode === "edit" ? "Edit Card" : "Add Card"}</h2>
        <input
          className="border px-2 py-1 rounded text-sm bg-white mb-2 w-full"
          placeholder="Title"
          value={fields.title}
          onChange={e => setFields({ ...fields, title: e.target.value })}
        />
        <textarea
          className="border px-2 py-1 rounded text-sm bg-white mb-2 w-full"
          placeholder="Description"
          value={fields.description}
          onChange={e => setFields({ ...fields, description: e.target.value })}
        />
        <select
          className="border px-2 py-1 rounded text-sm bg-white mb-2 w-full"
          value={fields.status}
          onChange={e => setFields({ ...fields, status: e.target.value as TaskStatus })}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          className="border px-2 py-1 rounded text-sm bg-white mb-2 w-full"
          multiple
          value={fields.assignees.map(String)}
          onChange={e => {
            const values = Array.from(e.target.selectedOptions).map(o => Number(o.value));
            setFields({ ...fields, assignees: values });
          }}
        >
          {users.map((u: User) => (
            <option value={u.id} key={u.id}>{u.username}</option>
          ))}
        </select>
        <div className="flex gap-3 justify-end mt-3">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
            onClick={() => {
              if (fields.title && fields.description) {
                onSubmit(fields);
              }
            }}
            type="button"
          >
            {mode === "edit" ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardEditModal;
