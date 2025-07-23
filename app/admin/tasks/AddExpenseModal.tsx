"use client";
import React, { useState } from "react";
import { useAddBoardExpenseMutation } from "@/redux/services/expensesApi";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  boardId: number;
  cardId: number;
  onSaved?: () => void;
}

export default function AddExpenseModal({
  open,
  onClose,
  boardId,
  cardId,
  onSaved,
}: AddExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [addExpense, { isLoading }] = useAddBoardExpenseMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addExpense({
      board: boardId,
      card: cardId,
      amount: parseFloat(amount),
      note,
    }).unwrap();
    setAmount("");
    setNote("");
    onSaved?.();
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
      <form className="bg-white p-6 rounded-xl w-80 shadow-xl" onSubmit={handleSubmit}>
        <div className="font-bold mb-2 text-blue-800 text-lg">Enter Expense before Completing Task</div>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full border rounded px-2 py-2 mb-2 text-sm"
          placeholder="Amount (R)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          disabled={isLoading}
        />
        <textarea
          className="w-full border rounded px-2 py-2 mb-2 text-sm"
          placeholder="Expense note"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          disabled={isLoading}
        />
        <div className="flex gap-2 mt-2 justify-end">
          <button
            className="bg-blue-600 text-white rounded px-4 py-1 shadow hover:bg-blue-700 transition"
            disabled={isLoading}
            type="submit"
          >
            Save Expense
          </button>
          <button
            type="button"
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
