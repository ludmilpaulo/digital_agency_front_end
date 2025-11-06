'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/slices/authSlice';
import axios from 'axios';
import { baseAPI } from '@/useAPI/api';
import toast from 'react-hot-toast';
import { 
  FaPlus, FaEdit, FaTrash, FaUsers, FaCalendar, FaMoneyBillWave,
  FaTasks, FaLink, FaChartLine, FaUserTie, FaEye
} from 'react-icons/fa';
import dayjs from 'dayjs';
import type { Board } from './types';
import RequestPermissionButton from './RequestPermissionButton';

interface User {
  id: number;
  username: string;
  email: string;
}

export default function BoardManager() {
  const user = useSelector(selectUser);
  const [boards, setBoards] = useState<Board[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  
  const [formData, setFormData] = useState<Partial<Board>>({
    name: '',
    description: '',
    development_link: '',
    repository_link: '',
    client_link: '',
    sample_link: '',
    budget: undefined,
    deadline: '',
    start_date: '',
    end_date: '',
    status: 'Started',
    users: [],
    managers: []
  });

  useEffect(() => {
    fetchBoards();
    fetchUsers();
    fetchManagers();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const token = user?.token || localStorage.getItem('token');
      const response = await axios.get(`${baseAPI}/task/boards/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setBoards(response.data);
    } catch (error) {
      console.error('Error fetching boards:', error);
      toast.error('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = user?.token || localStorage.getItem('token');
      const response = await axios.get(`${baseAPI}/task/users/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const token = user?.token || localStorage.getItem('token');
      const response = await axios.get(`${baseAPI}/account/profile/line_managers/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setManagers(response.data);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const openModal = (board?: Board) => {
    if (board) {
      setEditingBoard(board);
      setFormData({
        ...board,
        users: board.users || [],
        managers: board.managers || []
      });
    } else {
      setEditingBoard(null);
      setFormData({
        name: '',
        description: '',
        development_link: '',
        repository_link: '',
        client_link: '',
        sample_link: '',
        budget: undefined,
        deadline: '',
        start_date: '',
        end_date: '',
        status: 'Started',
        users: [],
        managers: []
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error('Board name is required');
      return;
    }

    try {
      const token = user?.token || localStorage.getItem('token');
      
      const payload = {
        ...formData,
        users_ids: formData.users,
        managers_ids: formData.managers
      };

      if (editingBoard) {
        // Update
        await axios.put(
          `${baseAPI}/task/boards/${editingBoard.id}/`,
          payload,
          { headers: { Authorization: `Token ${token}` } }
        );
        toast.success('Board updated successfully!');
      } else {
        // Create
        await axios.post(
          `${baseAPI}/task/boards/`,
          payload,
          { headers: { Authorization: `Token ${token}` } }
        );
        toast.success('Board created successfully!');
      }

      setShowModal(false);
      fetchBoards();
    } catch (error: any) {
      console.error('Error saving board:', error);
      toast.error(error.response?.data?.detail || 'Failed to save board');
    }
  };

  const handleDelete = async (boardId: number) => {
    if (!confirm('Are you sure you want to delete this board? This cannot be undone.')) {
      return;
    }

    try {
      const token = user?.token || localStorage.getItem('token');
      await axios.delete(`${baseAPI}/task/boards/${boardId}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      toast.success('Board deleted successfully!');
      fetchBoards();
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error('Failed to delete board');
    }
  };

  const getBudgetPercentage = (board: Board) => {
    if (!board.budget || !board.budgetUsed) return 0;
    return Math.min((board.budgetUsed / board.budget) * 100, 100);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Started': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Concluded': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
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
          Project Boards
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg font-semibold"
        >
          <FaPlus /> Create Board
        </button>
      </div>

      {/* Boards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <div
            key={board.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{board.name}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(board.status)} bg-white/90`}>
                {board.status}
              </span>
            </div>

            <div className="p-6">
              {board.description && (
                <div 
                  className="text-sm text-gray-600 mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: board.description }}
                />
              )}

              <div className="space-y-2 text-sm mb-4">
                {board.deadline && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaCalendar className="text-blue-500" />
                    <span>Due: {dayjs(board.deadline).format('MMM DD, YYYY')}</span>
                  </div>
                )}

                {board.budget && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <FaMoneyBillWave className="text-green-500" />
                      <span>Budget: R{board.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${getBudgetPercentage(board)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Used: R{(board.budgetUsed || 0).toLocaleString()}
                    </p>
                  </div>
                )}

                {board.managers && board.managers.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaUserTie className="text-purple-500" />
                    <span>{board.managers.length} Manager(s)</span>
                  </div>
                )}

                {board.users && board.users.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaUsers className="text-indigo-500" />
                    <span>{board.users.length} Team Member(s)</span>
                  </div>
                )}
              </div>

              {/* Links */}
              {(board.development_link || board.repository_link || board.client_link) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {board.development_link && (
                    <a
                      href={board.development_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                    >
                      <FaLink className="inline mr-1" />Dev
                    </a>
                  )}
                  {board.repository_link && (
                    <a
                      href={board.repository_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition"
                    >
                      <FaLink className="inline mr-1" />Repo
                    </a>
                  )}
                  {board.client_link && (
                    <a
                      href={board.client_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition"
                    >
                      <FaLink className="inline mr-1" />Client
                    </a>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {board.can_edit !== false ? (
                  <>
                    <button
                      onClick={() => openModal(board)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(board.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-500 rounded-lg text-sm font-medium">
                      <FaEye /> View Only
                    </div>
                    <RequestPermissionButton
                      type="board"
                      targetId={board.id}
                      targetName={board.name}
                      onRequestSent={fetchBoards}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {boards.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FaTasks className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Boards Yet</h3>
          <p className="text-gray-500 mb-6">Create your first board to start managing projects!</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <FaPlus className="inline mr-2" />Create First Board
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
              <h3 className="text-2xl font-bold">
                {editingBoard ? 'Edit Board' : 'Create New Board'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Board Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Board Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Website Redesign Project"
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
                    placeholder="Project description and goals..."
                  />
                </div>

                {/* Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaLink className="inline mr-1" /> Development Link
                  </label>
                  <input
                    type="url"
                    value={formData.development_link}
                    onChange={(e) => setFormData({ ...formData, development_link: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://dev.example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaLink className="inline mr-1" /> Repository Link
                  </label>
                  <input
                    type="url"
                    value={formData.repository_link}
                    onChange={(e) => setFormData({ ...formData, repository_link: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaLink className="inline mr-1" /> Client Link
                  </label>
                  <input
                    type="url"
                    value={formData.client_link}
                    onChange={(e) => setFormData({ ...formData, client_link: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://client.example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaLink className="inline mr-1" /> Sample/Demo Link
                  </label>
                  <input
                    type="url"
                    value={formData.sample_link}
                    onChange={(e) => setFormData({ ...formData, sample_link: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://demo.example.com"
                  />
                </div>

                {/* Dates */}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaMoneyBillWave className="inline mr-1" /> Budget (Rands)
                  </label>
                  <input
                    type="number"
                    value={formData.budget || ''}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || undefined })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="50000"
                  />
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
                    <option value="Started">Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Concluded">Concluded</option>
                  </select>
                </div>

                {/* Line Managers */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUserTie className="inline mr-1" /> Assign Line Managers
                  </label>
                  <select
                    multiple
                    value={formData.managers?.map(String) || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                      setFormData({ ...formData, managers: selected });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 h-24"
                  >
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.username} - {manager.email}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple managers</p>
                </div>

                {/* Team Members */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUsers className="inline mr-1" /> Assign Team Members
                  </label>
                  <select
                    multiple
                    value={formData.users?.map(String) || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                      setFormData({ ...formData, users: selected });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 h-24"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} - {u.email}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple team members</p>
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
                  {editingBoard ? 'Update Board' : 'Create Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

