import React, { useState } from "react";
import { List, User, TaskStatus } from "@/types/kanban";
import KanbanCard from "./KanbanCard";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface KanbanListProps {
  list: List;
  index: number;
  users: User[];
  newCardDetails: any;
  setNewCardDetails: any;
  handleAddCard: (listId: number) => void;
  handleDeleteCard: (cardId: number) => void;
  handleDeleteList: (listId: number) => void;
}

const defaultCardDetail = {
  title: "",
  description: "",
  status: "Not Started" as TaskStatus,
  assignees: [],
};

const KanbanList: React.FC<KanbanListProps> = ({
  list, index, users, newCardDetails, setNewCardDetails,
  handleAddCard, handleDeleteCard, handleDeleteList,
}) => (
  <Draggable draggableId={String(list.id)} index={index} key={list.id}>
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
            onClick={() => handleDeleteList(list.id)}
          >✕</button>
        </div>
        <Droppable droppableId={String(list.id)} type="CARD">
          {(dropProvided, snap) => (
            <div
              ref={dropProvided.innerRef}
              {...dropProvided.droppableProps}
              className={`flex-1 px-3 py-2 space-y-3 min-h-[40px] transition ${snap.isDraggingOver ? "bg-blue-50" : ""}`}
            >
              {list.cards.map((card, j) => (
                <Draggable draggableId={`card-${card.id}`} index={j} key={card.id}>
                  {(cardProvided, snapCard) => (
                    <div
                      ref={cardProvided.innerRef}
                      {...cardProvided.draggableProps}
                      {...cardProvided.dragHandleProps}
                    >
                      <KanbanCard card={card} onDelete={handleDeleteCard} />
                    </div>
                  )}
                </Draggable>
              ))}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
        {/* Add Card Form */}
        <div className="flex flex-col gap-1 p-3 border-t bg-blue-50 rounded-b-2xl">
          <input
            className="border px-2 py-1 rounded text-sm bg-white mb-1"
            placeholder="Title"
            value={newCardDetails[list.id]?.title || ""}
            onChange={e =>
              setNewCardDetails((nc: any) => ({
                ...nc,
                [list.id]: {
                  ...(nc[list.id] || defaultCardDetail),
                  title: e.target.value,
                },
              }))
            }
          />
          <textarea
            className="border px-2 py-1 rounded text-sm bg-white mb-1"
            placeholder="Description"
            value={newCardDetails[list.id]?.description || ""}
            onChange={e =>
              setNewCardDetails((nc: any) => ({
                ...nc,
                [list.id]: {
                  ...(nc[list.id] || defaultCardDetail),
                  description: e.target.value,
                },
              }))
            }
          />
          <select
            className="border px-2 py-1 rounded text-sm bg-white mb-1"
            value={newCardDetails[list.id]?.status || "Not Started"}
            onChange={e =>
              setNewCardDetails((nc: any) => ({
                ...nc,
                [list.id]: {
                  ...(nc[list.id] || defaultCardDetail),
                  status: e.target.value,
                },
              }))
            }
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            className="border px-2 py-1 rounded text-sm bg-white mb-1"
            multiple
            value={newCardDetails[list.id]?.assignees?.map(String) || []}
            onChange={e => {
              const values = Array.from(e.target.selectedOptions).map(o => Number(o.value));
              setNewCardDetails((nc: any) => ({
                ...nc,
                [list.id]: {
                  ...(nc[list.id] || defaultCardDetail),
                  assignees: values,
                },
              }));
            }}
          >
            {users.map((u) => (
              <option value={u.id} key={u.id}>{u.username}</option>
            ))}
          </select>
          <button
            className="bg-blue-600 text-white rounded px-2 text-xs font-semibold hover:bg-blue-700"
            onClick={() => handleAddCard(list.id)}
          >Add Card</button>
        </div>
      </div>
    )}
  </Draggable>
);

export default KanbanList;
