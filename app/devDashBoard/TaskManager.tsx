'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/slices/authSlice';
import axios from 'axios';
import { baseAPI } from '@/useAPI/api';
import toast from 'react-hot-toast';
import { 
  FaPlus, FaEdit, FaTrash, FaUser, FaClock, FaFlag,
  FaCheckCircle, FaTimesCircle, FaComment, FaImage
} from 'react-icons/fa';
import dayjs from 'dayjs';
import type { Card as Task } from './types';

interface User {
  id: number;
  username: string;
  email: string;
}

interface List {
  id: number;
  name: string;
  board: number;
}

interface TaskManagerProps {
  boardId?: number;
}

export default function TaskManager({ boardId }: TaskManagerProps) {
  const user = useSelector(selectUser);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    list: 0,
    assignees: [],
    start_date: '',
    due_date: '',
    estimated_hours: undefined,
    tags: ''
  });

  useEffect(() => {
    fetchTasks();
    fetchLists();
    fetchUsers();
  }, [boardId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = user?.token || localStorage.getItem('token');
      const response = await axios.get(`${baseAPI}/task/cards/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let filteredTasks = response.data;
      if (boardId) {
        // Filter by board if provided
        filteredTasks = filteredTasks.filter((task: Task) => {
          const taskList = lists.find(l => l.id === task.list);
          return taskList?.board === boardId;
        });
      }
      
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchLists = async () => {
    try {
      const token = user?.token || localStorage.getItem('token');
      const response = await axios.get(`${baseAPI}/task/lists/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let filteredLists = response.data;
      if (boardId) {
        filteredLists = filteredLists.filter((list: List) => list.board === boardId);
      }
      
      setLists(filteredLists);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = user?.token || localStorage.getItem('token');
      const response = await axios.get(`${baseAPI}/task/users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        ...task,
        assignees: task.assignees.map(a => typeof a === 'number' ? a : a.id)
      });
      setImagePreview(task.image || null);
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'Not Started',
        priority: 'Medium',
        list: lists[0]?.id || 0,
        assignees: [],
        start_date: '',
        due_date: '',
        estimated_hours: undefined,
        tags: ''
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (!formData.list) {
      toast.error('Please select a list for this task');
      return;
    }

    try {
      const token = user?.token || localStorage.getItem('token');
      
      // Prepare form data for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description || '');
      submitData.append('status', formData.status || 'Not Started');
      submitData.append('priority', formData.priority || 'Medium');
      submitData.append('list', String(formData.list));
      
      if (formData.start_date) submitData.append('start_date', formData.start_date);
      if (formData.due_date) submitData.append('due_date', formData.due_date);
      if (formData.estimated_hours) submitData.append('estimated_hours', String(formData.estimated_hours));
      if (formData.tags) submitData.append('tags', formData.tags);
      
      // Add assignees
      if (formData.assignees && formData.assignees.length > 0) {
        formData.assignees.forEach((assigneeId: any) => {
          submitData.append('assignees_ids', String(assigneeId));
        });
      }
      
      // Add image if new one selected
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (editingTask) {
        // Update
        await axios.patch(
          `${baseAPI}/task/cards/${editingTask.id}/`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Task updated successfully!');
      } else {
        // Create
        await axios.post(
          `${baseAPI}/task/cards/`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Task created successfully!');
      }

      setShowModal(false);
      fetchTasks();
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast.error(error.response?.data?.detail || 'Failed to save task');
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const token = user?.token || localStorage.getItem('token');
      await axios.delete(`${baseAPI}/task/cards/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started': return 'bg-gray-100 text-gray-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      case 'On Hold': return 'bg-yellow-100 text-yellow-700';
      case 'Under Review': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'Urgent': return <FaFlag className="text-red-500" />;
      case 'High': return <FaFlag className="text-orange-500" />;
      case 'Medium': return <FaFlag className="text-yellow-500" />;
      case 'Low': return <FaFlag className="text-green-500" />;
      default: return <FaFlag className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Tasks
        </h2>
        <button
          onClick={() => openModal()}
          disabled={lists.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg font-semibold disabled:opacity-50"
        >
          <FaPlus /> Create Task
        </button>
      </div>

      {lists.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            <strong>Note:</strong> Please create a board and list first before adding tasks.
          </p>
        </div>
      )}

      {/* Tasks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
          >
            {task.image && (
              <div className="h-40 overflow-hidden rounded-t-xl">
                <img
                  src={task.image}
                  alt={task.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex-1">{task.title}</h3>
                {getPriorityIcon(task.priority)}
              </div>

              {task.description && (
                <div
                  className="text-sm text-gray-600 mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: task.description }}
                />
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                {task.due_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaClock className="text-blue-500" />
                    <span>Due: {dayjs(task.due_date).format('MMM DD, YYYY')}</span>
                  </div>
                )}

                {task.assignees && task.assignees.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaUser className="text-purple-500" />
                    <span>{task.assignees.length} Assignee(s)</span>
                  </div>
                )}

                {task.estimated_hours && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaClock className="text-green-500" />
                    <span>{task.estimated_hours}h estimated</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {task.tags && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {task.tags.split(',').filter(t => t.trim()).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => openModal(task)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && lists.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FaCheckCircle className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Tasks Yet</h3>
          <p className="text-gray-500 mb-6">Create your first task to get started!</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <FaPlus className="inline mr-2" />Create First Task
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
              <h3 className="text-2xl font-bold">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Task Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Implement user authentication"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Task details and requirements..."
                  />
                </div>

                {/* List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    List <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.list}
                    onChange={(e) => setFormData({ ...formData, list: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a list</option>
                    {lists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                {/* Estimated Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.estimated_hours || ''}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: parseFloat(e.target.value) || undefined })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="8"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Assignees */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="inline mr-1" /> Assign To
                  </label>
                  <select
                    multiple
                    value={formData.assignees?.map(String) || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                      setFormData({ ...formData, assignees: selected });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 h-24"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} - {u.email}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple assignees</p>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="frontend, bug-fix, enhancement"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaImage className="inline mr-1" /> Attach Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="mt-6 flex gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

