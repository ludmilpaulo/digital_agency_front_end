"use client";
import React from "react";
import { format, isThisWeek, parseISO } from "date-fns";
import type { Card, User } from "@/types/tasks";
import SyncToCalendarButton from "./SyncToCalendarButton";

interface Props {
  cards: Card[];
  users: User[];
  completed: { [id: number]: boolean };
  onMarkComplete: (taskId: number) => void;
}
export default function WeekTasks({ cards, users, completed, onMarkComplete }: Props) {
  const weekTasks = cards.filter(
    (c) =>
      c.due_date &&
      isThisWeek(parseISO(c.due_date), { weekStartsOn: 1 }) &&
      !completed[c.id]
  );

  return (
    <section className="mb-4">
      <div className="font-bold mb-2 text-blue-600">Due This Week</div>
      {weekTasks.length === 0 ? (
        <div className="text-gray-400 text-sm mb-2">No tasks due this week.</div>
      ) : (
        <ul className="space-y-2">
          {weekTasks.map((task) => (
            <li key={task.id} className="bg-white p-3 rounded flex flex-col sm:flex-row sm:items-center justify-between border">
              <div>
                <div className="font-semibold text-blue-900">{task.title}</div>
                <div className="text-xs text-gray-400 mb-1">
                  Due: {format(parseISO(task.due_date!), "PPPP")}
                </div>
                <div className="flex gap-1 flex-wrap mt-1">
                  {(task.assignees || []).map((u: any) => (
                    <span
                      key={u.id}
                      className="px-2 py-0.5 bg-blue-100 text-xs rounded text-blue-800 font-bold"
                    >
                      {u.username || "User"}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 items-center mt-2 sm:mt-0">
                <button
                  className="px-3 py-1 rounded text-xs font-bold bg-blue-700 text-white hover:bg-blue-800"
                  onClick={() => onMarkComplete(task.id)}
                >
                  Mark Completed
                </button>
                <SyncToCalendarButton card={task} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
