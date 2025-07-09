"use client";
import React, { useState, useEffect } from "react";
import {
  useGetBoardsQuery,
  useAddBoardMutation,
  useDeleteBoardMutation,
  useAddListMutation,
  useDeleteListMutation,
  useAddCardMutation,
  useDeleteCardMutation,
} from "@/redux/services/boardsApi";
import { useGetUsersQuery } from "@/redux/services/usersApi";
import { TaskStatus, Board, User } from "@/types/kanban";
import BoardSelector from "./boards/BoardSelector";
import BoardManagers from "./boards/BoardManagers";
import KanbanBoard from "./boards/KanbanBoard";

const BoardsAdmin: React.FC = () => {
  const { data: boards = [], isLoading, error, refetch } = useGetBoardsQuery();
  const [addBoard] = useAddBoardMutation();
  const [deleteBoard] = useDeleteBoardMutation();
  const [addList] = useAddListMutation();
  const [deleteList] = useDeleteListMutation();
  const [addCard] = useAddCardMutation();
  const [deleteCard] = useDeleteCardMutation();
  const { data: users = [] } = useGetUsersQuery();

  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDesc, setNewBoardDesc] = useState("");
  const [newManagers, setNewManagers] = useState<number[]>([]);
  const [newLists, setNewLists] = useState<Record<number, string>>({});
  const [newCardDetails, setNewCardDetails] = useState<Record<number, any>>({});
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);

  useEffect(() => {
    if (boards.length && (selectedBoardId === null || !boards.some(b => b.id === selectedBoardId))) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards, selectedBoardId]);

  const selectedBoard = boards.find((b) => b.id === selectedBoardId) || boards[0];

  // Prevent deleting completed card
  async function handleDeleteCard(cardId: number) {
    let cardStatus: string | null = null;
    for (const list of selectedBoard.lists) {
      const card = list.cards.find((c) => c.id === cardId);
      if (card) {
        cardStatus = card.status;
        break;
      }
    }
    if (cardStatus === "Completed") {
      alert("Cannot delete a completed card.");
      return;
    }
    await deleteCard(cardId);
    setTimeout(refetch, 400);
  }

  // Board creation includes managers_ids
  async function handleAddBoard() {
    const name = newBoardName.trim();
    const description = newBoardDesc.trim();
    if (!name || !description || !newManagers.length) return;
    await addBoard({ name, description, managers_ids: newManagers });
    setNewBoardName("");
    setNewBoardDesc("");
    setNewManagers([]);
    setTimeout(refetch, 400);
  }
  async function handleDeleteBoard(boardId: number) {
    await deleteBoard(boardId);
    setSelectedBoardId(boards.filter(b => b.id !== boardId)[0]?.id ?? null);
    setTimeout(refetch, 400);
  }
  async function handleAddList(boardId: number) {
    const name = newLists[boardId]?.trim();
    if (!name) return;
    await addList({ name, board: boardId });
    setNewLists((prev) => ({ ...prev, [boardId]: "" }));
    setTimeout(refetch, 400);
  }
  async function handleDeleteList(listId: number) {
    await deleteList(listId);
    setTimeout(refetch, 400);
  }
  async function handleAddCard(listId: number) {
    const details = newCardDetails[listId];
    if (!details?.title?.trim() || !details?.description?.trim()) return;
    await addCard({
      title: details.title,
      description: details.description,
      list: listId,
      status: details.status,
      assignees_ids: details.assignees,
    });
    setNewCardDetails((nc) => ({
      ...nc,
      [listId]: { title: "", description: "", status: "Not Started" as TaskStatus, assignees: [] },
    }));
    setTimeout(refetch, 400);
  }

  if (isLoading) return <div className="p-10 text-lg">Loading...</div>;
  if (error) return <div className="p-10 text-red-500">Error loading boards!</div>;
  if (!boards.length)
    return (
      <div className="p-10 text-gray-400">
        No boards found.<br />
        <div className="flex gap-2 items-center">
          <input className="border px-2 py-1 rounded mr-2" placeholder="New board name" value={newBoardName} onChange={e => setNewBoardName(e.target.value)} />
          <input className="border px-2 py-1 rounded mr-2" placeholder="Board description" value={newBoardDesc} onChange={e => setNewBoardDesc(e.target.value)} />
          <select className="border px-2 py-1 rounded mr-2" multiple value={newManagers.map(String)} onChange={e => setNewManagers(Array.from(e.target.selectedOptions).map(o => Number(o.value)))}>
            {users.map((u: User) => (<option value={u.id} key={u.id}>{u.username}</option>))}
          </select>
          <button className="bg-blue-600 text-white rounded px-4 py-1 text-xs font-semibold hover:bg-blue-700" onClick={handleAddBoard}>Add Board</button>
        </div>
      </div>
    );

  return (
    <div className="p-4">
      {/* Add & Select Board */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <BoardSelector
          boards={boards}
          selectedBoardId={selectedBoard?.id}
          setSelectedBoardId={setSelectedBoardId}
          handleDeleteBoard={handleDeleteBoard}
        />
        <input className="border px-2 py-1 rounded ml-4" placeholder="New board name" value={newBoardName} onChange={e => setNewBoardName(e.target.value)} />
        <input className="border px-2 py-1 rounded ml-2" placeholder="Board description" value={newBoardDesc} onChange={e => setNewBoardDesc(e.target.value)} />
        <select className="border px-2 py-1 rounded ml-2" multiple value={newManagers.map(String)} onChange={e => setNewManagers(Array.from(e.target.selectedOptions).map(o => Number(o.value)))}>
          {users.map((u: User) => (<option value={u.id} key={u.id}>{u.username}</option>))}
        </select>
        <button className="bg-blue-600 text-white rounded px-4 py-1 text-xs font-semibold hover:bg-blue-700" onClick={handleAddBoard}>Add Board</button>
      </div>
      <BoardManagers managers={selectedBoard.managers} />
      <KanbanBoard
        board={selectedBoard}
        users={users}
        newLists={newLists}
        setNewLists={setNewLists}
        newCardDetails={newCardDetails}
        setNewCardDetails={setNewCardDetails}
        handleAddList={handleAddList}
        handleDeleteList={handleDeleteList}
        handleAddCard={handleAddCard}
        handleDeleteCard={handleDeleteCard}
      />
    </div>
  );
};
export default BoardsAdmin;
