// app/admin/members/BulkAssignModal.tsx
import React from "react";
import { Group } from "@/redux/services/groupsApi";
import { FaUserCheck, FaTimes } from "react-icons/fa";
import { User } from "@/redux/services/usersApi";

interface BulkAssignModalProps {
  users: User[];
  groups: Group[];
  selectedUserIds: number[];
  setSelectedUserIds: (ids: number[]) => void;
  selectedGroupIds: number[];
  setSelectedGroupIds: (ids: number[]) => void;
  onClose: () => void;
  onAssign: () => void;
}

const BulkAssignModal: React.FC<BulkAssignModalProps> = ({
  users,
  groups,
  selectedUserIds,
  setSelectedUserIds,
  selectedGroupIds,
  setSelectedGroupIds,
  onClose,
  onAssign,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
        <button className="absolute top-3 right-4 text-gray-500 hover:text-red-600" onClick={onClose}>
          <FaTimes size={18} />
        </button>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaUserCheck className="text-blue-600" /> Bulk Assign Users to Groups
        </h3>
        <div className="mb-4">
          <div className="font-bold text-blue-800 mb-1">Users:</div>
          <div className="flex flex-wrap gap-2">
            {users.map((u) => (
              <label key={u.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(u.id)}
                  onChange={() =>
                    setSelectedUserIds(
                      selectedUserIds.includes(u.id)
                        ? selectedUserIds.filter(id => id !== u.id)
                        : [...selectedUserIds, u.id]
                    )
                  }
                />
                <span>{u.username}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <div className="font-bold text-blue-800 mb-1">Groups:</div>
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <label key={`${g.type}-${g.id}`} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedGroupIds.includes(g.id)}
                  onChange={() =>
                    setSelectedGroupIds(
                      selectedGroupIds.includes(g.id)
                        ? selectedGroupIds.filter(id => id !== g.id)
                        : [...selectedGroupIds, g.id]
                    )
                  }
                />
                <span>{g.name}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          disabled={selectedUserIds.length === 0 || selectedGroupIds.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
          onClick={onAssign}
        >
          Assign
        </button>
      </div>
    </div>
  );
};

export default BulkAssignModal;
