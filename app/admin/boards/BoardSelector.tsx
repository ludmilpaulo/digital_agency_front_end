// components/admin/boards/BoardSelector.tsx
import React from "react";
import { Board } from "@/types/kanban";

interface BoardSelectorProps {
  boards: Board[];
  selectedBoardId: number | null;
  setSelectedBoardId: (id: number) => void;
  handleDeleteBoard: (id: number) => void;
}

const BoardSelector: React.FC<BoardSelectorProps> = ({
  boards,
  selectedBoardId,
  setSelectedBoardId,
  handleDeleteBoard,
}) => (
  <div className="flex flex-wrap gap-2">
    {boards.map((b) => (
      <button
        key={b.id}
        className={`px-4 py-2 rounded-xl font-bold shadow ${
          selectedBoardId === b.id
            ? "bg-blue-700 text-white"
            : "bg-blue-200 text-blue-800"
        } hover:bg-blue-400`}
        onClick={() => setSelectedBoardId(b.id)}
      >
        {b.name}
        <span
          title="Delete board"
          className="ml-2 text-red-400 hover:text-red-700 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteBoard(b.id);
          }}
        >
          ✕
        </span>
      </button>
    ))}
  </div>
);

export default BoardSelector;
