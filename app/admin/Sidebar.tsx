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
      className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full transition
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
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

export default function Sidebar({ tab, setTab, open, onClose }: SidebarProps) {
  const user = useSelector(selectUser);
  const mainRole = user?.groups?.[0] || "User";

  // Responsive classes: left-0 when open, -left-64 when closed
  const sidebarClass =
    "fixed md:static z-30 md:z-0 top-0 left-0 h-full md:h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg flex flex-col py-8 px-4 w-64 transition-all duration-300" +
    (open ? " left-0" : " -left-64") +
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

      <div className="text-2xl font-extrabold tracking-wide mb-10 flex items-center gap-2 mt-2 md:mt-0">
        <FaColumns className="text-blue-300" />
        <h2 className="text-2xl font-extrabold text-blue-100">
          Welcome, {user?.username}!
        </h2>
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
