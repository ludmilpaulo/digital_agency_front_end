// components/admin/boards/BoardManagers.tsx
import React from "react";
import { User } from "@/types/kanban";

interface BoardManagersProps {
  managers: User[];
  users: User[];
}

const BoardManagers: React.FC<BoardManagersProps> = ({ managers, users }) => {
  const combinedUsers = Array.from(
    new Map([...managers, ...users].map(user => [user.id, user])).values()
  );

  return combinedUsers.length > 0 ? (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 font-bold">Team:</span>
      {combinedUsers.map(user => (
        <span
          key={user.id}
          className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
        >
          {user.username}
        </span>
      ))}
    </div>
  ) : null;
};

export default BoardManagers;
