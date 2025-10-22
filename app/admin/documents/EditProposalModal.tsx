"use client";

import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { baseAPI } from '@/useAPI/api';

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
  estimated_budget?: number;
  estimated_duration?: string;
  scope_of_work?: string;
  deliverables: any[];
  terms_and_conditions?: string;
}

interface EditProposalModalProps {
  proposal: Proposal;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProposalModal({ proposal, onClose, onSuccess }: EditProposalModalProps) {
  const [formData, setFormData] = useState({
    estimated_budget: proposal.estimated_budget?.toString() || '',
    estimated_duration: proposal.estimated_duration || '',
    scope_of_work: proposal.scope_of_work || '',
    terms_and_conditions: proposal.terms_and_conditions || getDefaultTerms(),
  });

  const [deliverables, setDeliverables] = useState<string[]>(
    Array.isArray(proposal.deliverables) && proposal.deliverables.length > 0
      ? proposal.deliverables.map(d => typeof d === 'string' ? d : d.name || '')
      : ['']
  );

  const [isSaving, setIsSaving] = useState(false);

  function getDefaultTerms() {
    return `1. Payment Terms: 50% upfront, 50% upon completion

2. Project Timeline: Subject to client feedback and approvals

3. Scope Changes: Additional features may incur extra charges

4. Ownership: All deliverables remain property of Maindo Digital Agency until full payment is received

5. Validity: This proposal is valid for 30 days from the date of issue

6. Confidentiality: Both parties agree to keep project details confidential

7. Cancellation: Either party may cancel with 14 days written notice. Cancellation fees may apply.

8. Support: 30 days of post-launch support included

9. Hosting & Maintenance: Available as separate service packages

10. Dispute Resolution: Any disputes will be resolved through mediation in South Africa`;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...deliverables];
    newDeliverables[index] = value;
    setDeliverables(newDeliverables);
  };

  const addDeliverable = () => {
    setDeliverables([...deliverables, '']);
  };

  const removeDeliverable = (index: number) => {
    if (deliverables.length > 1) {
      setDeliverables(deliverables.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.estimated_budget || parseFloat(formData.estimated_budget) <= 0) {
      toast.error('Please enter a valid budget');
      return;
    }

    if (!formData.scope_of_work.trim()) {
      toast.error('Please enter the scope of work');
      return;
    }

    const filteredDeliverables = deliverables.filter(d => d.trim() !== '');
    if (filteredDeliverables.length === 0) {
      toast.error('Please add at least one deliverable');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        estimated_budget: parseFloat(formData.estimated_budget),
        estimated_duration: formData.estimated_duration,
        scope_of_work: formData.scope_of_work,
        deliverables: filteredDeliverables,
        terms_and_conditions: formData.terms_and_conditions,
        status: 'draft' // Update status to draft when details are filled
      };

      const response = await fetch(`${baseAPI}/services/proposals/${proposal.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success('Proposal details saved successfully!');
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        toast.error('Failed to save proposal details');
      }
    } catch (error) {
      console.error('Error saving proposal:', error);
      toast.error('Failed to save proposal details');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Professional Proposal</h2>
            <p className="text-sm text-gray-600">Proposal {proposal.proposal_number} - {proposal.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Information (Read-only) */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Client Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Name:</strong> {proposal.name}</div>
              <div><strong>Company:</strong> {proposal.company || 'N/A'}</div>
              <div><strong>Email:</strong> {proposal.email}</div>
              <div><strong>Phone:</strong> {proposal.phone}</div>
              <div><strong>Service:</strong> {proposal.service}</div>
              <div><strong>Timeline:</strong> {proposal.time_frame || 'TBD'}</div>
            </div>
            <div className="mt-3">
              <strong>Requirements:</strong>
              <p className="text-gray-700 mt-1">{proposal.message}</p>
            </div>
          </div>

          {/* Budget and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Budget (ZAR) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="estimated_budget"
                value={formData.estimated_budget}
                onChange={handleChange}
                placeholder="e.g., 50000"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Enter the total project budget</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Duration *
              </label>
              <input
                type="text"
                name="estimated_duration"
                value={formData.estimated_duration}
                onChange={handleChange}
                placeholder="e.g., 6-8 weeks"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Project completion timeframe</p>
            </div>
          </div>

          {/* Scope of Work */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Scope of Work *
            </label>
            <textarea
              name="scope_of_work"
              value={formData.scope_of_work}
              onChange={handleChange}
              placeholder="Describe in detail what will be delivered in this project..."
              rows={6}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Detailed description of project scope and objectives</p>
          </div>

          {/* Deliverables */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deliverables *
            </label>
            <div className="space-y-2">
              {deliverables.map((deliverable, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={deliverable}
                    onChange={(e) => handleDeliverableChange(index, e.target.value)}
                    placeholder={`Deliverable ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeliverable(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDeliverable}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm flex items-center gap-2"
              >
                <FaPlus /> Add Deliverable
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">List all project deliverables</p>
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Terms and Conditions *
            </label>
            <textarea
              name="terms_and_conditions"
              value={formData.terms_and_conditions}
              onChange={handleChange}
              rows={10}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Contract terms and conditions</p>
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
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Proposal Details
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

