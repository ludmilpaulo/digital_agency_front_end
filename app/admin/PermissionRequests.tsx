'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseAPI } from '@/useAPI/api';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaClock, FaUser, FaProjectDiagram, FaTasks } from 'react-icons/fa';
import dayjs from 'dayjs';

interface User {
  id: number;
  username: string;
  email: string;
}

interface PermissionRequest {
  id: number;
  user: User;
  request_type: string;
  board?: number;
  board_name?: string;
  card?: number;
  card_title?: string;
  reason: string;
  status: string;
  reviewed_by?: User;
  reviewed_at?: string;
  response_message?: string;
  created_at: string;
}

export default function PermissionRequests() {
  const [requests, setRequests] = useState<PermissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PermissionRequest | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseAPI}/task/permission-requests/`);
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching permission requests:', error);
      toast.error('Failed to load permission requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: PermissionRequest) => {
    setSelectedRequest(request);
    setShowResponseModal(true);
  };

  const handleReject = async (request: PermissionRequest) => {
    setSelectedRequest(request);
    setShowResponseModal(true);
  };

  const submitResponse = async (approve: boolean) => {
    if (!selectedRequest) return;

    try {
      setResponding(true);
      const endpoint = approve ? 'approve' : 'reject';
      
      await axios.post(
        `${baseAPI}/task/permission-requests/${selectedRequest.id}/${endpoint}/`,
        { response_message: responseMessage }
      );

      toast.success(`Request ${approve ? 'approved' : 'rejected'} successfully!`);
      setShowResponseModal(false);
      setSelectedRequest(null);
      setResponseMessage('');
      fetchRequests();
    } catch (error: any) {
      console.error('Error responding to request:', error);
      toast.error(error.response?.data?.detail || 'Failed to respond to request');
    } finally {
      setResponding(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
          Pending
        </span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          Approved
        </span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
          Rejected
        </span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Permission Requests</h2>
        <p className="text-gray-600">Review and manage access requests for boards and tasks</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{req.user.username}</div>
                      <div className="text-sm text-gray-500">{req.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {req.request_type === 'board' ? (
                      <FaProjectDiagram className="text-blue-500" />
                    ) : (
                      <FaTasks className="text-green-500" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {req.request_type === 'board' ? 'Board' : 'Task'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {req.board_name || req.card_title || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate" title={req.reason}>
                    {req.reason}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(req.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {dayjs(req.created_at).format('MMM DD, YYYY')}
                  </div>
                  {req.reviewed_at && (
                    <div className="text-xs text-gray-400">
                      Reviewed {dayjs(req.reviewed_at).format('MMM DD')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {req.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setShowResponseModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setShowResponseModal(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FaClock className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No permission requests found</p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Respond to Request</h3>
              <p className="text-sm text-gray-600 mt-1">
                Request from <b>{selectedRequest.user.username}</b> for{' '}
                <b>{selectedRequest.board_name || selectedRequest.card_title}</b>
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700"><b>Reason:</b> {selectedRequest.reason}</p>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Message (Optional)
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Add a message to the user..."
              />
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedRequest(null);
                  setResponseMessage('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => submitResponse(false)}
                disabled={responding}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold"
              >
                <FaTimes /> Reject
              </button>
              <button
                onClick={() => submitResponse(true)}
                disabled={responding}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
              >
                <FaCheck /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

