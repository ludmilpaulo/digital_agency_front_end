'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/slices/authSlice';
import axios from 'axios';
import { baseAPI } from '@/useAPI/api';
import toast from 'react-hot-toast';
import SignatureCanvas from 'react-signature-canvas';
import { 
  FaFileAlt, FaPen, FaCheck, FaTimes, FaDownload, FaClock, 
  FaUser, FaCheckCircle, FaTimesCircle, FaEye 
} from 'react-icons/fa';
import dayjs from 'dayjs';

interface StaffDocument {
  id: number;
  title: string;
  document_type: string;
  description: string;
  original_document: string;
  signed_document: string | null;
  staff_user: {
    id: number;
    username: string;
    email: string;
  };
  line_manager: {
    id: number;
    username: string;
    email: string;
  } | null;
  created_by: {
    id: number;
    username: string;
    email: string;
  } | null;
  staff_signature: string | null;
  staff_signed_at: string | null;
  staff_comments: string;
  manager_signature: string | null;
  manager_signed_at: string | null;
  manager_comments: string;
  rejection_reason: string;
  status: 'pending_staff' | 'pending_manager' | 'completed' | 'rejected';
  created_at: string;
  is_fully_signed: boolean;
  needs_staff_signature: boolean;
  needs_manager_signature: boolean;
}

