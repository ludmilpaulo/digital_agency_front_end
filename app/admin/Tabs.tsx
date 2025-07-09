// /admin/Tabs.tsx
import React from "react";

export interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: TabItem[];
  current: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ tabs, current, onChange }: TabsProps) {
  return (
    <div className="flex border-b gap-2">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`px-6 py-2 font-semibold rounded-t transition-all border-b-2
            ${current === t.value
              ? "border-blue-700 text-blue-700 bg-white shadow"
              : "border-transparent text-gray-500 bg-gray-100 hover:text-blue-800"}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
