import React from "react";
import { Group } from "@/types/groups";

export default function GroupTag({ group }: { group: Group }) {
  return (
    <span className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold mr-1 mb-1 bg-blue-100 text-blue-700">
      {group.name}
    </span>
  );
}
