// components/StickySidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { label: "Overview", href: "/dashboard" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function StickySidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-24 h-fit bg-white border rounded-xl shadow p-4 flex flex-col gap-3 min-w-[200px]">
      {sidebarLinks.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`py-2 px-3 rounded-lg font-semibold text-blue-800 hover:bg-blue-50 transition ${
            pathname === l.href ? "bg-blue-100" : ""
          }`}
        >
          {l.label}
        </Link>
      ))}
    </aside>
  );
}
