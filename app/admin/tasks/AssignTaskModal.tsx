// AssignTaskModal.tsx
import React, { useState } from "react";
import { useAssignTaskToUserMutation } from "@/redux/services/tasksApi"; // update to your actual mutation

interface AssignTaskModalProps {
  cardId: number;
  onClose: () => void;
}

export default function AssignTaskModal({ cardId, onClose }: AssignTaskModalProps) {
  const [userIds, setUserIds] = useState<number[]>([]);
  const [assignTask, { isLoading }] = useAssignTaskToUserMutation();

  const handleAssign = async () => {
    await assignTask({ cardId, userIds }).unwrap();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-5 w-80">
        <div className="font-bold mb-2">Assign Users</div>
        {/* Your users dropdown here */}
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded mt-3"
          onClick={handleAssign}
          disabled={isLoading}
        >
          Assign
        </button>
        <button
          className="ml-2 bg-gray-300 px-3 py-1 rounded"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
