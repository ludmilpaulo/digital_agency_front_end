import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Group } from "@/types/groups";
import { User } from "@/types/groups";
import { FaTrashAlt, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

interface Props {
  group: Group;
  members: User[];
  onUserDrop: (user: User, group: Group) => void;
  selected: boolean;
  onSelect: () => void;
  onEditName: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
  onRemoveUser: (userId: number, groupId: number) => void;
}
export default function GroupBox({
  group,
  members,
  onUserDrop,
  selected,
  onSelect,
  onEditName,
  onDelete,
  onRemoveUser,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<{ id: number }, void, unknown>({
    accept: "USER",
    drop: (item) => {
      const user = members.find((u) => u.id === item.id);
      if (!user) return;
      onUserDrop(user, group);
    },
  });
  drop(ref);

  // Edit name state
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(group.name);

  const saveEdit = () => {
    if (newName.trim() && newName.trim() !== group.name) {
      onEditName(group.id, newName.trim());
    }
    setEditing(false);
  };

  return (
    <div
      ref={ref}
      className={`rounded-2xl shadow-lg p-4 mb-4 border-2 bg-white cursor-pointer transition
        ${selected ? "border-blue-600 ring-2 ring-blue-200" : "border-blue-100"}
      `}
      onClick={onSelect}
      style={{ minHeight: 160 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg text-blue-800">
          {editing ? (
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border rounded px-2 py-0.5"
              autoFocus
              onBlur={saveEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") setEditing(false);
              }}
            />
          ) : (
            group.name
          )}
        </span>
        <span className="flex gap-2 items-center">
          {editing ? (
            <>
              <button className="text-green-600" onClick={saveEdit} title="Save"><FaCheck /></button>
              <button className="text-gray-400" onClick={() => setEditing(false)} title="Cancel"><FaTimes /></button>
            </>
          ) : (
            <>
              <button
                className="text-blue-400 hover:text-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                }}
                title="Edit group"
              >
                <FaEdit />
              </button>
              <button
                className="text-red-400 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Delete this group?")) onDelete(group.id);
                }}
                title="Delete group"
              >
                <FaTrashAlt />
              </button>
            </>
          )}
        </span>
      </div>
      <div>
        {members.length === 0 && (
          <div className="text-gray-400 text-xs">No members</div>
        )}
        {members.map((user) => (
          <div key={user.id} className="flex items-center gap-2 py-1 border-b last:border-0">
            <span className="font-semibold text-blue-700">{user.username}</span>
            <span className="text-xs text-gray-400">{user.email}</span>
            <button
              className="ml-auto text-red-400 hover:text-red-700"
              title="Remove user from group"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveUser(user.id, group.id);
              }}
            >
              <FaTrashAlt size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
