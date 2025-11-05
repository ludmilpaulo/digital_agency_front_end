'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { baseAPI } from '@/useAPI/api';
import toast from 'react-hot-toast';
import SignatureCanvas from 'react-signature-canvas';
import { 
  FaFileAlt, FaPen, FaCheck, FaTimes, FaDownload, FaClock, 
  FaUser, FaCheckCircle, FaTimesCircle, FaUpload, FaPaperPlane
} from 'react-icons/fa';
import dayjs from 'dayjs';

interface User {
  id: number;
  username: string;
  email: string;
}

interface StaffDocument {
  id: number;
  title: string;
  document_type: string;
  description: string;
  original_document: string;
  signed_document: string | null;
  staff_user: User;
  line_manager: User | null;
  created_by: User | null;
  staff_signature: string | null;
  staff_signed_at: string | null;
  manager_signature: string | null;
  manager_signed_at: string | null;
  status: string;
  created_at: string;
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<StaffDocument[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<StaffDocument | null>(null);
  const [uploading, setUploading] = useState(false);
  const [signing, setSigning] = useState(false);
  
  const [uploadData, setUploadData] = useState({
    title: '',
    document_type: 'contract',
    description: '',
    staff_user_id: '',
    line_manager_id: ''
  });
  
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const signaturePadRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    fetchDocuments();
    fetchUsers();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseAPI}/task/staff-documents/`);
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseAPI}/account/users/`);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadData.title.trim() || !documentFile || !uploadData.staff_user_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('document_type', uploadData.document_type);
      formData.append('description', uploadData.description);
      formData.append('original_document', documentFile);
      formData.append('staff_user_id', uploadData.staff_user_id);
      
      if (uploadData.line_manager_id) {
        formData.append('line_manager_id', uploadData.line_manager_id);
      }

      await axios.post(`${baseAPI}/task/staff-documents/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Document uploaded and sent to staff member!');
      setShowUploadModal(false);
      setUploadData({
        title: '',
        document_type: 'contract',
        description: '',
        staff_user_id: '',
        line_manager_id: ''
      });
      setDocumentFile(null);
      fetchDocuments();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = async (doc: StaffDocument) => {
    try {
      const response = await axios.get(
        `${baseAPI}/task/staff-documents/${doc.id}/download/`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${doc.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Document downloaded');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_staff':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
          Pending Staff
        </span>;
      case 'pending_manager':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
          Pending Manager
        </span>;
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          Completed
        </span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
          Rejected
        </span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const staffUsers = users.filter(u => u.id);  // All users can be staff
  const managers = users.filter(u => u.id); // All users can be managers

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Document Management</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg font-semibold"
        >
          <FaUpload /> Send Document to Staff
        </button>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{doc.title}</div>
                    {doc.description && (
                      <div className="text-sm text-gray-500">{doc.description}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      Created {dayjs(doc.created_at).format('MMM DD, YYYY')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{doc.document_type}</td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{doc.staff_user.username}</div>
                    {doc.staff_signed_at && (
                      <div className="text-green-600 flex items-center gap-1 text-xs">
                        <FaCheckCircle /> Signed {dayjs(doc.staff_signed_at).format('MMM DD')}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {doc.line_manager ? (
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{doc.line_manager.username}</div>
                      {doc.manager_signed_at && (
                        <div className="text-green-600 flex items-center gap-1 text-xs">
                          <FaCheckCircle /> Signed {dayjs(doc.manager_signed_at).format('MMM DD')}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No manager</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(doc.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadDocument(doc)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Download"
                    >
                      <FaDownload />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {documents.length === 0 && (
          <div className="text-center py-12">
            <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No documents yet. Upload one to get started!</p>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Send Document to Staff</h3>
              <p className="text-sm text-gray-600 mt-1">Upload a document for staff to sign</p>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Document Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., Employment Contract - John Doe"
                  />
                </div>

                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={uploadData.document_type}
                    onChange={(e) => setUploadData({ ...uploadData, document_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="contract">Contract</option>
                    <option value="agreement">Agreement</option>
                    <option value="nda">NDA</option>
                    <option value="offer">Job Offer</option>
                    <option value="timesheet">Timesheet</option>
                    <option value="expense">Expense Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Brief description..."
                  />
                </div>

                {/* Staff User Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Send To (Staff Member) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={uploadData.staff_user_id}
                    onChange={(e) => setUploadData({ ...uploadData, staff_user_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select staff member...</option>
                    {staffUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} - {u.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Line Manager Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Line Manager (Optional - will sign after staff)
                  </label>
                  <select
                    value={uploadData.line_manager_id}
                    onChange={(e) => setUploadData({ ...uploadData, line_manager_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">No manager required</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.username} - {m.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document File <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {documentFile && (
                    <div className="mt-2 p-2 bg-blue-50 rounded flex items-center gap-2 text-sm">
                      <FaFileAlt className="text-blue-600" />
                      <span className="text-blue-900">{documentFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setDocumentFile(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadDocument}
                disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                <FaPaperPlane /> {uploading ? 'Sending...' : 'Send Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

