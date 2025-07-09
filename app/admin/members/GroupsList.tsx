// app/admin/members/GroupsList.tsx
import React from "react";
import { Group } from "@/redux/services/groupsApi";
import { User } from "@/redux/services/usersApi";
import { FaUsers, FaTrashAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";

interface GroupsListProps {
  groups: Group[];
  users: User[];
  selectedGroupId: number | null;
  onSelect: (id: number) => void;
  onDelete: (group: Group) => void;
  editingGroupId?: number | null;
  editingGroupName?: string;
  onEdit?: (group: Group) => void;
  onEditChange?: (name: string) => void;
  onEditSave?: (group: Group) => void;
  onEditCancel?: () => void;
}

const GroupsList: React.FC<GroupsListProps> = ({
  groups,
  users,
  selectedGroupId,
  onSelect,
  onDelete,
  editingGroupId,
  editingGroupName,
  onEdit,
  onEditChange,
  onEditSave,
  onEditCancel,
}) => (
  <div className="bg-white shadow rounded-xl p-4 max-h-[60vh] overflow-y-auto">
    <div className="font-bold text-blue-800 mb-2">Project & System Groups</div>
    <ul className="space-y-2">
      {groups.length === 0 && (
        <li className="text-xs text-gray-400">No groups found.</li>
      )}
      {groups.map((g) =>
        editingGroupId === g.id ? (
          <li key={`${g.type}-${g.id}`} className="flex items-center gap-2 p-2 rounded-lg bg-blue-100 border-l-4 border-blue-600 font-bold">
            <input
              className="border px-2 py-1 rounded flex-1"
              value={editingGroupName}
              onChange={e => onEditChange?.(e.target.value)}
            />
            <button
              className="text-green-600 hover:text-green-800 px-1"
              onClick={() => onEditSave && onEditSave(g)}
              title="Save"
            >
              <FaSave />
            </button>
            <button
              className="text-gray-500 hover:text-gray-800 px-1"
              onClick={onEditCancel}
              title="Cancel"
            >
              <FaTimes />
            </button>
          </li>
        ) : (
          <li
            key={`${g.type}-${g.id}`}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
              selectedGroupId === g.id ? "bg-blue-100 border-l-4 border-blue-600 font-bold" : "hover:bg-blue-50"
            }`}
            title={g.users && g.users.length ? users.filter(u => g.users?.includes(u.id)).map(u => u.username).join(", ") : ""}
            onClick={() => onSelect(g.id)}
          >
            <FaUsers className="text-blue-500" />
            <span className="flex-1">{g.name}</span>
            <span className="text-xs text-gray-400">{g.users?.length || 0} members</span>
            {onEdit && (
              <button className="text-blue-500 hover:text-blue-700 px-1" onClick={e => { e.stopPropagation(); onEdit(g); }}>
                <FaEdit />
              </button>
            )}
            <button
              className="text-red-400 hover:text-red-700 px-1"
              onClick={e => { e.stopPropagation(); onDelete(g); }}
              title="Delete group"
            >
              <FaTrashAlt />
            </button>
          </li>
        )
      )}
    </ul>
  </div>
);

export default GroupsList;
