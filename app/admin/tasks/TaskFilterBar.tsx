"use client";
import React from "react";
import type { User } from "@/types/kanban";
import { Search } from "lucide-react";

type FilterValue = {
  search: string;
  status: string;
  assignee: number | "";
};

type Props = {
  users: User[];
  value: FilterValue;
  onChange: {
    setSearch: (s: string) => void;
    setStatus: (s: string) => void;
    setAssignee: (n: number | "") => void;
  };
};

export default function TaskFilterBar({ users, value, onChange }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-2 items-center mb-3 px-2">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-blue-400" />
        <input
          type="text"
          className="pl-8 pr-2 py-1 rounded border bg-blue-50 w-full"
          placeholder="Search tasks..."
          value={value.search}
          onChange={e => onChange.setSearch(e.target.value)}
        />
      </div>
      <select
        className="border rounded px-2 py-1 text-sm"
        value={value.status}
        onChange={e => onChange.setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Failed">Failed</option>
        <option value="Reassigned">Reassigned</option>
      </select>
      <select
        className="border rounded px-2 py-1 text-sm"
        value={value.assignee}
        onChange={e => onChange.setAssignee(e.target.value ? Number(e.target.value) : "")}
      >
        <option value="">All Assignees</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.username}</option>
        ))}
      </select>
    </div>
  );
}
