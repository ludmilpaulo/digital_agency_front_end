import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { List, User } from "@/types/kanban";
import CardItem from "./CardItem";
import CardAddForm from "./CardAddForm";

interface ListColumnProps {
  list: List;
  boardUsers: User[];
  newCardDetails: Record<number, any>;
  setNewCardDetails: React.Dispatch<React.SetStateAction<Record<number, any>>>;
  handleAddCard: (listId: number) => void;
  handleDeleteCard: (cardId: number) => void;
  handleDeleteList: (listId: number) => void;
}

const ListColumn: React.FC<ListColumnProps> = ({
  list,
  boardUsers,
  newCardDetails,
  setNewCardDetails,
  handleAddCard,
  handleDeleteCard,
  handleDeleteList,
}) => {
  // Safely initialize details
  const cardDetails = newCardDetails?.[list.id] || {
    title: "",
    description: "",
    status: "Not Started",
    assignees: [],
  };

  return (
    <Draggable
      draggableId={String(list.id)}
      index={list.id}
      disableInteractiveElementBlocking={true}
    >
      {(listProvided) => (
        <div
          ref={listProvided.innerRef}
          {...listProvided.draggableProps}
          className="bg-white rounded-2xl shadow-xl w-80 min-h-[220px] flex-shrink-0 flex flex-col border-2 border-blue-200 relative group"
        >
          <div
            className="p-4 border-b flex justify-between items-center font-bold text-blue-900 bg-gradient-to-r from-blue-100 to-blue-50 rounded-t-2xl"
            {...listProvided.dragHandleProps}
          >
            <span>{list.name}</span>
            <button
              className="ml-2 text-xs text-red-400 hover:text-red-600"
              title="Delete list"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteList(list.id);
              }}
            >
              ✕
            </button>
          </div>
          <Droppable droppableId={String(list.id)} type="CARD">
            {(dropProvided, snap) => (
              <div
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                className={`flex-1 px-3 py-2 space-y-3 min-h-[40px] transition ${
                  snap.isDraggingOver ? "bg-blue-50" : ""
                }`}
              >
                {list.cards.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    handleDeleteCard={handleDeleteCard}
                  />
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>

          <CardAddForm
            listId={list.id}
            boardUsers={boardUsers}
            details={cardDetails}
            setDetails={(d) =>
              setNewCardDetails((prev = {}) => ({
                ...prev,
                [list.id]: d,
              }))
            }
            handleAddCard={handleAddCard}
          />
        </div>
      )}
    </Draggable>
  );
};

export default ListColumn;
