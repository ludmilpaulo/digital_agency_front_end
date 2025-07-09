import React, { useState } from "react";
import { User } from "@/types/groups";
import { Group } from "@/types/groups";
import { FaUserPlus, FaPlus } from "react-icons/fa";

interface UsersNoGroupProps {
  users: User[];
  allGroups: Group[];
  assignUsersToGroup: (group: Group, userIds: number[]) => void;
  filter: string;
}

export default function UsersNoGroup({
  users,
  allGroups,
  assignUsersToGroup,
  filter,
}: UsersNoGroupProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [groupId, setGroupId] = useState<number | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(filter) ||
      u.email.toLowerCase().includes(filter)
  );

  if (filteredUsers.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-4">
      <div className="flex items-center mb-2 font-bold text-yellow-800">
        <FaUserPlus className="mr-2" /> Users not in any group
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {filteredUsers.map((u) => (
          <label key={u.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(u.id)}
              onChange={() =>
                setSelected((ids) =>
                  ids.includes(u.id)
                    ? ids.filter((id) => id !== u.id)
                    : [...ids, u.id]
                )
              }
            />
            {u.username}
            <span className="text-xs text-gray-400">{u.email}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <select
          className="border px-2 py-1 rounded"
          value={groupId ?? ""}
          onChange={(e) => setGroupId(Number(e.target.value) || null)}
        >
          <option value="">Assign to group...</option>
          {allGroups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <button
          disabled={selected.length === 0 || !groupId}
          className="bg-blue-600 text-white rounded px-3 py-1 font-semibold hover:bg-blue-700 disabled:opacity-40"
          onClick={() => {
            if (!groupId) return;
            const group = allGroups.find((g) => g.id === groupId)!;
            assignUsersToGroup(group, selected);
            setSelected([]);
            setGroupId(null);
          }}
        >
          <FaPlus /> Assign Selected
        </button>
      </div>
    </div>
  );
}
