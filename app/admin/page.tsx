"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectUser } from "@/redux/slices/authSlice";

import dynamic from 'next/dynamic';

// Safe to SSR
import BoardsAdmin from './BoardsAdmin';
import MembersAdmin from './MembersAdmin';
import SettingsAdmin from './SettingsAdmin';

// Client-only (browser-only logic like `window`, `self`, etc.)
const MyTasks = dynamic(() => import('./MyTasks'), { ssr: false });
const Documents = dynamic(() => import('./Documents'), { ssr: false });
const Campaign = dynamic(() => import('./Campaign'), { ssr: false });
const Careers = dynamic(() => import('./Careers'), { ssr: false });
const TaskTable = dynamic(() => import('./TaskTable'), { ssr: false });

// UI Components
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

// API
import { useGetBoardsQuery } from "@/redux/services/boardsApi";
import { useGetCardsQuery } from "@/redux/services/cardsApi";
import { useGetListsQuery } from "@/redux/services/listsApi";
import { useGetTasksQuery } from "@/redux/services/tasksApi";
import { useGetUsersQuery } from "@/redux/services/usersApi";

// Types
import type { TaskStatus } from "@/types/tasks";
import Sidebar from "./Sidebar";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState("boards");
  const user = useSelector(selectUser);

  const isAuthed = !!user;
  const groups: string[] = user?.groups ?? [];
  const isExecutive = groups.includes("Executive");
  const isStaff = groups.includes("Staff");
  const isFreelancer = groups.includes("Freelancer");
  const isBasic = groups.includes("Basic");

  // Fetch data
  const { data: boards = [], isLoading: boardsLoading } = useGetBoardsQuery();
  const { data: cards = [], isLoading: cardsLoading } = useGetCardsQuery();
  const { data: lists = [], isLoading: listsLoading } = useGetListsQuery(
    isAuthed && !(isExecutive || isStaff) ? { userId: user.user_id } : undefined
  );
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: myTasks = [], isLoading: myTasksLoading } = useGetTasksQuery(
    user ? { user_id: user.user_id } : undefined,
    { skip: !user }
  );

  const loading =
    boardsLoading || listsLoading || cardsLoading || usersLoading;

  // Redirect if not logged in
  useEffect(() => {
    if (!user) router.replace("/LoginScreenUser");
  }, [user, router]);

  // Set default tab
  useEffect(() => {
    if (!isExecutive && !isStaff && (isFreelancer || isBasic)) {
      setTab("mytasks");
    }
  }, [isExecutive, isStaff, isFreelancer, isBasic]);

  if (!user) return null;

  // ✅ Fixed: match expected signature
  const handleAssign = (cardId: number, userIds: number[]) => {
    console.log("Assigning card", cardId, "to users", userIds);
  };

  const handleStatusChange = (cardId: number, status: TaskStatus) => {
    console.log("Changing card", cardId, "to status", status);
  };

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
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="campaign">Campaign</TabsTrigger>
            <TabsTrigger value="careers">Careers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="boards">
            <BoardsAdmin />
          </TabsContent>

          <TabsContent value="members">
            <MembersAdmin />
          </TabsContent>

          <TabsContent value="mytasks">
            <MyTasks cards={cards} users={users} />
          </TabsContent>

          <TabsContent value="tasktable">
            <TaskTable
              cards={cards}
              users={users}
              onAssign={handleAssign}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="documents">
            <Documents />
          </TabsContent>

          <TabsContent value="campaign">
            <Campaign />
          </TabsContent>

          <TabsContent value="careers">
            <Careers />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsAdmin />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
