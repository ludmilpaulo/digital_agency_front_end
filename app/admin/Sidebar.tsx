// admin/Sidebar.tsx
import React from "react";
import {
  FaHome,
  FaUsers,
  FaCog,
  FaColumns,
  FaTasks,
  FaFileAlt,
  FaBullhorn,
  FaBriefcase,
  FaTimes,
  FaChartBar,
  FaServer,
  FaBlog,
  FaCalendar,
  FaProjectDiagram,
  FaLightbulb,
  FaQuoteLeft,
  FaUserFriends,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";

interface SidebarProps {
  tab: string;
  setTab: (value: string) => void;
  open?: boolean;
  onClose?: () => void;
}
interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarLink({ icon, label, value, active, onClick }: SidebarLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-200 group
        ${active
          ? "bg-gradient-to-r from-blue-500 to-indigo-500 font-semibold shadow-lg text-white scale-105"
          : "hover:bg-white/10 hover:translate-x-1 text-blue-100 hover:text-white"}`}
    >
      <span className={`text-xl transition-transform ${active ? "" : "group-hover:scale-110"}`}>{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

export default function Sidebar({ tab, setTab, open, onClose }: SidebarProps) {
  const user = useSelector(selectUser);
  const mainRole = user?.groups?.[0] || "User";

  // Responsive classes: left-0 when open, -left-64 when closed
  const sidebarClass =
    "fixed md:static z-30 md:z-0 top-0 left-0 h-full md:h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl flex flex-col py-8 px-4 w-72 transition-all duration-300 border-r border-blue-800/50" +
    (open ? " left-0" : " -left-72") +
    " md:left-0";

  return (
    <aside className={sidebarClass}>
      {/* Mobile Close Button */}
      <button
        className="absolute md:hidden top-4 right-4 text-white p-2"
        onClick={onClose}
        aria-label="Close sidebar"
        type="button"
      >
        <FaTimes size={22} />
      </button>

      <div className="mb-8 mt-2 md:mt-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl">
            <FaColumns className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <p className="text-xs text-blue-300">Maindo Digital</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2 mt-3">
        <SidebarLink
          icon={<FaChartBar />}
          label="Analytics"
          value="analytics"
          active={tab === "analytics"}
          onClick={() => {
            setTab("analytics");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaServer />}
          label="Services"
          value="services"
          active={tab === "services"}
          onClick={() => {
            setTab("services");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaBlog />}
          label="Posts"
          value="posts"
          active={tab === "posts"}
          onClick={() => {
            setTab("posts");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaProjectDiagram />}
          label="Projects"
          value="projects"
          active={tab === "projects"}
          onClick={() => {
            setTab("projects");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaLightbulb />}
          label="Solutions"
          value="solutions"
          active={tab === "solutions"}
          onClick={() => {
            setTab("solutions");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaQuoteLeft />}
          label="Testimonials"
          value="testimonials"
          active={tab === "testimonials"}
          onClick={() => {
            setTab("testimonials");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaUserFriends />}
          label="Team"
          value="team"
          active={tab === "team"}
          onClick={() => {
            setTab("team");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaCalendar />}
          label="Appointments"
          value="appointments"
          active={tab === "appointments"}
          onClick={() => {
            setTab("appointments");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaColumns />}
          label="Boards"
          value="boards"
          active={tab === "boards"}
          onClick={() => {
            setTab("boards");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaUsers />}
          label="Members"
          value="members"
          active={tab === "members"}
          onClick={() => {
            setTab("members");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaTasks />}
          label="My Tasks"
          value="mytasks"
          active={tab === "mytasks"}
          onClick={() => {
            setTab("mytasks");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaTasks />}
          label="Task Table"
          value="tasktable"
          active={tab === "tasktable"}
          onClick={() => {
            setTab("tasktable");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaFileAlt />}
          label="Documents"
          value="documents"
          active={tab === "documents"}
          onClick={() => {
            setTab("documents");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaBullhorn />}
          label="Campaign"
          value="campaign"
          active={tab === "campaign"}
          onClick={() => {
            setTab("campaign");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaBriefcase />}
          label="Careers"
          value="careers"
          active={tab === "careers"}
          onClick={() => {
            setTab("careers");
            onClose?.();
          }}
        />
        <SidebarLink
          icon={<FaCog />}
          label="Settings"
          value="settings"
          active={tab === "settings"}
          onClick={() => {
            setTab("settings");
            onClose?.();
          }}
        />
      </nav>

      <div className="flex-grow" />

      {user && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border border-blue-400/30 rounded-xl px-4 py-3 mt-8 mb-2 shadow-lg hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
            {getInitials(user.username)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white leading-tight">{user.username}</span>
            <span className="text-xs text-blue-300 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {mainRole}
            </span>
          </div>
        </div>
      )}

      <div className="text-xs text-blue-300 mt-6 pl-2 flex items-center justify-between">
        <span>v1.0.0</span>
        <span className="text-blue-400">Maindo</span>
      </div>
    </aside>
  );
}
