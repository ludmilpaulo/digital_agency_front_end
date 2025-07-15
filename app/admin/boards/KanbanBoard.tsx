import React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Board, User } from "@/types/kanban";
import ListColumn from "./ListColumn";

interface KanbanBoardProps {
  board: Board;
  users: User[];
  newLists: Record<number, string>;
  setNewLists: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  newCardDetails: Record<number, any>;
  setNewCardDetails: React.Dispatch<React.SetStateAction<Record<number, any>>>;
  handleAddList: (boardId: number) => void;
  handleDeleteList: (listId: number) => void;
  handleAddCard: (listId: number) => void;
  handleDeleteCard: (cardId: number) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  board,
  users,
  newLists,
  setNewLists,
  newCardDetails,
  setNewCardDetails,
  handleAddList,
  handleDeleteList,
  handleAddCard,
  handleDeleteCard,
}) => {
  const onDragEnd = (_result: DropResult) => {};

  // Ensure the object is initialized properly
  const currentListInput = newLists?.[board.id] || "";

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
        {(provided) => (
          <div
            className="flex gap-5 overflow-x-auto pb-8"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {board.lists.map((list) => (
              <ListColumn
                key={list.id}
                list={list}
                boardUsers={board.users}
                newCardDetails={newCardDetails}
                setNewCardDetails={setNewCardDetails}
                handleAddCard={handleAddCard}
                handleDeleteCard={handleDeleteCard}
                handleDeleteList={handleDeleteList}
              />
            ))}
            {provided.placeholder}
            
            {/* Add List */}
            <div className="w-80 flex-shrink-0 flex flex-col justify-center items-center bg-gradient-to-tr from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-dashed border-blue-400">
              <input
                className="border px-2 py-1 rounded w-full mb-2 text-sm bg-white"
                placeholder="Add list"
                value={currentListInput}
                onChange={(e) =>
                  setNewLists((prev = {}) => ({
                    ...prev,
                    [board.id]: e.target.value,
                  }))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" ? handleAddList(board.id) : undefined
                }
              />
              <button
                className="bg-blue-600 text-white rounded px-4 py-1 text-xs font-semibold hover:bg-blue-700"
                onClick={() => handleAddList(board.id)}
              >
                Add List
              </button>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;
