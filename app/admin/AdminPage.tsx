"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

import { selectUser } from "@/redux/slices/authSlice";
import { checkIsAdmin } from "@/utils/checkIsAdmin";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import { AccessibleOverlay } from "@/components/AccessibleOverlay";

// Dynamically loaded components to avoid SSR issues in admin children
const BoardsAdmin = dynamic(() => import("./BoardsAdmin"), { ssr: false });
const MembersAdmin = dynamic(() => import("./MembersAdmin"), { ssr: false });
const SettingsAdmin = dynamic(() => import("./SettingsAdmin"), { ssr: false });
const MyTasks = dynamic(() => import("./MyTasks"), { ssr: false });
const Documents = dynamic(() => import("./Documents"), { ssr: false });
const DocumentManagement = dynamic(() => import("./DocumentManagement"), { ssr: false });
const PermissionRequests = dynamic(() => import("./PermissionRequests"), { ssr: false });
const Campaign = dynamic(() => import("./Campaign"), { ssr: false });
const Careers = dynamic(() => import("./Careers"), { ssr: false });
const TaskTable = dynamic(() => import("./TaskTable"), { ssr: false });
const Analytics = dynamic(() => import("./Analytics"), { ssr: false });
const Services = dynamic(() => import("./Services"), { ssr: false });
const Posts = dynamic(() => import("./Posts"), { ssr: false });
const Appointments = dynamic(() => import("./Appointments"), { ssr: false });
const Projects = dynamic(() => import("./Projects"), { ssr: false });
const Testimonials = dynamic(() => import("./Testimonials"), { ssr: false });
const Team = dynamic(() => import("./Team"), { ssr: false });
const Solutions = dynamic(() => import("./Solutions"), { ssr: false });

// RTK Query hooks
import { useGetBoardsQuery } from "@/redux/services/boardsApi";
import { useGetCardsQuery } from "@/redux/services/cardsApi";
import { useGetListsQuery } from "@/redux/services/listsApi";
import { useGetTasksQuery } from "@/redux/services/tasksApi";
import { useGetUsersQuery } from "@/redux/services/usersApi";

import type { TaskStatus } from "@/types/tasks";

export default function AdminPage() {
  const router = useRouter();
  const user = useSelector(selectUser);

  const [tab, setTab] = useState("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  // Fetch data
  const { data: boards = [], isLoading: boardsLoading } = useGetBoardsQuery({});
  const { data: cards = [], isLoading: cardsLoading } = useGetCardsQuery();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: lists = [], isLoading: listsLoading } = useGetListsQuery(
    user ? { userId: user.user_id ?? user.id } : undefined
  );
  const { data: myTasks = [], isLoading: myTasksLoading } = useGetTasksQuery(
    user ? { user_id: user.user_id ?? user.id } : undefined,
    { skip: !user }
  );

  const loadingData = boardsLoading || listsLoading || cardsLoading || usersLoading || myTasksLoading;

  useEffect(() => {
    // Guard unauthenticated
    if (!user) {
      toast.error("Please sign in to access the admin panel", { duration: 4000 });
      router.replace("/LoginScreenUser");
      return;
    }
    // Admin check - allow both superusers (admin) and staff members
    (async () => {
      const { isAdmin, detail } = await checkIsAdmin(user.user_id || user.id);
      if (!isAdmin) {
        // Keep a safe UX
        console.warn(detail || "Access denied. Admin or Staff only.");
        toast.error("Access Denied: This page is only accessible to administrators and staff members.", { 
          duration: 5000 
        });
        setTimeout(() => {
          toast("Redirecting to homepage...", { 
            icon: "🏠",
            duration: 3000 
          });
        }, 1000);
        setTimeout(() => {
          router.replace("/");
        }, 2000);
      } else {
        setAuthed(true);
        setLoading(false);
      }
    })();
  }, [user, router]);

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

  const handleAssign = (cardId: number, userIds: number[]) => {
    console.log("Assigning card", cardId, "to users", userIds);
  };

  const handleStatusChange = (cardId: number, status: TaskStatus) => {
    console.log("Changing card", cardId, "to status", status);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 relative">
      {/* Mobile Hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-white text-gray-700 p-3 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-110 border border-gray-200"
        aria-label="Open sidebar"
        type="button"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar Desktop */}
      <Sidebar tab={tab} setTab={setTab} open={true} onClose={() => setSidebarOpen(false)} />

      {/* Overlay + Sidebar for Mobile */}
      <AccessibleOverlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Sidebar tab={tab} setTab={setTab} open={true} onClose={() => setSidebarOpen(false)} />
      </AccessibleOverlay>

      {/* Main Content */}
      <main className="flex-1 p-4 pt-20 md:pt-8 md:p-8 transition-all w-full max-w-full overflow-x-hidden">
        {/* Modern Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username}! 👋
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Modern Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Boards Stat */}
            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-blue-50 px-2 py-1 rounded-full">Active</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{boards.length}</h3>
              <p className="text-sm text-gray-600">Total Boards</p>
            </div>

            {/* Users Stat */}
            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-purple-50 px-2 py-1 rounded-full">+{users.length > 0 ? 5 : 0}%</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{users.length}</h3>
              <p className="text-sm text-gray-600">Team Members</p>
            </div>

            {/* Tasks Stat */}
            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-green-50 px-2 py-1 rounded-full">Today</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{myTasks.length}</h3>
              <p className="text-sm text-gray-600">Active Tasks</p>
            </div>

            {/* Quick Action */}
            <div className="group bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">Quick</h3>
              <p className="text-sm text-blue-100">Create New...</p>
            </div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6 gap-2 overflow-x-auto bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 flex-wrap md:flex-nowrap justify-start scrollbar-hide">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="boards">Boards</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="mytasks">My Tasks</TabsTrigger>
            <TabsTrigger value="tasktable">Task Table</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="campaign">Campaign</TabsTrigger>
            <TabsTrigger value="careers">Careers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
          <TabsContent value="services">
            <Services />
          </TabsContent>
          <TabsContent value="posts">
            <Posts />
          </TabsContent>
          <TabsContent value="projects">
            <Projects />
          </TabsContent>
          <TabsContent value="solutions">
            <Solutions />
          </TabsContent>
          <TabsContent value="testimonials">
            <Testimonials />
          </TabsContent>
          <TabsContent value="team">
            <Team />
          </TabsContent>
          <TabsContent value="appointments">
            <Appointments />
          </TabsContent>
          <TabsContent value="boards">
            <BoardsAdmin />
          </TabsContent>
          <TabsContent value="members">
            <MembersAdmin />
          </TabsContent>
          <TabsContent value="mytasks">
  {/* Pass tasks down — now MyTasks accepts it */}
            <MyTasks tasks={myTasks} />
            </TabsContent>
          <TabsContent value="tasktable">
            <TaskTable
              cards={cards}
              users={users}
              boards={boards}
              onAssign={handleAssign}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
          <TabsContent value="documents">
            <Documents />
          </TabsContent>
          <TabsContent value="staffdocs">
            <DocumentManagement />
          </TabsContent>
          <TabsContent value="permissions">
            <PermissionRequests />
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

        {loadingData && (
          <div className="mt-4 text-sm text-slate-600">Syncing latest data…</div>
        )}
      </main>
    </div>
  );
}
