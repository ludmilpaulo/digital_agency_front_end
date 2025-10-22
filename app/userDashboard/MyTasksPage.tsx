"use client";

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { baseAPI } from '@/useAPI/api';
import toast from 'react-hot-toast';
import { FaTasks, FaFilter, FaSearch, FaClock, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import TaskDetailModal from '@/components/TaskDetailModal';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date?: string;
  start_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  progress_percentage: number;
  is_overdue: boolean;
  assignees: Array<{ id: number; username: string; email: string }>;
  created_by?: { id: number; username: string };
  tags?: string;
  list?: number;
  comments_count: number;
  created_at: string;
}

export default function MyTasksPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const statusOptions = ['all', 'Not Started', 'In Progress', 'Under Review', 'On Hold', 'Completed', 'Failed'];
  const priorityOptions = ['all', 'Low', 'Medium', 'High', 'Urgent'];

  const statusColors = {
    'Not Started': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-purple-100 text-purple-800',
    'On Hold': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'Failed': 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    Low: 'bg-green-50 border-green-200 text-green-700',
    Medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    High: 'bg-orange-50 border-orange-200 text-orange-700',
    Urgent: 'bg-red-50 border-red-200 text-red-700'
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter, priorityFilter, searchTerm, showOverdueOnly]);

  const fetchTasks = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${baseAPI}/task/cards/?user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        toast.error('Failed to load tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.tags?.toLowerCase().includes(searchLower)
      );
    }

    // Overdue filter
    if (showOverdueOnly) {
      filtered = filtered.filter(task => task.is_overdue);
    }

    setFilteredTasks(filtered);
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      notStarted: tasks.filter(t => t.status === 'Not Started').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => t.is_overdue).length
    };
  };

  const stats = getTaskStats();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <FaCheckCircle className="text-green-600" />;
      case 'In Progress':
        return <FaClock className="text-blue-600" />;
      case 'Failed':
        return <FaExclamationTriangle className="text-red-600" />;
      default:
        return <FaTasks className="text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaTasks className="text-blue-600" />
            My Tasks
          </h1>
          <p className="text-gray-600">Manage and track all your assigned tasks</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <FaTasks className="text-4xl text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Not Started</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">{stats.notStarted}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-700 mt-1">{stats.inProgress}</p>
              </div>
              <FaClock className="text-4xl text-blue-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Completed</p>
                <p className="text-3xl font-bold text-green-700 mt-1">{stats.completed}</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200 bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Overdue</p>
                <p className="text-3xl font-bold text-red-700 mt-1">{stats.overdue}</p>
              </div>
              <FaExclamationTriangle className="text-4xl text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Status' : option}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorityOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Priorities' : option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Overdue Toggle */}
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOverdueOnly}
                onChange={(e) => setShowOverdueOnly(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Show overdue tasks only</span>
            </label>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
              <FaTasks className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">
                {tasks.length === 0
                  ? "You don't have any tasks assigned yet."
                  : "No tasks match your current filters."}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`bg-white p-6 rounded-xl shadow-sm border-2 hover:shadow-md transition cursor-pointer ${
                  priorityColors[task.priority as keyof typeof priorityColors] || 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      {task.is_overdue && (
                        <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                          <FaExclamationTriangle size={10} />
                          Overdue
                        </span>
                      )}
                    </div>
                    <div 
                      className="text-gray-600 text-sm line-clamp-2 mb-3"
                      dangerouslySetInnerHTML={{ __html: task.description || 'No description' }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status as keyof typeof statusColors] || statusColors['Not Started']}`}>
                      {task.status}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <FaClock size={12} />
                      {formatDate(task.due_date)}
                    </span>
                    {task.actual_hours !== undefined && task.actual_hours > 0 && (
                      <span className="text-sm text-gray-600">
                        {task.actual_hours}h logged
                      </span>
                    )}
                    {task.comments_count > 0 && (
                      <span className="text-sm text-gray-600">
                        💬 {task.comments_count} comments
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Progress Bar */}
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${task.progress_percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {task.progress_percentage}%
                    </span>
                  </div>
                </div>

                {task.tags && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {task.tags.split(',').map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={fetchTasks}
          userId={user?.id}
        />
      )}
    </div>
  );
}

