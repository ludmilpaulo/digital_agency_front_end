import React from "react";
import { TaskStatus, User } from "@/types/kanban";

interface CardAddFormProps {
  listId: number;
  boardUsers: User[];
  details: {
    title: string;
    description: string;
    status: TaskStatus;
    assignees: number[];
  };
  setDetails: (d: any) => void;
  handleAddCard: (listId: number) => void;
}
const CardAddForm: React.FC<CardAddFormProps> = ({
  listId, boardUsers, details, setDetails, handleAddCard
}) => (
  <div className="flex flex-col gap-1 p-3 border-t bg-blue-50 rounded-b-2xl">
    <input
      className="border px-2 py-1 rounded text-sm bg-white mb-1"
      placeholder="Title"
      value={details.title}
      onChange={e => setDetails({ ...details, title: e.target.value })}
    />
    <textarea
      className="border px-2 py-1 rounded text-sm bg-white mb-1"
      placeholder="Description"
      value={details.description}
      onChange={e => setDetails({ ...details, description: e.target.value })}
    />
    <select
      className="border px-2 py-1 rounded text-sm bg-white mb-1"
      value={details.status}
      onChange={e => setDetails({ ...details, status: e.target.value })}
    >
      <option value="Not Started">Not Started</option>
      <option value="In Progress">In Progress</option>
      <option value="Completed">Completed</option>
    </select>
    <select
      className="border px-2 py-1 rounded text-sm bg-white mb-1"
      multiple
      value={details.assignees.map(String)}
      onChange={e => {
        const values = Array.from(e.target.selectedOptions).map(o => Number(o.value));
        setDetails({ ...details, assignees: values });
      }}
    >
      {boardUsers.map((u: User) => (
        <option value={u.id} key={u.id}>{u.username}</option>
      ))}
    </select>
    <button
      className="bg-blue-600 text-white rounded px-2 text-xs font-semibold hover:bg-blue-700"
      onClick={() => handleAddCard(listId)}
    >Add Card</button>
  </div>
);
export default CardAddForm;
