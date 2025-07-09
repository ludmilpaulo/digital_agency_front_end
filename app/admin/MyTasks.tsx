"use client";
import React, { useState } from "react";
import type { Card, User } from "@/types/tasks";
import TodayTasks from "./tasks/TodayTasks";
import WeekTasks from "./tasks/WeekTasks";
import AllTasks from "./tasks/AllTasks";

interface MyTasksProps {
  cards: Card[];
  users: User[];
}

export default function MyTasks({ cards = [], users }: MyTasksProps) {
  // Track completed tasks in state (persist via API in real app)
  const [completed, setCompleted] = useState<{ [id: number]: boolean }>({});

  // Mark a task as completed (simulate; in real app, call backend!)
  const handleMarkComplete = (taskId: number) => {
    setCompleted((prev) => ({ ...prev, [taskId]: true }));
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <h2 className="text-xl font-bold mb-2">My Tasks</h2>
      <TodayTasks cards={cards} users={users} completed={completed} onMarkComplete={handleMarkComplete} />
      <WeekTasks cards={cards} users={users} completed={completed} onMarkComplete={handleMarkComplete} />
      <AllTasks cards={cards} users={users} completed={completed} />
    </div>
  );
}
