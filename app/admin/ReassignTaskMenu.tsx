import { User } from "@/types/groups";
import React, { useState } from "react";


interface ReassignTaskMenuProps {
  cardId: string;
  users: User[];
  assignedTo: number[];
  onAssign: (cardId: string, userIds: number[]) => void;
}
export default function ReassignTaskMenu({
  cardId,
  users,
  assignedTo,
  onAssign,
}: ReassignTaskMenuProps) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<number[]>(assignedTo);

  function handleApply() {
    onAssign(cardId, selection);
    setOpen(false);
  }
  return (
    <div className="relative inline-block">
      <button
        className="ml-2 px-2 py-0.5 bg-blue-200 text-xs rounded hover:bg-blue-300"
        onClick={e => {
          e.stopPropagation();
          setOpen(o => !o);
        }}
        type="button"
      >
        Reassign
      </button>
      {open && (
        <div className="absolute z-50 bg-white border rounded shadow p-3 w-44 right-0 top-8">
          <div className="mb-2 font-bold text-blue-800 text-xs">Assign users</div>
          <select
            className="border rounded px-1 py-1 w-full"
            multiple
            value={selection.map(String)}
            onChange={e =>
              setSelection(Array.from(e.target.selectedOptions).map(opt => Number(opt.value)))
            }
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <button
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 text-xs font-bold w-full"
            onClick={handleApply}
            type="button"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
