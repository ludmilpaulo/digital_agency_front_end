// admin/Sidebar.tsx
import React from "react";
import { FaHome, FaUsers, FaCog, FaColumns, FaTasks } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";

interface SidebarProps {
  tab: string;
  setTab: (value: string) => void;
}
interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}
function SidebarLink({ icon, label, active, onClick }: SidebarLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
        ${active
          ? "bg-blue-700 font-bold shadow text-white"
          : "hover:bg-blue-700 hover:text-white text-blue-200"}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map(part => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

export default function Sidebar({ tab, setTab }: SidebarProps) {
  const user = useSelector(selectUser);
  const mainRole = user?.groups?.[0] || "User";
  return (
    <aside className="w-60 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg flex flex-col py-8 px-4">
      <div className="text-2xl font-extrabold tracking-wide mb-10 flex items-center gap-2">
        <FaColumns className="text-blue-300" />
        <h2 className="text-2xl font-extrabold text-blue-900">
          Welcome, {user?.username}!
        </h2>
      </div>
      <nav className="flex flex-col gap-3">
        <SidebarLink icon={<FaHome />}    label="Dashboard" active={tab === "dashboard"} onClick={() => setTab("dashboard")} />
        <SidebarLink icon={<FaColumns />} label="Boards"    active={tab === "boards"}    onClick={() => setTab("boards")} />
        <SidebarLink icon={<FaUsers />}   label="Members"   active={tab === "members"}   onClick={() => setTab("members")} />
        <SidebarLink icon={<FaTasks />}   label="My Tasks"  active={tab === "mytasks"}   onClick={() => setTab("mytasks")} />
        <SidebarLink icon={<FaTasks />}   label="Task Table" active={tab === "tasktable"} onClick={() => setTab("tasktable")} />
        <SidebarLink icon={<FaCog />}     label="Settings"  active={tab === "settings"}  onClick={() => setTab("settings")} />
      </nav>
      <div className="flex-grow" />
      {user && (
        <div className="flex items-center gap-3 bg-blue-950 bg-opacity-80 rounded-xl px-3 py-3 mt-8 mb-2 shadow-lg">
          <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-xl font-bold text-white border-2 border-blue-700 shadow">
            {getInitials(user.username)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white leading-tight">{user.username}</span>
            <span className="text-xs text-blue-200 font-medium">{mainRole}</span>
          </div>
        </div>
      )}
      <div className="text-xs text-blue-200 mt-6 pl-2">v1.0.0</div>
    </aside>
  );
}
