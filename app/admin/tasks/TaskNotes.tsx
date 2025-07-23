"use client";
import React, { useState } from "react";
import { useAddTaskCommentMutation, useGetTaskCommentsQuery } from "@/redux/services/tasksApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";
import type { TaskComment } from "@/types/tasks";

export default function TaskNotes({ cardId }: { cardId: number }) {
  const { data: comments = [] } = useGetTaskCommentsQuery(cardId);
  const [addComment, { isLoading }] = useAddTaskCommentMutation();
  const user = useSelector(selectUser);

  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!note.trim() && !amount) return;

    // Fix: Convert to number
    const amountValue = amount.trim() === "" ? undefined : Number(amount);

    await addComment({
      card: cardId,
      text: note,
      amount: amountValue,   // number | undefined
    }).unwrap();
    setNote("");
    setAmount("");
  };

  return (
    <div className="bg-blue-50 rounded p-3 mt-2">
      <div className="font-bold mb-1 text-blue-800">Notes / Activity</div>
      <ul className="max-h-40 overflow-y-auto text-xs mb-2 space-y-2">
        {comments.map((c: TaskComment) => (
          <li key={c.id}>
            <span className="font-semibold">{c.user?.username}:</span> {c.text}
            {typeof c.amount === "number" && !isNaN(c.amount) && (
              <span className="ml-2 text-green-700 font-bold">
                (Spent: R{c.amount.toFixed(2)})
              </span>
            )}
          </li>
        ))}
      </ul>
      {user ? (
        <form className="flex gap-2 mt-2" onSubmit={handleSubmit}>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            className="flex-1 border px-2 py-1 rounded text-xs"
            placeholder="Add a note..."
            disabled={isLoading}
          />
          <input
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-24 border px-2 py-1 rounded text-xs"
            placeholder="Amount (R)"
            type="number"
            step="0.01"
            min="0"
            disabled={isLoading}
          />
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
            disabled={isLoading || (!note.trim() && !amount)}
            type="submit"
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </form>
      ) : (
        <div className="text-xs text-gray-400 mt-2">Login to add notes/expenses.</div>
      )}
    </div>
  );
}
