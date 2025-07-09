import React, { useState } from "react";
import { User } from "@/types/kanban";

interface Props {
  users: User[];
  onAdd: (board: { name: string; description: string; managers_ids: number[] }) => void;
}

export default function AddBoardModal({ users, onAdd }: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [managers, setManagers] = useState<number[]>([]);

  return (
    <div className="flex gap-2 items-center">
      <input
        className="border px-2 py-1 rounded"
        placeholder="New board name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="border px-2 py-1 rounded"
        placeholder="Board description"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />
      <select
        className="border px-2 py-1 rounded"
        multiple
        value={managers.map(String)}
        onChange={e =>
          setManagers(Array.from(e.target.selectedOptions).map(o => Number(o.value)))
        }
      >
        {users.map(u => (
          <option value={u.id} key={u.id}>{u.username}</option>
        ))}
      </select>
      <button
        className="bg-blue-600 text-white rounded px-4 py-1 text-xs font-semibold hover:bg-blue-700"
        onClick={() => {
          if (!name) return;
          onAdd({ name, description: desc, managers_ids: managers });
          setName("");
          setDesc("");
          setManagers([]);
        }}
      >
        Add Board
      </button>
    </div>
  );
}
