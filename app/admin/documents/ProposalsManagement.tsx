"use client";

import { useState, useEffect } from 'react';
import { FaFileContract, FaEdit, FaFilePdf, FaSignature, FaPaperPlane, FaDownload, FaEye, FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { baseAPI } from '@/useAPI/api';
import SignaturePadModal from './SignaturePadModal';
import EditProposalModal from './EditProposalModal';

interface Proposal {
  id: number;
  proposal_number: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  time_frame: string;
  message: string;
  status: string;
  board?: number;
  board_name?: string;
  estimated_budget?: number;
  estimated_duration?: string;
  scope_of_work?: string;
  deliverables: any[];
  terms_and_conditions?: string;
  proposal_pdf?: string;
  admin_signature?: string;
  admin_signed_at?: string;
  client_signature?: string;
  client_signed_at?: string;
  submitted_at: string;
  is_fully_signed: boolean;
  can_client_sign: boolean;
}

export default function ProposalsManagement() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = ['all', 'pending', 'draft', 'admin_signed', 'sent_to_client', 'client_signed', 'approved', 'declined'];
  
  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-blue-100 text-blue-800',
    admin_signed: 'bg-purple-100 text-purple-800',
    sent_to_client: 'bg-indigo-100 text-indigo-800',
    client_signed: 'bg-green-100 text-green-800',
    approved: 'bg-green-600 text-white',
    declined: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  useEffect(() => {
    filterProposals();
  }, [proposals, statusFilter, searchTerm]);

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseAPI}/services/proposals/`);
      if (response.ok) {
        const data = await response.json();
        setProposals(data);
      } else {
        toast.error('Failed to load proposals');
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  };

  const filterProposals = () => {
    let filtered = [...proposals];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => (p.status || 'pending') === statusFilter);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.name || '').toLowerCase().includes(searchLower) ||
        (p.company || '').toLowerCase().includes(searchLower) ||
        (p.email || '').toLowerCase().includes(searchLower) ||
        (p.service || '').toLowerCase().includes(searchLower) ||
        (p.proposal_number || '').toLowerCase().includes(searchLower)
      );
    }

    setFilteredProposals(filtered);
  };

  const handleGeneratePDF = async (proposalId: number) => {
    try {
      const response = await fetch(`${baseAPI}/services/proposals/${proposalId}/generate_pdf/`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('PDF generated successfully!');
        fetchProposals();
      } else {
        toast.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleAdminSign = async (proposalId: number, signatureData: string) => {
    try {
      const response = await fetch(`${baseAPI}/services/proposals/${proposalId}/admin_sign/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ signature: signatureData })
      });

      if (response.ok) {
        toast.success('Proposal signed successfully!');
        setShowSignModal(false);
        setSelectedProposal(null);
        fetchProposals();
      } else {
        toast.error('Failed to sign proposal');
      }
    } catch (error) {
      console.error('Error signing proposal:', error);
      toast.error('Failed to sign proposal');
    }
  };

  const handleSendToClient = async (proposalId: number) => {
    if (!window.confirm('Send this proposal to the client?')) return;

    try {
      const response = await fetch(`${baseAPI}/services/proposals/${proposalId}/send_to_client/`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Proposal sent to client!');
        fetchProposals();
      } else {
        toast.error('Failed to send proposal');
      }
    } catch (error) {
      console.error('Error sending proposal:', error);
      toast.error('Failed to send proposal');
    }
  };

  const handleDownloadPDF = async (proposalId: number, proposalNumber: string) => {
    try {
      const response = await fetch(`${baseAPI}/services/proposals/${proposalId}/download_pdf/`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Proposal_${proposalNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('PDF downloaded!');
      } else {
        toast.error('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) status = 'pending';
    const displayStatus = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {displayStatus}
      </span>
    );
  };

  const getActionButtons = (proposal: Proposal) => {
    const buttons = [];

    // Edit button (always available)
    buttons.push(
      <button
        key="edit"
        onClick={() => {
          setSelectedProposal(proposal);
          setShowEditModal(true);
        }}
        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
      >
        <FaEdit /> Edit Details
      </button>
    );

    // Generate PDF (if pending or draft)
    if (proposal.status === 'pending' || proposal.status === 'draft') {
      buttons.push(
        <button
          key="generate"
          onClick={() => handleGeneratePDF(proposal.id)}
          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
        >
          <FaFilePdf /> Generate PDF
        </button>
      );
    }

    // Sign (if draft or PDF exists but not signed)
    if ((proposal.status === 'draft' || proposal.proposal_pdf) && !proposal.admin_signature) {
      buttons.push(
        <button
          key="sign"
          onClick={() => {
            setSelectedProposal(proposal);
            setShowSignModal(true);
          }}
          className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2"
        >
          <FaSignature /> Sign Proposal
        </button>
      );
    }

    // Send to client (if admin signed)
    if (proposal.status === 'admin_signed' && proposal.admin_signature) {
      buttons.push(
        <button
          key="send"
          onClick={() => handleSendToClient(proposal.id)}
          className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-2"
        >
          <FaPaperPlane /> Send to Client
        </button>
      );
    }

    // Download PDF (if exists)
    if (proposal.proposal_pdf) {
      buttons.push(
        <button
          key="download"
          onClick={() => handleDownloadPDF(proposal.id, proposal.proposal_number)}
          className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm flex items-center gap-2"
        >
          <FaDownload /> Download
        </button>
      );
    }

    return buttons;
  };

  const getStatistics = () => {
    return {
      total: proposals.length,
      pending: proposals.filter(p => p.status === 'pending').length,
      draft: proposals.filter(p => p.status === 'draft').length,
      signed: proposals.filter(p => p.is_fully_signed).length,
      sent: proposals.filter(p => p.status === 'sent_to_client').length
    };
  };

  const stats = getStatistics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposals...</p>
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
            <FaFileContract className="text-blue-600" />
            Proposal Management
          </h1>
          <p className="text-gray-600">Manage client proposals, generate PDFs, and handle signatures</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Proposals</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-yellow-200">
            <p className="text-sm text-yellow-600">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-700 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200">
            <p className="text-sm text-blue-600">Draft</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{stats.draft}</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl shadow-sm border border-indigo-200">
            <p className="text-sm text-indigo-600">Sent to Client</p>
            <p className="text-3xl font-bold text-indigo-700 mt-1">{stats.sent}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200">
            <p className="text-sm text-green-600">Fully Signed</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{stats.signed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, email, service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All Status' : option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
              <FaFileContract className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No proposals found</h3>
              <p className="text-gray-600">
                {proposals.length === 0
                  ? "No proposals have been submitted yet."
                  : "No proposals match your current filters."}
              </p>
            </div>
          ) : (
            filteredProposals.map(proposal => (
              <div
                key={proposal.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{proposal.name || 'Unknown'}</h3>
                      {getStatusBadge(proposal.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Proposal #:</strong> {proposal.proposal_number || 'N/A'}</p>
                      <p><strong>Company:</strong> {proposal.company || 'N/A'}</p>
                      <p><strong>Service:</strong> {proposal.service || 'N/A'}</p>
                      <p><strong>Email:</strong> {proposal.email || 'N/A'}</p>
                      <p><strong>Phone:</strong> {proposal.phone || 'N/A'}</p>
                      {proposal.time_frame && <p><strong>Timeline:</strong> {proposal.time_frame}</p>}
                      {proposal.estimated_budget && (
                        <p><strong>Budget:</strong> R{proposal.estimated_budget.toLocaleString()}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="text-sm font-semibold">
                      {proposal.submitted_at ? new Date(proposal.submitted_at).toLocaleDateString() : 'N/A'}
                    </p>
                    
                    {proposal.board_name && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Project Board</p>
                        <p className="text-xs font-semibold text-blue-600">{proposal.board_name}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                {proposal.message && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Requirements:</p>
                    <p className="text-sm text-gray-600">{proposal.message}</p>
                  </div>
                )}

                {/* Signatures Status */}
                {(proposal.admin_signature || proposal.client_signature) && (
                  <div className="flex gap-4 mb-4 text-sm">
                    {proposal.admin_signature && (
                      <div className="flex items-center gap-2 text-purple-600">
                        <FaSignature />
                        <span>Admin Signed: {new Date(proposal.admin_signed_at!).toLocaleDateString()}</span>
                      </div>
                    )}
                    {proposal.client_signature && (
                      <div className="flex items-center gap-2 text-green-600">
                        <FaSignature />
                        <span>Client Signed: {new Date(proposal.client_signed_at!).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {getActionButtons(proposal)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sign Modal */}
      {showSignModal && selectedProposal && (
        <SignaturePadModal
          onClose={() => {
            setShowSignModal(false);
            setSelectedProposal(null);
          }}
          onSave={(signatureData) => handleAdminSign(selectedProposal.id, signatureData)}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedProposal && (
        <EditProposalModal
          proposal={selectedProposal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProposal(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedProposal(null);
            fetchProposals();
          }}
        />
      )}
    </div>
  );
}

