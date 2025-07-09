"use client";
import React from "react";
import { format, parseISO } from "date-fns";
import type { Card, User } from "@/types/tasks";
import SyncToCalendarButton from "./SyncToCalendarButton";

interface Props {
  cards: Card[];
  users: User[];
  completed: { [id: number]: boolean };
}
export default function AllTasks({ cards, users, completed }: Props) {
  return (
    <section>
      <div className="font-bold mb-2 text-blue-900">All Assigned Tasks</div>
      {cards.length === 0 ? (
        <div className="text-gray-400">You have no tasks assigned!</div>
      ) : (
        <ul className="space-y-2">
          {cards.map((card) => (
            <li
              key={card.id}
              className={`bg-white rounded-lg p-4 shadow border flex flex-col sm:flex-row sm:items-center justify-between ${
                completed[card.id] ? "opacity-60 line-through" : ""
              }`}
            >
              <div>
                <div className="font-semibold text-blue-900">{card.title}</div>
                <div className="text-xs text-gray-400 mb-1">
                  List: {typeof card.list === "string"
                    ? card.list
                    : card.list?.name || "—"}
                </div>
                <div className="text-xs">
                  <span className="text-blue-700 font-bold">Start:</span>{" "}
                  {card.start_date
                    ? format(parseISO(card.start_date), "PPP")
                    : "—"}{" "}
                  <span className="text-pink-700 font-bold">Due:</span>{" "}
                  {card.due_date
                    ? format(parseISO(card.due_date), "PPP")
                    : "—"}
                </div>
                <div className="flex gap-1 flex-wrap mt-1">
                  {(card.assignees || []).map((u: any) => (
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
                <SyncToCalendarButton card={card} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
