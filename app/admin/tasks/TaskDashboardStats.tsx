"use client";
import React from "react";
import type { Card } from "@/types/kanban";
import { CheckCircle, Hourglass, Loader } from "lucide-react";

export default function TaskDashboardStats({
  cards,
  completed = {},
}: {
  cards: Card[];
  completed: { [id: number]: boolean };
}) {
  const total = cards.length;
  const done = cards.filter(t => t.status === "Completed" || completed[t.id]).length;
  const inProgress = cards.filter(t => t.status === "In Progress").length;
  const notStarted = cards.filter(t => t.status === "Not Started").length;

  return (
    <div className="flex gap-4 text-xs items-center text-blue-700">
      <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> {done} Completed</span>
      <span className="flex items-center gap-1"><Loader className="w-4 h-4 animate-spin text-blue-400" /> {inProgress} In Progress</span>
      <span className="flex items-center gap-1"><Hourglass className="w-4 h-4 text-orange-400" /> {notStarted} Not Started</span>
      <span className="ml-2 font-bold">{total} Total</span>
    </div>
  );
}