export default function DocumentSigner() {
  const user = useSelector(selectUser);
  const [documents, setDocuments] = useState<StaffDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<StaffDocument | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signing, setSigning] = useState(false);
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  
  const signaturePadRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = user?.token || localStorage.getItem('token');
      const response = await axios.get(
        `${baseAPI}/task/staff-documents/pending_my_signature/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDocuments(response.data.all_pending || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const openSignModal = (doc: StaffDocument) => {
    setSelectedDoc(doc);
    setShowSignModal(true);
    setComments('');
    setRejectionReason('');
    setIsRejecting(false);
  };

  const clearSignature = () => {
    signaturePadRef.current?.clear();
  };

  const handleSign = async () => {
    if (!selectedDoc) return;

    if (signaturePadRef.current?.isEmpty()) {
      toast.error('Please provide a signature');
      return;
    }

    try {
      setSigning(true);
      const token = user?.token || localStorage.getItem('token');
      const signatureData = signaturePadRef.current?.toDataURL();
      
      // Determine which endpoint to use
      const isManager = selectedDoc.line_manager?.id === user?.user_id || user?.id;
      const endpoint = isManager ? 'sign_by_manager' : 'sign_by_staff';
      
      await axios.post(
        `${baseAPI}/task/staff-documents/${selectedDoc.id}/${endpoint}/`,
        {
          signature: signatureData,
          comments: comments,
          approved: !isRejecting
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Document signed successfully!');
      setShowSignModal(false);
      fetchDocuments();
    } catch (error: any) {
      console.error('Error signing document:', error);
      toast.error(error.response?.data?.detail || 'Failed to sign document');
    } finally {
      setSigning(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDoc || !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setSigning(true);
      const token = user?.token || localStorage.getItem('token');
      
      await axios.post(
        `${baseAPI}/task/staff-documents/${selectedDoc.id}/sign_by_manager/`,
        {
          approved: false,
          rejection_reason: rejectionReason,
          comments: comments
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Document rejected');
      setShowSignModal(false);
      fetchDocuments();
    } catch (error: any) {
      console.error('Error rejecting document:', error);
      toast.error(error.response?.data?.detail || 'Failed to reject document');
    } finally {
      setSigning(false);
    }
  };

  const downloadDocument = async (doc: StaffDocument) => {
    try {
      const token = user?.token || localStorage.getItem('token');
      const response = await axios.get(
        `${baseAPI}/task/staff-documents/${doc.id}/download/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
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
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <FaClock /> Pending Your Signature
        </span>;
      case 'pending_manager':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <FaClock /> Pending Manager
        </span>;
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <FaCheckCircle /> Completed
        </span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <FaTimesCircle /> Rejected
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

  const isManager = (doc: StaffDocument) => {
    return doc.line_manager?.id === (user?.user_id || user?.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Documents
        </h2>
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Pending Documents</h3>
          <p className="text-gray-500">You don't have any documents requiring your signature at the moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{doc.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{doc.document_type}</p>
                  {getStatusBadge(doc.status)}
                </div>
                <FaFileAlt className="text-3xl text-blue-500" />
              </div>

              {doc.description && (
                <p className="text-sm text-gray-700 mb-4">{doc.description}</p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <FaUser className="text-gray-400" />
                  <span className="text-gray-600">Staff:</span>
                  <span className="font-medium">{doc.staff_user.username}</span>
                  {doc.staff_signed_at && <FaCheckCircle className="text-green-500" />}
                </div>
                
                {doc.line_manager && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaUser className="text-gray-400" />
                    <span className="text-gray-600">Manager:</span>
                    <span className="font-medium">{doc.line_manager.username}</span>
                    {doc.manager_signed_at && <FaCheckCircle className="text-green-500" />}
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaClock />
                  Created {dayjs(doc.created_at).format('MMM DD, YYYY')}
                </div>
              </div>

              {doc.rejection_reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-800"><strong>Rejected:</strong> {doc.rejection_reason}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => downloadDocument(doc)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm"
                >
                  <FaDownload /> Download
                </button>
                
                {doc.needs_staff_signature && !isManager(doc) && (
                  <button
                    onClick={() => openSignModal(doc)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-semibold"
                  >
                    <FaPen /> Sign
                  </button>
                )}
                
                {doc.needs_manager_signature && isManager(doc) && (
                  <button
                    onClick={() => openSignModal(doc)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-semibold"
                  >
                    <FaPen /> Review & Sign
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Signature Modal */}
      {showSignModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedDoc.document_type}</p>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Document Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2">Document Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Staff:</strong> {selectedDoc.staff_user.username}</p>
                  {selectedDoc.line_manager && (
                    <p><strong>Manager:</strong> {selectedDoc.line_manager.username}</p>
                  )}
                  <p><strong>Created:</strong> {dayjs(selectedDoc.created_at).format('MMM DD, YYYY HH:mm')}</p>
                  {selectedDoc.staff_signed_at && (
                    <p className="text-green-600">
                      <FaCheckCircle className="inline mr-1" />
                      <strong>Staff Signed:</strong> {dayjs(selectedDoc.staff_signed_at).format('MMM DD, YYYY HH:mm')}
                    </p>
                  )}
                </div>
              </div>

              {/* Comments Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any comments or notes..."
                />
              </div>

              {/* For Managers: Approve/Reject Options */}
              {isManager(selectedDoc) && selectedDoc.needs_manager_signature && (
                <div className="mb-6">
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isRejecting}
                        onChange={() => setIsRejecting(false)}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm font-medium">Approve & Sign</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={isRejecting}
                        onChange={() => setIsRejecting(true)}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm font-medium">Reject</span>
                    </label>
                  </div>

                  {isRejecting && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Please explain why this document is being rejected..."
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Signature Pad */}
              {!isRejecting && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Signature <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-gray-300 rounded-lg bg-white">
                    <SignatureCanvas
                      ref={signaturePadRef}
                      canvasProps={{
                        className: 'w-full h-48 rounded-lg',
                        style: { touchAction: 'none' }
                      }}
                      backgroundColor="white"
                    />
                  </div>
                  <button
                    onClick={clearSignature}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear Signature
                  </button>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t bg-gray-50 rounded-b-xl flex gap-3">
              <button
                onClick={() => setShowSignModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
              >
                Cancel
              </button>
              
              {isRejecting ? (
                <button
                  onClick={handleReject}
                  disabled={signing || !rejectionReason.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-semibold"
                >
                  <FaTimes /> {signing ? 'Rejecting...' : 'Reject Document'}
                </button>
              ) : (
                <button
                  onClick={handleSign}
                  disabled={signing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold"
                >
                  <FaCheck /> {signing ? 'Signing...' : isManager(selectedDoc) ? 'Approve & Sign' : 'Sign Document'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

