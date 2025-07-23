"use client";
import React from "react";
import { format, isToday, parseISO } from "date-fns";
import type { Card, User } from "@/types/kanban";
import { GripVertical, Trash, CheckCircle } from "lucide-react";
import SyncToCalendarButton from "./SyncToCalendarButton";
import TaskNotes from "./TaskNotes";

type Props = {
  cards: Card[];
  users: User[];
  completed: { [id: number]: boolean };
  onMarkComplete: (id: number) => void;
  onDeleteTask: (id: number) => void;
};

export default function TodayTasks({
  cards,
  users,
  completed,
  onMarkComplete,
  onDeleteTask,
}: Props) {
  const todayTasks = cards.filter(
    (c) => c.due_date && isToday(parseISO(c.due_date)) && !completed[c.id]
  );

  return (
    <section className="mb-6">
      <div className="font-bold mb-2 text-green-700 text-lg flex items-center gap-2">
        Today’s Tasks
        <span className="bg-green-100 text-green-600 px-2 rounded text-xs">{todayTasks.length}</span>
      </div>
      {todayTasks.length === 0 ? (
        <div className="text-gray-400 text-sm mb-2 rounded bg-blue-50 p-4">No tasks due today!</div>
      ) : (
        <ul className="space-y-3">
          {todayTasks.map((task, idx) => (
            <li
              key={task.id}
              className="bg-white p-4 rounded-xl flex flex-col gap-2 border shadow group hover:border-blue-400 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="text-blue-200 w-4 h-4 cursor-move" />
                  <span className="font-semibold text-blue-900 text-base">{task.title}</span>
                  <span className="text-xs ml-2 text-blue-600">{task.status}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded p-1 bg-green-50 hover:bg-green-200 text-green-700"
                    onClick={() => onMarkComplete(task.id)}
                    title="Mark Complete"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    className="rounded p-1 bg-red-50 hover:bg-red-200 text-red-600"
                    onClick={() => onDeleteTask(task.id)}
                    title="Delete"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-blue-700 font-bold">Due:</span>{" "}
                  {format(parseISO(task.due_date!), "PPPP")}
                </div>
                {task.assignees?.length > 0 && (
                  <div className="flex gap-1">
                    {task.assignees.map((u: any) => (
                      <span key={u.id} className="bg-blue-100 text-blue-800 px-2 rounded-full text-xs font-semibold">
                        {u.username}
                      </span>
                    ))}
                  </div>
                )}
                <SyncToCalendarButton card={task} />
              </div>
              <TaskNotes cardId={task.id} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
