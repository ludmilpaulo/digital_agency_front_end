import React from "react";
import { Board } from "@/types/kanban";
import { Pencil, Trash2 } from "lucide-react";

interface BoardSelectorProps {
  boards: Board[];
  selectedBoardId: number | null;
  setSelectedBoardId: (id: number) => void;
  handleDeleteBoard: (id: number) => void;
  handleEditBoard: (board: Board) => void;
}

const BoardSelector: React.FC<BoardSelectorProps> = ({
  boards,
  selectedBoardId,
  setSelectedBoardId,
  handleDeleteBoard,
  handleEditBoard,
}) => (
  <div className="flex flex-wrap gap-3 items-center mb-3">
    {boards.map((b) => (
      <div
        key={b.id}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow border-2 transition-all cursor-pointer
          ${selectedBoardId === b.id
            ? "border-blue-600 bg-white text-blue-800"
            : "border-transparent bg-blue-100 text-blue-700 hover:bg-white"
          }`
        }
        style={{ userSelect: "none" }}
        tabIndex={0}
        role="button"
        aria-pressed={selectedBoardId === b.id}
        onClick={() => setSelectedBoardId(b.id)}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") setSelectedBoardId(b.id);
        }}
      >
        <span className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold uppercase text-sm">
          {b.name.slice(0, 2)}
        </span>
        <span className="font-semibold text-base">{b.name}</span>
        {/* Action Buttons */}
        <button
          className="ml-2 text-blue-400 hover:text-blue-700 p-1 rounded-full transition"
          title="Edit board"
          type="button"
          tabIndex={-1}
          onClick={e => {
            e.stopPropagation();
            handleEditBoard(b);
          }}
        >
          <Pencil size={16} />
        </button>
        <button
          className="ml-1 text-red-400 hover:text-red-700 p-1 rounded-full transition"
          title="Delete board"
          type="button"
          tabIndex={-1}
          onClick={e => {
            e.stopPropagation();
            handleDeleteBoard(b.id);
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    ))}
  </div>
);

export default BoardSelector;
