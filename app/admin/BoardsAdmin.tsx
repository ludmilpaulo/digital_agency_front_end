"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";
import {
  useGetBoardsQuery,
  useAddBoardMutation,
  useEditBoardMutation,
  useDeleteBoardMutation,
  useAddListMutation,
  useDeleteListMutation,
  useAddCardMutation,
  useDeleteCardMutation,
  // useEditCardMutation,
} from "@/redux/services/boardsApi";
import { useGetUsersQuery } from "@/redux/services/usersApi";
import BoardSelector from "./boards/BoardSelector";
import ListColumn from "./boards/ListColumn";
import BoardModal from "./boards/BoardModal";
import CardEditModal from "./boards/CardEditModal";
import { PlusCircle, Grid, LayoutList, Filter, User as UserIcon } from "lucide-react";
import { Board, User, Card, TaskStatus } from "@/types/kanban";
import type { BoardFields } from "@/types/kanban";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

export const initialBoardFields: BoardFields = {
  name: "",
  description: "",
  development_link: "",
  repository_link: "",
  client_link: "",
  sample_link: "",
  managers_ids: [],
  users_ids: [],
  budget: "",
  deadline: "",
  start_date: "",
  end_date: "",
  status: "Started",
};

type TabKey = "my" | "all" | "filter";
const TAB_CONFIG: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "my", label: "My Boards", icon: <Grid className="w-4 h-4 mr-1" /> },
  { key: "all", label: "All Boards", icon: <LayoutList className="w-4 h-4 mr-1" /> },
  { key: "filter", label: "Filter", icon: <Filter className="w-4 h-4 mr-1" /> },
];

type CardDetails = {
  title: string;
  description: string;
  status: TaskStatus;
  assignees: number[];
};

