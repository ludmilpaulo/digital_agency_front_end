'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { JobApplication } from '@/types/Career';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';
import dayjs from 'dayjs';
import { baseAPI } from '@/useAPI/api';
import toast from 'react-hot-toast';

export default function ViewApplications() {
  const [applications, setApplications] = useState<JobApplication[] | null>(null);
  const [careers, setCareers] = useState<string[]>([]);
  const [selectedCareer, setSelectedCareer] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;
  
  // Approval modal state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [approvalData, setApprovalData] = useState({
    position_title: '',
    salary_offered: '',
    commission_based: false,
    start_date: '',
    employment_type: 'Full-time'
  });

  const statusOptions: JobApplication['status'][] = [
    'submitted', 'processing', 'review', 'approved', 'rejected',
  ];

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseAPI}/careers/job-applications/?page=${page}`);
      setApplications(res.data.results);
      setCount(res.data.count);

      const titles = res.data.results.map((app: JobApplication) => app.career.title);
      const uniqueCareers: string[] = Array.from(new Set(titles));
      setCareers(uniqueCareers);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const updateStatus = async (id: number, status: JobApplication['status']) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', status);
      await axios.patch(`${baseAPI}/careers/job-applications/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = async (resumeUrl: string, fileName: string) => {
    try {
      const response = await axios.get(resumeUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const openApprovalModal = (app: JobApplication) => {
    setSelectedApplication(app);
    setApprovalData({
      position_title: app.career.title,
      salary_offered: '',
      commission_based: false,
      start_date: '',
      employment_type: 'Full-time'
    });
    setShowApprovalModal(true);
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;
    
    // Validation
    if (!approvalData.salary_offered || !approvalData.start_date) {
      toast.error('Please fill in salary and start date');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${baseAPI}/careers/job-applications/${selectedApplication.id}/approve/`,
        approvalData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      toast.success('Application approved! Documents generated and email sent.');
      setShowApprovalModal(false);
      fetchApplications();
    } catch (error: any) {
      console.error('Error approving application:', error);
      toast.error(error.response?.data?.detail || 'Failed to approve application');
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (appId: number, docType: 'approval' | 'offer') => {
    try {
      const response = await axios.get(
        `${baseAPI}/careers/job-applications/${appId}/download_${docType}/`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${docType}_letter.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${docType === 'approval' ? 'Approval' : 'Offer'} letter downloaded!`);
    } catch (error) {
      console.error(`Error downloading ${docType} letter:`, error);
      toast.error('Document not available yet');
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      case 'processing': return 'text-yellow-800 bg-yellow-100';
      case 'review': return 'text-blue-700 bg-blue-100';
      case 'submitted': return 'text-gray-700 bg-gray-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatStatus = (status: string): string => {
    switch (status) {
      case 'submitted': return 'Submitted';
      case 'processing': return 'Processing';
      case 'review': return 'On Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const totalPages = Math.ceil(count / pageSize);

  const filteredApplications = applications?.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const careerMatch = selectedCareer === 'all' || app.career.title === selectedCareer;
    const statusMatch = selectedStatus === 'all' || app.status === selectedStatus;
    return matchesSearch && careerMatch && statusMatch;
  });

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-10">
      {/* Loading Overlay */}
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin" />
        </div>
      </Transition>

      <h2 className="text-3xl font-bold mb-8 text-gray-900">📋 Job Applications</h2>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm w-full sm:w-64"
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Filter by Career</label>
          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
          >
            <option value="all">All Careers</option>
            {careers.map((career) => (
              <option key={career} value={career}>{career}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Filter by Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid gap-6">
        {filteredApplications && filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.id} className="bg-white p-5 rounded-lg border shadow hover:shadow-md transition-all duration-200">
              <div className="flex justify-between gap-4 flex-col sm:flex-row">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{app.full_name}</h3>
                  <p className="text-sm text-gray-500">{app.email}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Applied for <span className="font-medium">{app.career.title}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted: {dayjs(app.submitted_at).format('DD MMM YYYY, HH:mm')}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${statusColor(app.status)}`}>
                    {formatStatus(app.status)}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="w-full sm:w-auto">
                    <label className="text-sm font-medium text-gray-700">Change Status</label>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateStatus(app.id, e.target.value as JobApplication['status'])
                      }
                      className="mt-1 border rounded px-2 py-1 text-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => downloadResume(app.resume, `${app.full_name}_resume.pdf`)}
                      className="inline-flex items-center px-3 py-1.5 text-sm text-white bg-gray-800 hover:bg-gray-700 rounded shadow"
                    >
                      📄 Resume
                    </button>
                    
                    {app.status !== 'approved' && (
                      <button
                        onClick={() => openApprovalModal(app)}
                        className="inline-flex items-center px-3 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded shadow"
                      >
                        ✓ Approve
                      </button>
                    )}
                    
                    {app.status === 'approved' && (
                      <>
                        <button
                          onClick={() => downloadDocument(app.id, 'approval')}
                          className="inline-flex items-center px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow"
                        >
                          📄 Approval Letter
                        </button>
                        <button
                          onClick={() => downloadDocument(app.id, 'offer')}
                          className="inline-flex items-center px-3 py-1.5 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded shadow"
                        >
                          📄 Offer Letter
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No applications found for the selected filters.</p>
        )}
      </div>

      {/* Pagination */}
      {applications && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Previous
          </button>

          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Approve Application</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Applicant:</strong> {selectedApplication.full_name}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Position:</strong> {selectedApplication.career.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position Title
                </label>
                <input
                  type="text"
                  value={approvalData.position_title}
                  onChange={(e) => setApprovalData({...approvalData, position_title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Senior Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary (Monthly in Rands) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={approvalData.salary_offered}
                  onChange={(e) => setApprovalData({...approvalData, salary_offered: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 25000"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="commission_based"
                  checked={approvalData.commission_based}
                  onChange={(e) => setApprovalData({...approvalData, commission_based: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="commission_based" className="ml-2 text-sm font-medium text-gray-700">
                  Commission-based salary
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={approvalData.start_date}
                  onChange={(e) => setApprovalData({...approvalData, start_date: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  value={approvalData.employment_type}
                  onChange={(e) => setApprovalData({...approvalData, employment_type: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Approving...' : 'Approve & Send'}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              * This will generate professional PDFs (Approval Letter & Offer Letter), create staff credentials for devDashboard access, and email everything to the applicant.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
