import React from "react";
import { Card } from "@/types/kanban";

const CardItem: React.FC<{
  card: Card;
  handleDeleteCard: (id: number) => void;
}> = ({ card, handleDeleteCard }) => (
  <div
    className={`bg-blue-100 p-3 rounded-lg shadow hover:shadow-lg transition mb-2 cursor-pointer flex flex-col gap-2 ${
      card.status === "Completed" ? "opacity-60" : ""
    }`}
  >
    <div className="flex items-center justify-between">
      <span className="font-medium text-blue-900">{card.title}</span>
      {card.status !== "Completed" && (
        <button
          className="ml-2 text-xs text-red-400 hover:text-red-600"
          title="Delete card"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCard(card.id);
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          ✕
        </button>
      )}
    </div>
    <div className="text-xs text-blue-700 mb-1">{card.description}</div>
    {card.assignees && card.assignees.length > 0 && (
      <div className="flex gap-1 flex-wrap mt-1">
        {card.assignees.map((user) => (
          <span
            key={user.id}
            className="inline-block px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold"
          >
            {user.username}
          </span>
        ))}
      </div>
    )}
    <div className="flex gap-2 mt-2">
      <span className="bg-gray-200 px-2 rounded text-xs">{card.status}</span>
      {card.due_date && (
        <span className="bg-yellow-100 px-2 rounded text-xs">Due: {card.due_date}</span>
      )}
    </div>
  </div>
);

export default CardItem;
