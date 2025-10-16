"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaUsers, FaEye, FaChartLine, FaMousePointer, FaCalendar, FaTasks, FaFileAlt, FaEnvelope } from "react-icons/fa";
import { useGetUsersQuery } from "@/redux/services/usersApi";
import { useGetTasksQuery } from "@/redux/services/tasksApi";
import { useGetBoardsQuery } from "@/redux/services/boardsApi";

// Sample data - Replace with real API data
const pageViewsData = [
  { name: "Mon", views: 2400, users: 1400 },
  { name: "Tue", views: 1398, users: 2210 },
  { name: "Wed", views: 9800, users: 2290 },
  { name: "Thu", views: 3908, users: 2000 },
  { name: "Fri", views: 4800, users: 2181 },
  { name: "Sat", views: 3800, users: 2500 },
  { name: "Sun", views: 4300, users: 2100 },
];

const trafficSourceData = [
  { name: "Direct", value: 400, color: "#0088FE" },
  { name: "Organic", value: 300, color: "#00C49F" },
  { name: "Social", value: 300, color: "#FFBB28" },
  { name: "Referral", value: 200, color: "#FF8042" },
];

const userActivityData = [
  { hour: "12 AM", active: 12 },
  { hour: "3 AM", active: 8 },
  { hour: "6 AM", active: 15 },
  { hour: "9 AM", active: 45 },
  { hour: "12 PM", active: 67 },
  { hour: "3 PM", active: 54 },
  { hour: "6 PM", active: 89 },
  { hour: "9 PM", active: 42 },
];

const conversionData = [
  { name: "Week 1", conversions: 65, leads: 100 },
  { name: "Week 2", conversions: 78, leads: 120 },
  { name: "Week 3", conversions: 92, leads: 150 },
  { name: "Week 4", conversions: 84, leads: 130 },
];

export default function Analytics() {
  const { data: users = [] } = useGetUsersQuery();
  const { data: tasks = [] } = useGetTasksQuery({ user_id: undefined });
  const { data: boards = [] } = useGetBoardsQuery({});

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalViews: 0,
    avgSessionTime: "0m 0s",
    bounceRate: "0%",
    totalTasks: 0,
    totalBoards: 0,
    completedTasks: 0,
    activeSessions: 0,
  });

  useEffect(() => {
    // Calculate real stats
    const completedTasks = tasks.filter((t: any) => t.status === "Completed").length;
    
    setStats({
      totalUsers: users.length,
      totalViews: 24589, // This should come from Mixpanel or backend
      avgSessionTime: "5m 23s",
      bounceRate: "42.3%",
      totalTasks: tasks.length,
      totalBoards: boards.length,
      completedTasks,
      activeSessions: Math.floor(Math.random() * 50) + 10,
    });
  }, [users, tasks, boards]);

  const StatCard = ({ icon, title, value, change, color }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
              {change} from last week
            </p>
          )}
        </div>
        <div className={`p-4 rounded-full bg-${color}-100`}>
          {React.cloneElement(icon, { className: `text-${color}-600 text-2xl` })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm md:text-base">
            <FaCalendar className="inline mr-2" />
            <span className="hidden sm:inline">Last 7 Days</span>
            <span className="sm:hidden">7 Days</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base">
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaUsers />}
          title="Total Users"
          value={stats.totalUsers}
          change="+12%"
          color="blue"
        />
        <StatCard
          icon={<FaEye />}
          title="Page Views"
          value={stats.totalViews.toLocaleString()}
          change="+8%"
          color="green"
        />
        <StatCard
          icon={<FaTasks />}
          title="Total Tasks"
          value={stats.totalTasks}
          change="+5%"
          color="purple"
        />
        <StatCard
          icon={<FaMousePointer />}
          title="Active Sessions"
          value={stats.activeSessions}
          change="+15%"
          color="orange"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">Page Views & Users</h2>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={300} minWidth={300}>
              <AreaChart data={pageViewsData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="views" stroke="#3B82F6" fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="users" stroke="#10B981" fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">Traffic Sources</h2>
          <div className="w-full overflow-x-auto flex justify-center">
            <ResponsiveContainer width="100%" height={300} minWidth={250}>
              <PieChart>
                <Pie
                  data={trafficSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity by Hour */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">User Activity by Hour</h2>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={300} minWidth={300}>
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="active" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">Conversion Rate</h2>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={300} minWidth={300}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="leads" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Task Completion</h3>
            <FaTasks className="text-purple-600 text-xl" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completed</span>
              <span className="font-semibold">{stats.completedTasks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(stats.completedTasks / (stats.totalTasks || 1)) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total: {stats.totalTasks}</span>
              <span>{Math.round((stats.completedTasks / (stats.totalTasks || 1)) * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Avg. Session Time</h3>
            <FaChartLine className="text-green-600 text-xl" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.avgSessionTime}</p>
          <p className="text-xs md:text-sm text-green-600 mt-2">+23% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Bounce Rate</h3>
            <FaMousePointer className="text-orange-600 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.bounceRate}</p>
          <p className="text-sm text-red-600 mt-2">-5% from last month</p>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { user: "John Doe", action: "viewed Web Development service", time: "2 min ago", icon: <FaEye /> },
            { user: "Jane Smith", action: "submitted a proposal request", time: "5 min ago", icon: <FaFileAlt /> },
            { user: "Mike Johnson", action: "signed up for newsletter", time: "8 min ago", icon: <FaEnvelope /> },
            { user: "Sarah Williams", action: "completed a task", time: "15 min ago", icon: <FaTasks /> },
            { user: "Tom Brown", action: "viewed Professional Plan", time: "22 min ago", icon: <FaEye /> },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
