// components/TaskWidgets.tsx
"use client";
import React from "react";
import { format, isToday, isThisWeek, parseISO } from "date-fns";
import type { Card, User } from "@/types/tasks";

interface Props {
  cards: Card[];
  users: User[];
  currentUserId: number;
  onContactManager?: (taskId: number) => void;
}

export default function TaskWidgets({ cards, users, currentUserId, onContactManager }: Props) {
  // Filter cards assigned to current user
  const myCards = cards.filter(card =>
    Array.isArray(card.assignees) ? card.assignees.some(a => a.id === currentUserId) : false
  );

  const todayTasks = myCards.filter(card => card.dueDate && isToday(parseISO(card.dueDate)));
  const weekTasks = myCards.filter(card => card.dueDate && isThisWeek(parseISO(card.dueDate)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Today's Tasks */}
      <div className="bg-blue-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold text-blue-700 mb-2">Today’s Tasks</h3>
        {todayTasks.length === 0 ? (
          <div className="text-gray-400">No tasks due today.</div>
        ) : (
          <ul className="space-y-1">
            {todayTasks.map(task => (
              <li key={task.id} className="p-2 rounded bg-white shadow flex flex-col">
                <span className="font-semibold">{task.title}</span>
                <span className="text-xs text-gray-400">
                  Due: {task.dueDate && format(parseISO(task.dueDate), "PPP")}
                </span>
                <span className="text-xs text-blue-600">Status: {task.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* This Week's Tasks */}
      <div className="bg-green-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold text-green-700 mb-2">Due This Week</h3>
        {weekTasks.length === 0 ? (
          <div className="text-gray-400">No tasks due this week.</div>
        ) : (
          <ul className="space-y-1">
            {weekTasks.map(task => (
              <li key={task.id} className="p-2 rounded bg-white shadow flex flex-col">
                <span className="font-semibold">{task.title}</span>
                <span className="text-xs text-gray-400">
                  Due: {task.dueDate && format(parseISO(task.dueDate), "PPP")}
                </span>
                <span className="text-xs text-green-600">Status: {task.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
