"use client";
import React, { useState } from "react";
import axios from "axios";
import { baseAPI } from "@/useAPI/api";
import { CalendarPlus } from "lucide-react";
import type { Card } from "@/types/kanban";

export default function SyncToCalendarButton({ card }: { card: Card }) {
  const [loading, setLoading] = useState(false);
  const [eventUrl, setEventUrl] = useState<string | null>(null);

  const syncTask = async () => {
    setLoading(true);
    try {
      const evRes = await axios.post(`${baseAPI}/task/google/add-task/`, {
        title: card.title,
        description: card.description,
        start_date: card.start_date,
        due_date: card.due_date,
      });
      setEventUrl(evRes.data.htmlLink);
    } catch {
      alert("Please connect your Google Calendar first!");
    }
    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={syncTask}
        className="flex items-center gap-1 px-2 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700"
        disabled={loading}
        title="Sync to Google Calendar"
      >
        <CalendarPlus className="w-4 h-4" />
        {loading ? "Syncing..." : "Sync"}
      </button>
      {eventUrl && (
        <a
          href={eventUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 text-blue-600 underline text-xs"
        >
          View
        </a>
      )}
    </div>
  );
}
