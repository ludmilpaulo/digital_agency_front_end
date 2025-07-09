import React from "react";
import { Card } from "@/types/kanban";

interface KanbanCardProps {
  card: Card;
  onDelete: (id: number) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ card, onDelete }) => (
  <div className="bg-blue-100 p-3 rounded-lg shadow hover:shadow-lg transition mb-2 cursor-pointer flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="font-medium text-blue-900">{card.title}</span>
      <button
        className="ml-2 text-xs text-red-400 hover:text-red-600"
        title="Delete card"
        onClick={() => onDelete(card.id)}
      >✕</button>
    </div>
    <div className="text-xs text-gray-600 mt-1">{card.description}</div>
    {card.assignees.length > 0 && (
      <div className="flex gap-1 flex-wrap mt-1">
        {card.assignees.map((user) => (
          <span
            key={user.id}
            className="inline-block px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold"
          >{user.username}</span>
        ))}
      </div>
    )}
    <div className="flex gap-2 mt-1">
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        card.status === "Completed"
          ? "bg-green-200 text-green-800"
          : card.status === "In Progress"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-gray-100 text-gray-700"
      }`}>
        {card.status}
      </span>
      {card.start_date && card.due_date && (
        <span className="text-xs text-gray-500">
          {card.start_date} → {card.due_date}
        </span>
      )}
    </div>
  </div>
);

export default KanbanCard;
