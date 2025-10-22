"use client";

import { useState, useEffect } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { baseAPI } from '@/useAPI/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Board {
  id: number;
  name: string;
}

interface List {
  id: number;
  name: string;
  board: number;
}

interface CreateTaskModalProps {
  onClose: () => void;
  onSuccess: () => void;
  boardId?: number;
  listId?: number;
}

export default function CreateTaskModal({ onClose, onSuccess, boardId, listId }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    list: listId || '',
    start_date: '',
    due_date: '',
    estimated_hours: '',
    tags: '',
    assignees_ids: [] as number[]
  });

  const [boards, setBoards] = useState<Board[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<number>(boardId || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const statusOptions = ['Not Started', 'In Progress', 'Under Review', 'On Hold', 'Completed'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      fetchLists(selectedBoard);
    }
  }, [selectedBoard]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch boards
      const boardsResponse = await fetch(`${baseAPI}/task/boards/`);
      if (boardsResponse.ok) {
        const boardsData = await boardsResponse.json();
        setBoards(boardsData);
        if (boardId) {
          setSelectedBoard(boardId);
        }
      }

      // Fetch users
      const usersResponse = await fetch(`${baseAPI}/task/users/`);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }

      if (boardId) {
        await fetchLists(boardId);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load form data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLists = async (boardIdToFetch: number) => {
    try {
      const response = await fetch(`${baseAPI}/task/boards/${boardIdToFetch}/`);
      if (response.ok) {
        const boardData = await response.json();
        setLists(boardData.lists || []);
        
        // Auto-select first list if listId not provided
        if (!listId && boardData.lists && boardData.lists.length > 0) {
          setFormData(prev => ({ ...prev, list: boardData.lists[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    if (!formData.list) {
      toast.error('Please select a list');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        list: Number(formData.list),
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
        start_date: formData.start_date || null,
        due_date: formData.due_date || null,
      };

      const response = await fetch(`${baseAPI}/task/cards/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success('Task created successfully!');
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        toast.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAssignee = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      assignees_ids: prev.assignees_ids.includes(userId)
        ? prev.assignees_ids.filter(id => id !== userId)
        : [...prev.assignees_ids, userId]
    }));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaPlus className="text-blue-600" />
            Create New Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task in detail..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Board and List Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Board *
              </label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(Number(e.target.value))}
                required
                disabled={!!boardId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select Board</option>
                {boards.map(board => (
                  <option key={board.id} value={board.id}>{board.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                List *
              </label>
              <select
                name="list"
                value={formData.list}
                onChange={handleChange}
                required
                disabled={!selectedBoard || !!listId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select List</option>
                {lists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Estimated Hours and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                name="estimated_hours"
                value={formData.estimated_hours}
                onChange={handleChange}
                placeholder="e.g., 8"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="design, frontend, urgent"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Assign Users */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Assign To
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg">
              {users.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center">No users available</p>
              ) : (
                users.map(user => (
                  <label
                    key={user.id}
                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignees_ids.includes(user.id)}
                      onChange={() => toggleAssignee(user.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{user.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            {formData.assignees_ids.length > 0 && (
              <p className="text-sm text-blue-600 mt-2">
                {formData.assignees_ids.length} user(s) selected
              </p>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 bg-white border-t -mx-6 -mb-6 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

