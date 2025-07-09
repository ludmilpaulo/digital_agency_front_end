import React from "react";
import { User } from "@/types/kanban";

const BoardManagers: React.FC<{ managers: User[] }> = ({ managers }) =>
  managers && managers.length > 0 ? (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-xs text-gray-500 font-bold">Managers:</span>
      {managers.map((mgr: User) => (
        <span
          key={mgr.id}
          className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mr-1"
        >{mgr.username}</span>
      ))}
    </div>
  ) : null;
export default BoardManagers;
