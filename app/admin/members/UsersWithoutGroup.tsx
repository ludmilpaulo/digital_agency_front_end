// app/admin/members/UsersWithoutGroup.tsx
import React, { useState } from "react";
import { User } from "@/redux/services/usersApi";
import { Group } from "@/redux/services/groupsApi";
import { FaUserPlus } from "react-icons/fa";

interface Props {
  users: User[];
  allGroups: Group[];
  assignUsers: ({ groupId, userIds }: { groupId: number; userIds: number[] }) => Promise<void>;
}

const UsersWithoutGroup: React.FC<Props> = ({ users, allGroups, assignUsers }) => {
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [groupId, setGroupId] = useState<number | null>(null);

  if (!users.length) return null;
  return (
    <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl mb-4">
      <div className="font-bold text-yellow-800 mb-2">
        Users not assigned to any group
      </div>
      <div className="mb-2 flex flex-wrap gap-2">
        {users.map((u) => (
          <label key={u.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedUserIds.includes(u.id)}
              onChange={() =>
                setSelectedUserIds((ids) =>
                  ids.includes(u.id)
                    ? ids.filter((id) => id !== u.id)
                    : [...ids, u.id]
                )
              }
            />
            <span className="font-medium">{u.username}</span>
            <span className="text-xs text-gray-400">{u.email}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <select
          className="border px-2 py-1 rounded"
          value={groupId ?? ""}
          onChange={e => setGroupId(Number(e.target.value) || null)}
        >
          <option value="">Select group</option>
          {allGroups.map((g) => (
            <option key={`${g.type}-${g.id}`} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <button
          disabled={!groupId || selectedUserIds.length === 0}
          className="bg-blue-600 text-white px-3 rounded shadow font-bold hover:bg-blue-700 transition disabled:opacity-50"
          onClick={async () => {
            if (!groupId) return;
            await assignUsers({ groupId, userIds: selectedUserIds });
            setSelectedUserIds([]);
            setGroupId(null);
          }}
        >
          <FaUserPlus /> Assign Selected
        </button>
      </div>
    </div>
  );
};

export default UsersWithoutGroup;
