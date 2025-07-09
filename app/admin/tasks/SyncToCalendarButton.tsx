"use client";
import React, { useState } from "react";
import type { Card } from "@/types/tasks";
import axios from "axios";
import { baseAPI } from "@/useAPI/api";

interface SyncProps {
  card: Card;
}
export default function SyncToCalendarButton({ card }: SyncProps) {
  const [loading, setLoading] = useState(false);
  const [eventUrl, setEventUrl] = useState<string | null>(null);

  const syncTask = async () => {
    setLoading(true);
    try {
      // You need to implement /api/google/add-task/ in your backend
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
        className="px-3 py-1 rounded bg-green-600 text-white text-xs"
        disabled={loading}
      >
        {loading ? "Syncing..." : "Sync to Google Calendar"}
      </button>
      {eventUrl && (
        <a href={eventUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline">
          View
        </a>
      )}
    </div>
  );
}
