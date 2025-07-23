"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectUser } from "@/redux/slices/authSlice";
import { checkIsStaff } from "@/utils/checkIsStaff";
import dynamic from "next/dynamic";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";

// Dynamically loaded components (to avoid SSR issues)
const BoardsAdmin = dynamic(() => import("./BoardsAdmin"), { ssr: false });
const MembersAdmin = dynamic(() => import("./MembersAdmin"), { ssr: false });
const SettingsAdmin = dynamic(() => import("./SettingsAdmin"), { ssr: false });
const MyTasks = dynamic(() => import("./MyTasks"), { ssr: false });
const Documents = dynamic(() => import("./Documents"), { ssr: false });
const Campaign = dynamic(() => import("./Campaign"), { ssr: false });
const Careers = dynamic(() => import("./Careers"), { ssr: false });
const TaskTable = dynamic(() => import("./TaskTable"), { ssr: false });

// ...api queries and types
import { useGetBoardsQuery } from "@/redux/services/boardsApi";
import { useGetCardsQuery } from "@/redux/services/cardsApi";
import { useGetListsQuery } from "@/redux/services/listsApi";
import { useGetTasksQuery } from "@/redux/services/tasksApi";
import { useGetUsersQuery } from "@/redux/services/usersApi";
import type { TaskStatus } from "@/types/tasks";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState("boards");
  const user = useSelector(selectUser);

  // Sidebar state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  // Fetch data
  const { data: boards = [], isLoading: boardsLoading } = useGetBoardsQuery({});
  const { data: cards = [], isLoading: cardsLoading } = useGetCardsQuery();
  const { data: lists = [], isLoading: listsLoading } = useGetListsQuery(
    user ? { userId: user.user_id } : undefined
  );
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: myTasks = [], isLoading: myTasksLoading } = useGetTasksQuery(
    user ? { user_id: user.user_id } : undefined,
    { skip: !user }
  );
  const loadingData =
    boardsLoading || listsLoading || cardsLoading || usersLoading;

  useEffect(() => {
    if (!user) {
      router.replace("/LoginScreenUser");
      return;
    }
    (async () => {
      const { isStaff, detail } = await checkIsStaff(user.user_id || user.id);
      if (!isStaff) {
        alert(detail || "Access denied. Staff only.");
        router.replace("/LoginScreenUser");
      } else {
        setAuthed(true);
        setLoading(false);
      }
    })();
  }, [user, router]);

  // Set default tab for non-staff users (shouldn't ever happen, but keeps previous logic)
  useEffect(() => {
    if (!loading && user) {
      const groups: string[] = user?.groups ?? [];
      const isExecutive = groups.includes("Executive");
      const isStaff = groups.includes("Staff");
      const isFreelancer = groups.includes("Freelancer");
      const isBasic = groups.includes("Basic");
      if (!isExecutive && !isStaff && (isFreelancer || isBasic)) {
        setTab("mytasks");
      }
    }
  }, [user, loading]);

  if (loading || !authed) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        Loading...
      </div>
    );
  }

  // Handlers for demo
  const handleAssign = (cardId: number, userIds: number[]) => {
    console.log("Assigning card", cardId, "to users", userIds);
  };

  const handleStatusChange = (cardId: number, status: TaskStatus) => {
    console.log("Changing card", cardId, "to status", status);
  };

  return (
    <div className="flex min-h-screen bg-blue-50 relative">
      {/* Mobile Hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 bg-blue-900 text-white p-3 rounded-full shadow-md"
        aria-label="Open sidebar"
        type="button"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar Desktop + Mobile Drawer */}
      <Sidebar
        tab={tab}
        setTab={setTab}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Sidebar overlay"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-3 pt-20 md:pt-10 md:p-10 transition-all w-full max-w-full">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-4 gap-2 overflow-x-auto">
            <TabsTrigger value="boards">Boards</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="mytasks">My Tasks</TabsTrigger>
            <TabsTrigger value="tasktable">Task Table</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="campaign">Campaign</TabsTrigger>
            <TabsTrigger value="careers">Careers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="boards">
            <BoardsAdmin />
            </TabsContent>
          <TabsContent value="members"><MembersAdmin /></TabsContent>
          <TabsContent value="mytasks"><MyTasks/></TabsContent>
          <TabsContent value="tasktable">
            <TaskTable
              cards={cards}
              users={users}
              onAssign={handleAssign}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
          <TabsContent value="documents"><Documents /></TabsContent>
          <TabsContent value="campaign"><Campaign /></TabsContent>
          <TabsContent value="careers"><Careers /></TabsContent>
          <TabsContent value="settings"><SettingsAdmin /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
