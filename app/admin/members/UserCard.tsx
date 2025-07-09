// app/admin/members/UserCard.tsx
import React from "react";
import { useDrag } from "react-dnd";
import { User } from "@/redux/services/usersApi";
import { Group } from "@/redux/services/groupsApi";
import { FaTimes } from "react-icons/fa";

interface UserCardProps {
  user: User;
  groups: Group[];
  draggable?: boolean;
  onRemove?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  groups,
  draggable = false,
  onRemove,
}) => {
  // react-dnd drag source
  const [{ isDragging }, drag] = useDrag<
    { userId: number },
    void,
    { isDragging: boolean }
  >({
    type: "USER",
    item: { userId: user.id },
    canDrag: draggable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={draggable ? (drag as unknown as React.Ref<HTMLDivElement>) : undefined}
      className={`flex items-center gap-3 bg-blue-50 px-3 py-2 rounded shadow border
        ${isDragging ? "opacity-40" : ""}
        transition mb-1`}
      style={{ cursor: draggable ? "grab" : "default" }}
    >
      <div className="font-bold text-blue-800 truncate max-w-[90px]">{user.username}</div>
      <span className="text-xs text-gray-400 truncate">{user.email}</span>
      {/* Group tags */}
      <div className="flex gap-1 flex-wrap">
        {groups.map((g) => (
          <span
            key={g.id}
            className={`bg-blue-200 text-blue-800 text-xs rounded px-2 py-0.5 font-medium`}
          >
            {g.name}
          </span>
        ))}
      </div>
      {/* Remove from group button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-auto text-red-400 hover:text-red-700"
          title="Remove from group"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default UserCard;
