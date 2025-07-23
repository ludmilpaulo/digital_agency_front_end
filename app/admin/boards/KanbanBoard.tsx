import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Board, User, Card, List } from "@/types/kanban";
import ListColumn from "./ListColumn";
import { Plus } from "lucide-react";

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
  onEditCard?: (card: Card, listId: number) => void; // Optional, for card editing modal
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
  onEditCard,
}) => {
  // Optional: implement this for persistence
  const onDragEnd = (result: DropResult) => {
    // Example: handle drag-and-drop persistence (lists/cards reordering)
    // if (!result.destination) return;
    // If needed, call your API to update order here.
  };

  const currentListInput = newLists?.[board.id] || "";

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
        {(provided) => (
          <div
            className="flex gap-6 overflow-x-auto pb-8 scroll-smooth snap-x"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {board.lists.map((list, idx) => (
              <Draggable draggableId={`list-${list.id}`} index={idx} key={list.id}>
                {(dragProvided) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className="snap-start"
                  >
                    <ListColumn
                      list={list}
                      boardUsers={board.users}
                      newCardDetails={newCardDetails}
                      setNewCardDetails={setNewCardDetails}
                      handleAddCard={handleAddCard}
                      handleDeleteCard={handleDeleteCard}
                      handleDeleteList={handleDeleteList}
                      onEditCard={onEditCard || (() => {})}
                      dragHandleProps={dragProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {/* Add List */}
            <div className="w-80 min-w-[320px] flex-shrink-0 flex flex-col justify-center items-center bg-gradient-to-tr from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-dashed border-blue-400">
              <input
                className="border px-2 py-1 rounded-xl w-full mb-2 text-sm bg-white"
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
                className="bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-blue-700 flex items-center gap-1"
                onClick={() => handleAddList(board.id)}
              >
                <Plus className="w-4 h-4" /> Add List
              </button>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;
