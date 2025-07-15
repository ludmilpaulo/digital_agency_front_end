"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";
import {
  useGetBoardsQuery,
  useAddBoardMutation,
  useDeleteBoardMutation,
  useAddListMutation,
  useDeleteListMutation,
  useAddCardMutation,
  useDeleteCardMutation,
} from "@/redux/services/boardsApi";
import { useGetUsersQuery } from "@/redux/services/usersApi"; // Must exist!
import { Board, User } from "@/types/kanban";
import BoardSelector from "./boards/BoardSelector";
import KanbanBoard from "./boards/KanbanBoard";
import { PlusCircle, Filter, User as UserIcon, Grid, LayoutList } from "lucide-react";

// Tab menu
type TabKey = "my" | "all" | "filter";
const TAB_CONFIG: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "my", label: "My Boards", icon: <Grid className="w-4 h-4 mr-1" /> },
  { key: "all", label: "All Boards", icon: <LayoutList className="w-4 h-4 mr-1" /> },
  { key: "filter", label: "Filter", icon: <Filter className="w-4 h-4 mr-1" /> },
];

const initialBoardFields = {
  name: "",
  description: "",
  development_link: "",
  repository_link: "",
  client_link: "",
  sample_link: "",
  managers_ids: [] as number[],
  users_ids: [] as number[],
  budget: "",
  budget_used: "",
  deadline: "",
  start_date: "",
  end_date: "",
  status: "Started",
};

const statusOptions = [
  { value: "Started", label: "Started" },
  { value: "In Progress", label: "In Progress" },
  { value: "Concluded", label: "Concluded" },
];

const BoardsAdmin: React.FC = () => {
  const user = useSelector(selectUser);
  const currentUserId = user?.user_id ?? null;

  const [activeTab, setActiveTab] = useState<TabKey>("my");
  const [filterText, setFilterText] = useState("");
  const [filterUser, setFilterUser] = useState<number | "">("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [boardFields, setBoardFields] = useState({ ...initialBoardFields });
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);

  // State for new lists/cards in Kanban
  const [newLists, setNewLists] = useState<Record<number, string>>({});
  const [newCardDetails, setNewCardDetails] = useState<Record<number, any>>({});

  // Users (for managers/assigns)
  const { data: users = [] } = useGetUsersQuery();

  // API params based on tab/filter
  const apiParams = useMemo(() => {
    const params: any = {};
    if (activeTab === "my" && currentUserId) params.user_id = currentUserId;
    if (activeTab === "filter") {
      if (filterText.trim()) params.search = filterText.trim();
      if (filterUser) params.manager_id = filterUser;
    }
    return params;
  }, [activeTab, currentUserId, filterText, filterUser]);

  // Boards API
  const { data: boards = [], isLoading, error, refetch } = useGetBoardsQuery(apiParams);

  // Mutations
  const [addBoard] = useAddBoardMutation();
  const [deleteBoard] = useDeleteBoardMutation();
  const [addList] = useAddListMutation();
  const [deleteList] = useDeleteListMutation();
  const [addCard] = useAddCardMutation();
  const [deleteCard] = useDeleteCardMutation();

  // On boards change, set selected board if necessary
  useEffect(() => {
    if (boards.length && (selectedBoardId === null || !boards.some((b) => b.id === selectedBoardId))) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards, selectedBoardId]);

  const selectedBoard = boards.find((b) => b.id === selectedBoardId) || null;

  // --- Board CRUD ---
  async function handleAddBoard() {
    // Clean and ensure all fields required by Django/DRF
    const payload = {
      ...boardFields,
      description: boardFields.description || "Board description", // Can't be blank for CKEditor5Field
      managers_ids: Array.isArray(boardFields.managers_ids) ? boardFields.managers_ids : [],
      users_ids: Array.isArray(boardFields.users_ids) ? boardFields.users_ids : [],
      budget: boardFields.budget ? boardFields.budget : "0.00",
      budget_used: boardFields.budget_used ? boardFields.budget_used : "0.00",
      deadline: boardFields.deadline || "",
      start_date: boardFields.start_date || "",
      end_date: boardFields.end_date || "",
      development_link: boardFields.development_link || "",
      repository_link: boardFields.repository_link || "",
      client_link: boardFields.client_link || "",
      sample_link: boardFields.sample_link || "",
      status: boardFields.status || "Started",
    };
    try {
      const payload = {
          ...boardFields,
          budget: boardFields.budget ? Number(boardFields.budget) : undefined,
          budget_used: boardFields.budget_used ? Number(boardFields.budget_used) : undefined,
        };
        await addBoard(payload);

      setShowAddModal(false);
      setBoardFields({ ...initialBoardFields });
      setTimeout(refetch, 400);
    } catch (err: any) {
      alert(
        err?.data?.detail ||
          "Failed to add board. Make sure all fields are filled and you selected at least one manager."
      );
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

  // Kanban: list & card handlers
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

  // --- Render ---
  return (
    <div className="p-4 max-w-7xl mx-auto w-full">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-4">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 flex items-center gap-1 rounded-t-lg font-semibold ${
              activeTab === tab.key
                ? "bg-blue-100 border-b-2 border-blue-600 text-blue-700"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
        <button
          onClick={() => setShowAddModal(true)}
          className="ml-auto px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow flex items-center gap-1"
        >
          <PlusCircle className="w-4 h-4" /> Add Board
        </button>
      </div>

      {/* Filter Inputs */}
      {activeTab === "filter" && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="border p-2 rounded w-full max-w-xs"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value ? +e.target.value : "")}
          >
            <option value="">All Users</option>
            {users.map((u: User) => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>
      )}

      {/* Loading/Error */}
      {isLoading && <div className="text-center my-10">Loading...</div>}
      {error && <div className="text-red-500 text-center my-10">Error loading boards</div>}

      {/* Board Selector */}
      {!isLoading && !error && boards.length > 0 && (
        <div className="mb-4">
          <BoardSelector
            boards={boards}
            selectedBoardId={selectedBoardId}
            setSelectedBoardId={setSelectedBoardId}
            handleDeleteBoard={handleDeleteBoard}
          />
        </div>
      )}

      {/* Board Team (Managers + Users) */}
      {selectedBoard && (
        <BoardTeam managers={selectedBoard.managers} users={selectedBoard.users} />
      )}

      {/* Kanban Board */}
      {selectedBoard ? (
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
      ) : (
        <div className="text-center my-10 text-gray-400 text-lg font-semibold">
          No board selected.
        </div>
      )}

      {/* Add Board Modal */}
      {showAddModal && (
        <BoardAddModal
          boardFields={boardFields}
          setBoardFields={setBoardFields}
          users={users}
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddBoard}
        />
      )}
    </div>
  );
};

