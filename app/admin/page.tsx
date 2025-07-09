"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectUser } from "@/redux/slices/authSlice";
import Sidebar from "./Sidebar";
import BoardsAdmin from "./BoardsAdmin";
import MembersAdmin from "./MembersAdmin";
import MyTasks from "./MyTasks";
import SettingsAdmin from "./SettingsAdmin";
import TaskTable from "./TaskTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetBoardsQuery } from "@/redux/services/boardsApi";
import { useGetListsQuery } from "@/redux/services/listsApi";
import { useGetCardsQuery } from "@/redux/services/cardsApi";
import { useGetUsersQuery } from "@/redux/services/usersApi";
import { useGetTasksQuery } from "@/redux/services/tasksApi"; // <--- import the tasksApi hook!

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<string>("boards");
  const user = useSelector(selectUser);

  const { data: boards = [], isLoading: boardsLoading } = useGetBoardsQuery();
  const isAuthed = !!user;
  const groups: string[] = user?.groups ?? [];
  const isExecutive = groups.includes("Executive");
  const isStaff = groups.includes("Staff");
  const isFreelancer = groups.includes("Freelancer");
  const isBasic = groups.includes("Basic");
  const { data: lists = [], isLoading: listsLoading } = useGetListsQuery(
    isAuthed && !(isExecutive || isStaff) ? { userId: user.user_id } : undefined
  );
  const { data: cards = [], isLoading: cardsLoading } = useGetCardsQuery();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  // --- NEW: Fetch tasks for "My Tasks" tab directly ---
  const {
    data: myTasks = [],
    isLoading: myTasksLoading,
    isFetching: myTasksFetching,
  } = useGetTasksQuery(
    user ? { user_id: user.user_id } : undefined,
    { skip: !user } // only fetch if logged in
  );

  // --- Default tab logic
  useEffect(() => {
    if (!user) router.replace("/LoginScreenUser");
  }, [user, router]);
  useEffect(() => {
    if (!isExecutive && !isStaff && (isFreelancer || isBasic)) {
      setTab("mytasks");
    }
  }, [isExecutive, isStaff, isFreelancer, isBasic]);

  if (!user) return null;

  const loading =
    boardsLoading || listsLoading || cardsLoading || usersLoading;

  return (
    <div className="flex min-h-screen bg-blue-50">
      <Sidebar tab={tab} setTab={setTab} />
      <main className="flex-1 p-6 md:p-10">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-4 gap-2">
            <TabsTrigger value="boards">Boards</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="mytasks">My Tasks</TabsTrigger>
            <TabsTrigger value="tasktable">Task Table</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="boards">
            <BoardsAdmin />
          </TabsContent>
          <TabsContent value="members">
            <MembersAdmin />
          </TabsContent>
        
        
          <TabsContent value="settings">
            <SettingsAdmin />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
