"use client";
import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { List, User, Card, TaskStatus } from "@/types/kanban";
import CardItem from "./CardItem";
import CardAddForm from "./CardAddForm";
import { Pencil, Trash2 } from "lucide-react";

interface CardDetails {
  title: string;
  description: string;
  status: TaskStatus;
  assignees: number[];
}

interface ListColumnProps {
  list: List;
  boardUsers: User[];
  newCardDetails: Record<number, CardDetails>;
  setNewCardDetails: React.Dispatch<React.SetStateAction<Record<number, CardDetails>>>;
  handleAddCard: (listId: number) => void;
  handleDeleteCard: (cardId: number) => void;
  handleDeleteList: (listId: number) => void;
  onEditCard: (card: Card, listId: number) => void;
  dragHandleProps?: any;
}

const ListColumn: React.FC<ListColumnProps> = ({
  list,
  boardUsers,
  newCardDetails,
  setNewCardDetails,
  handleAddCard,
  handleDeleteCard,
  handleDeleteList,
  onEditCard,
  dragHandleProps,
}) => {
  // Always typed, no "any"
  const cardDetails: CardDetails = newCardDetails?.[list.id] || {
    title: "",
    description: "",
    status: "Not Started",
    assignees: [],
  };

  // Wrap handleAddCard to reset fields after adding
  const handleAddAndReset = (listId: number) => {
    handleAddCard(listId);
    // Always reset the state after add!
    setNewCardDetails(prev => ({
      ...prev,
      [listId]: { title: "", description: "", status: "Not Started", assignees: [] },
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-80 min-h-[220px] flex-shrink-0 flex flex-col border-2 border-blue-200/70 relative group transition-all hover:shadow-blue-200">
      <div
        className="p-4 border-b flex justify-between items-center font-bold text-blue-900 bg-gradient-to-r from-blue-100 to-blue-50 rounded-t-2xl"
        {...dragHandleProps}
      >
        <span>{list.name}</span>
        <div className="flex gap-2">
          <button
            className="text-xs text-red-400 hover:text-red-600"
            title="Delete list"
            onClick={e => {
              e.stopPropagation();
              handleDeleteList(list.id);
            }}
            type="button"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <Droppable droppableId={String(list.id)} type="CARD">
        {(dropProvided, snap) => (
          <div
            ref={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            className={`flex-1 px-3 py-2 space-y-3 min-h-[40px] transition ${snap.isDraggingOver ? "bg-blue-50" : ""}`}
          >
            {list.cards.map(card => (
              <div key={card.id} className="relative group">
                <div
                  className="cursor-pointer"
                  onClick={() => onEditCard(card, list.id)}
                >
                  <CardItem
                    card={card}
                    handleDeleteCard={handleDeleteCard}
                  />
                </div>
                <button
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white text-blue-400 hover:text-blue-600 rounded-full p-1 shadow transition"
                  title="Edit card"
                  onClick={e => {
                    e.stopPropagation();
                    onEditCard(card, list.id);
                  }}
                  type="button"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ))}
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
      <CardAddForm
        listId={list.id}
        boardUsers={boardUsers}
        details={cardDetails}
        setDetails={d =>
          setNewCardDetails(prev => ({
            ...prev,
            [list.id]: d,
          }))
        }
        handleAddCard={handleAddAndReset}
      />
    </div>
  );
};

export default ListColumn;