// Show both Managers and Users assigned
const BoardTeam: React.FC<{ managers: User[]; users: User[] }> = ({ managers, users }) => {
  const combined = [
    ...managers,
    ...users.filter((u) => !managers.some((m) => m.id === u.id)),
  ];
  return combined.length > 0 ? (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 font-bold">Team:</span>
      {combined.map((user) => (
        <span
          key={user.id}
          className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mr-1"
        >
          {user.username}
        </span>
      ))}
    </div>
  ) : null;
};

// --- Board Add Modal ---
type BoardAddModalProps = {
  boardFields: typeof initialBoardFields;
  setBoardFields: React.Dispatch<React.SetStateAction<typeof initialBoardFields>>;
  users: User[];
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
};
const BoardAddModal: React.FC<BoardAddModalProps> = ({
  boardFields,
  setBoardFields,
  users,
  show,
  onClose,
  onSubmit,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-auto overflow-y-auto max-h-[90vh]">
        <h3 className="font-bold text-xl mb-3 text-blue-900 flex items-center gap-2">
          <PlusCircle className="w-6 h-6" /> Create New Board
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {/* ...Other fields above... */}

          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Board Name"
            value={boardFields.name}
            onChange={e => setBoardFields(f => ({ ...f, name: e.target.value }))}
          />
          <textarea
            className="border px-3 py-2 rounded w-full"
            placeholder="Board Description"
            rows={2}
            value={boardFields.description}
            onChange={e => setBoardFields(f => ({ ...f, description: e.target.value }))}
          />

          {/* All your link/user fields go here... */}

          {/* Budget fields */}
          <input
            type="number"
            className="border px-3 py-2 rounded w-full"
            placeholder="Total budget (e.g. 10000.00)"
            value={boardFields.budget}
            onChange={e => setBoardFields(f => ({ ...f, budget: e.target.value }))}
          />
          <input
            type="number"
            className="border px-3 py-2 rounded w-full"
            placeholder="Budget already used (e.g. 2500.00)"
            value={boardFields.budget_used}
            onChange={e => setBoardFields(f => ({ ...f, budget_used: e.target.value }))}
          />

          {/* Date fields with labels */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Deadline</label>
            <input
              type="date"
              className="border px-3 py-2 rounded w-full"
              value={boardFields.deadline}
              onChange={e => setBoardFields(f => ({ ...f, deadline: e.target.value }))}
              placeholder="Deadline (yyyy-mm-dd)"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              className="border px-3 py-2 rounded w-full"
              value={boardFields.start_date}
              onChange={e => setBoardFields(f => ({ ...f, start_date: e.target.value }))}
              placeholder="Start Date (yyyy-mm-dd)"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              className="border px-3 py-2 rounded w-full"
              value={boardFields.end_date}
              onChange={e => setBoardFields(f => ({ ...f, end_date: e.target.value }))}
              placeholder="End Date (yyyy-mm-dd)"
            />
          </div>

          {/* Status select as before */}
          <select
            className="border px-2 py-2 rounded w-full"
            value={boardFields.status}
            onChange={e =>
              setBoardFields(f => ({ ...f, status: e.target.value }))
            }
          >
            {statusOptions.map(s => (
              <option value={s.value} key={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            className="flex-1 bg-blue-700 text-white rounded px-4 py-2 font-bold hover:bg-blue-900"
            onClick={onSubmit}
          >
            Add Board
          </button>
          <button
            className="flex-1 bg-gray-200 text-gray-700 rounded px-4 py-2 font-semibold hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


export default BoardsAdmin;