const BoardsAdmin: React.FC = () => {
  const user = useSelector(selectUser);
  const currentUserId = user?.user_id ?? null;

  // Tabs, filters, selection
  const [activeTab, setActiveTab] = useState<TabKey>("my");
  const [filterText, setFilterText] = useState("");
  const [filterUser, setFilterUser] = useState<number | "">("");
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);

  // Board modal
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [boardModalMode, setBoardModalMode] = useState<"add" | "edit">("add");
  const [boardFields, setBoardFields] = useState<BoardFields>({ ...initialBoardFields });
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  // Card modal state (for add/edit via modal only!)
  const [cardEdit, setCardEdit] = useState<{
    card: Card | null;
    listId: number | null;
    mode: "add" | "edit" | null;
    show: boolean;
  }>({
    card: null,
    listId: null,
    mode: null,
    show: false,
  });

  // New list/card state
  const [newLists, setNewLists] = useState<Record<number, string>>({});
  const [newCardDetails, setNewCardDetails] = useState<Record<number, CardDetails>>({});

  // Users
  const { data: users = [] } = useGetUsersQuery();

  // API params
  const apiParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (activeTab === "my" && currentUserId) params.user_id = currentUserId;
    if (activeTab === "filter") {
      if (filterText.trim()) params.search = filterText.trim();
      if (filterUser) params.manager_id = filterUser;
    }
    return params;
  }, [activeTab, currentUserId, filterText, filterUser]);

  // Boards API
  const {
    data: boards = [],
    isLoading,
    error,
    refetch,
  } = useGetBoardsQuery(apiParams);

  // Mutations
  const [addBoard] = useAddBoardMutation();
  const [editBoard] = useEditBoardMutation();
  const [deleteBoard] = useDeleteBoardMutation();
  const [addList] = useAddListMutation();
  const [deleteList] = useDeleteListMutation();
  const [addCard] = useAddCardMutation();
  const [deleteCard] = useDeleteCardMutation();
  // const [editCard] = useEditCardMutation();

  // Board selection effect
  useEffect(() => {
    if (boards.length && (selectedBoardId === null || !boards.some((b) => b.id === selectedBoardId))) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards, selectedBoardId]);

  const selectedBoard = boards.find((b) => b.id === selectedBoardId) || null;

  // Modal logic
  function handleOpenAddBoard() {
    setBoardModalMode("add");
    setBoardFields({ ...initialBoardFields });
    setShowBoardModal(true);
  }
  function handleOpenEditBoard(board: Board) {
    setBoardModalMode("edit");
    setBoardFields({
      ...initialBoardFields,
      ...board,
      budget: board.budget?.toString() || "",
      managers_ids: board.managers.map((m) => m.id),
      users_ids: board.users.map((u) => u.id),
    });
    setEditingBoard(board);
    setShowBoardModal(true);
  }
  async function handleSubmitBoard() {
    if (boardModalMode === "add") {
      try {
        await addBoard({
          ...boardFields,
          description: boardFields.description || "Board description",
          managers_ids: Array.isArray(boardFields.managers_ids) ? boardFields.managers_ids : [],
          users_ids: Array.isArray(boardFields.users_ids) ? boardFields.users_ids : [],
          budget: boardFields.budget ? Number(boardFields.budget) : 0,
        }).unwrap();
        setShowBoardModal(false);
        setBoardFields({ ...initialBoardFields });
        setTimeout(refetch, 500);
      } catch (err: any) {
        alert(
          err?.data?.detail ||
          "Failed to add board. Make sure all fields are filled and you selected at least one manager."
        );
      }
    } else if (editingBoard) {
      try {
        await editBoard({
          id: editingBoard.id,
          ...boardFields,
          description: boardFields.description || "Board description",
          managers_ids: Array.isArray(boardFields.managers_ids) ? boardFields.managers_ids : [],
          users_ids: Array.isArray(boardFields.users_ids) ? boardFields.users_ids : [],
          budget: boardFields.budget ? Number(boardFields.budget) : 0,
          deadline: boardFields.deadline || undefined,
          start_date: boardFields.start_date || undefined,
          end_date: boardFields.end_date || undefined,
        }).unwrap();
        setShowBoardModal(false);
        setEditingBoard(null);
        setBoardFields({ ...initialBoardFields });
        setTimeout(refetch, 500);
      } catch (err: any) {
        alert(
          err?.data?.detail ||
          "Failed to update board. Make sure all fields are filled and you selected at least one manager."
        );
      }
    }
  }
  async function handleDeleteBoard(boardId: number) {
    try {
      await deleteBoard(boardId).unwrap();
      setSelectedBoardId((prev) =>
        boards.length > 1 ? boards.filter((b) => b.id !== boardId)[0]?.id ?? null : null
      );
      setTimeout(refetch, 400);
    } catch (err) {
      alert("Failed to delete board");
    }
  }

  // Quick status update function
  async function handleUpdateBoardStatus(boardId: number, status: string) {
    try {
      const board = boards.find(b => b.id === boardId);
      if (!board) return;
      
      const updateData = {
        id: boardId,
        name: board.name,
        description: board.description,
        development_link: board.development_link || "",
        repository_link: board.repository_link || "",
        client_link: board.client_link || "",
        sample_link: board.sample_link || "",
        managers_ids: board.managers.map(m => m.id),
        users_ids: board.users.map(u => u.id),
        budget: board.budget || 0,
        deadline: board.deadline || undefined,
        start_date: board.start_date || undefined,
        end_date: board.end_date || undefined,
        status: status,
      };
      
      console.log("[handleUpdateBoardStatus] Sending data:", updateData);
      
      await editBoard(updateData).unwrap();
      setTimeout(refetch, 300);
    } catch (err: any) {
      console.error("Failed to update board status:", err);
      alert(`Failed to update board status: ${err?.data?.detail || err?.message || 'Unknown error'}`);
    }
  }

  // --- List & Card logic ---
  async function handleAddList(boardId: number) {
    const name = newLists[boardId]?.trim();
    if (!name) return;
    try {
      await addList({ name, board: boardId }).unwrap();
      setNewLists((prev) => ({ ...prev, [boardId]: "" }));
      setTimeout(refetch, 400);
    } catch (e) {
      alert("Failed to add list.");
    }
  }
  async function handleDeleteList(listId: number) {
    try {
      await deleteList(listId).unwrap();
      setTimeout(refetch, 400);
    } catch (e) {
      alert("Failed to delete list.");
    }
  }
  // Inline Add Card (per-list)
  async function handleAddCard(listId: number) {
    const details = newCardDetails[listId];
    if (!details?.title?.trim() || !details?.description?.trim()) return;
    try {
      await addCard({
        title: details.title,
        description: details.description,
        list: listId,
        status: details.status || "Not Started",
        assignees_ids: details.assignees || [],
      }).unwrap();
      setNewCardDetails((nc) => ({
        ...nc,
        [listId]: { title: "", description: "", status: "Not Started", assignees: [] },
      }));
      setTimeout(refetch, 400);
    } catch (e) {
      alert("Failed to add card.");
    }
  }
  async function handleDeleteCard(cardId: number) {
    try {
      await deleteCard(cardId).unwrap();
      setTimeout(refetch, 400);
    } catch (e) {
      alert("Failed to delete card.");
    }
  }
  // Modal Card Add/Edit
  async function handleEditCardSubmit(fields: CardDetails) {
    if (!cardEdit.card) return;
    // await editCard({ id: cardEdit.card.id, ...fields, list: cardEdit.listId }).unwrap();
    setCardEdit({ card: null, listId: null, mode: null, show: false });
    setTimeout(refetch, 500);
  }
  async function handleAddCardFromModal(fields: CardDetails) {
    if (!cardEdit.listId) return;
    await addCard({
      ...fields,
      list: cardEdit.listId,
      status: fields.status || "Not Started",
      assignees_ids: fields.assignees || [],
    }).unwrap();
    setCardEdit({ card: null, listId: null, mode: null, show: false });
    setTimeout(refetch, 400);
  }
  // Open modal for edit card
  function openEditCard(card: Card, listId: number) {
    setCardEdit({
      card,
      listId,
      mode: "edit",
      show: true,
    });
  }

  // Open modal for adding card (not used inline in this UI, but demo)
  function openAddCardModal(listId: number) {
    setCardEdit({
      card: null,
      listId,
      mode: "add",
      show: true,
    });
  }

  // Drag and Drop logic (future, placeholder)
  const handleDragEnd = (result: DropResult) => {};

  // --- Render ---
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-2 md:p-4 max-w-7xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-4">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 md:px-6 rounded-t-xl font-bold border-b-2 transition flex items-center
              ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-700 bg-blue-50"
                  : "border-transparent text-gray-400 hover:text-blue-500 hover:bg-blue-50"
              }`}
              type="button"
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          <button
            onClick={handleOpenAddBoard}
            className="ml-auto px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow flex items-center gap-1"
            type="button"
          >
            <PlusCircle className="w-4 h-4" /> Add Board
          </button>
        </div>
        {/* Filter Inputs */}
        {activeTab === "filter" && (
          <div className="flex flex-col md:flex-row gap-3 mb-4 items-center">
            <input
              type="text"
              className="border p-2 rounded w-full max-w-xs"
              placeholder="Search board by name..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <div className="flex items-center gap-2 w-full max-w-xs">
              <UserIcon className="w-4 h-4 text-blue-400" />
              <select
                className="border px-2 py-2 rounded w-full"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">All users</option>
                {users.map((u: User) => (
                  <option value={u.id} key={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {isLoading && <div className="text-center my-10">Loading...</div>}
        {error && <div className="text-red-500 text-center my-10">Error loading boards</div>}
        {!isLoading && !error && boards.length > 0 && (
          <BoardSelector
            boards={boards}
            selectedBoardId={selectedBoardId}
            setSelectedBoardId={setSelectedBoardId}
            handleDeleteBoard={handleDeleteBoard}
            handleEditBoard={handleOpenEditBoard}
            handleUpdateBoardStatus={handleUpdateBoardStatus}
          />
        )}
        {selectedBoard && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-bold">Team:</span>
            {[
              ...selectedBoard.managers,
              ...selectedBoard.users.filter((u) => !selectedBoard.managers.some((m) => m.id === u.id)),
            ].map((user) => (
              <span
                key={user.id}
                className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mr-1"
              >
                {user.username}
              </span>
            ))}
          </div>
        )}
        {selectedBoard ? (
          <div className="flex gap-6 overflow-x-auto pb-8 scroll-smooth snap-x">
            {selectedBoard.lists.map((list) => (
              <ListColumn
                key={list.id}
                list={list}
                boardUsers={selectedBoard.users}
                newCardDetails={newCardDetails}
                setNewCardDetails={setNewCardDetails}
                handleAddCard={handleAddCard}
                handleDeleteCard={handleDeleteCard}
                handleDeleteList={handleDeleteList}
                onEditCard={openEditCard}
              />
            ))}
            {/* Add List input */}
            <div className="w-80 flex-shrink-0 flex flex-col justify-center items-center bg-gradient-to-tr from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-dashed border-blue-400">
              <input
                className="border px-2 py-1 rounded w-full mb-2 text-sm bg-white"
                placeholder="Add list"
                value={newLists[selectedBoard.id] || ""}
                onChange={(e) =>
                  setNewLists((prev) => ({
                    ...prev,
                    [selectedBoard.id]: e.target.value,
                  }))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" ? handleAddList(selectedBoard.id) : undefined
                }
              />
              <button
                className="bg-blue-600 text-white rounded px-4 py-1 text-xs font-semibold hover:bg-blue-700"
                onClick={() => handleAddList(selectedBoard.id)}
                type="button"
              >
                Add List
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center my-10 text-gray-400 text-lg font-semibold">
            No board selected.
          </div>
        )}
        <BoardModal
          mode={boardModalMode}
          show={showBoardModal}
          boardFields={boardFields}
          setBoardFields={setBoardFields}
          users={users}
          onClose={() => setShowBoardModal(false)}
          onSubmit={handleSubmitBoard}
        />
        {/* Card Edit/Add Modal */}
        <CardEditModal
          mode={cardEdit.mode || "add"}
          show={!!cardEdit.show}
          initial={
            cardEdit.mode === "edit" && cardEdit.card
              ? {
                  title: cardEdit.card.title,
                  description: cardEdit.card.description,
                  status: cardEdit.card.status,
                  assignees: cardEdit.card.assignees.map((u) => u.id),
                }
              : {
                  title: "",
                  description: "",
                  status: "Not Started",
                  assignees: [],
                }
          }
          users={users}
          onClose={() => setCardEdit({ card: null, listId: null, mode: null, show: false })}
          onSubmit={
            cardEdit.mode === "edit" ? handleEditCardSubmit : handleAddCardFromModal
          }
        />
      </div>
    </DragDropContext>
  );
};

export default BoardsAdmin;
