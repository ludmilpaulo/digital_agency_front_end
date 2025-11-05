'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { baseAPI } from '@/useAPI/api';
import toast from 'react-hot-toast';
import { FaLock, FaPaperPlane } from 'react-icons/fa';

interface RequestPermissionButtonProps {
  type: 'board' | 'task';
  targetId: number;
  targetName: string;
  onRequestSent?: () => void;
}

export default function RequestPermissionButton({ 
  type, 
  targetId, 
  targetName,
  onRequestSent 
}: RequestPermissionButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRequestPermission = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for your request');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload: any = {
        request_type: type,
        reason: reason,
      };

      if (type === 'board') {
        payload.board = targetId;
      } else {
        payload.card = targetId;
      }

      await axios.post(`${baseAPI}/task/permission-requests/`, payload);

      toast.success('Permission request sent to manager!');
      setShowModal(false);
      setReason('');
      onRequestSent?.();
    } catch (error: any) {
      console.error('Error requesting permission:', error);
      toast.error(error.response?.data?.detail || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold shadow"
      >
        <FaLock /> Request Access
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Request Access</h3>
              <p className="text-sm text-gray-600 mt-1">
                Request permission to work on <b>{targetName}</b>
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you need access? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Explain why you need to work on this..."
              />
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setReason('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestPermission}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                <FaPaperPlane /> {submitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

