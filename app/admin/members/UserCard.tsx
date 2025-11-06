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
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  showActions?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  groups,
  draggable = false,
  onRemove,
  onEdit,
  onDelete,
  showActions = false,
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

  const fullName = user.profile?.full_name || 
    (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username);
  const jobTitle = user.profile?.job_title || user.job_title;
  const department = user.profile?.department || user.department;

  return (
    <div
      ref={draggable ? (drag as unknown as React.Ref<HTMLDivElement>) : undefined}
      className={`flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 rounded-lg shadow-sm border border-blue-200 hover:shadow-md
        ${isDragging ? "opacity-40" : ""}
        transition-all duration-200 mb-2`}
      style={{ cursor: draggable ? "grab" : "default" }}
    >
      {/* Avatar/Initial */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
          {fullName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-gray-800 truncate">{fullName}</div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="truncate">{user.email}</span>
          {jobTitle && (
            <>
              <span className="text-gray-300">•</span>
              <span className="font-medium text-blue-600 truncate">{jobTitle}</span>
            </>
          )}
          {department && (
            <>
              <span className="text-gray-300">•</span>
              <span className="truncate">{department}</span>
            </>
          )}
        </div>
      </div>

      {/* Group tags */}
      {groups.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {groups.map((g) => (
            <span
              key={g.id}
              className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 font-medium shadow-sm"
            >
              {g.name}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="ml-auto flex items-center gap-2">
        {showActions && onEdit && (
          <button
            onClick={() => onEdit(user)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition"
            title="Edit user"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        
        {showActions && onDelete && (
          <button
            onClick={() => onDelete(user)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
            title="Delete user"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
        
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-red-400 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition"
            title="Remove from group"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
