"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Board {
  id: number;
  name: string;
  users: Array<{ id: number; username: string; email: string }>;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invoiceData: any) => void;
  boards: Board[];
  mode?: "create" | "edit";
  invoice?: any;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  onSubmit,
  boards,
  mode = "create",
  invoice,
}: InvoiceModalProps) {
  const [formData, setFormData] = useState({
    board: "",
    client_id: "",
    amount: "",
    tax_percentage: "15.00",
    discount: "0",
    due_date: "",
    status: "draft",
    notes: "",
    line_items: [] as Array<{ description: string; quantity: number; rate: number; amount: number }>,
  });

  const [newLineItem, setNewLineItem] = useState({
    description: "",
    quantity: 1,
    rate: 0,
  });

  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  useEffect(() => {
    if (invoice && mode === "edit") {
      setFormData({
        board: invoice.board?.toString() || "",
        client_id: invoice.client?.id?.toString() || "",
        amount: invoice.amount?.toString() || "",
        tax_percentage: invoice.tax_percentage?.toString() || "15.00",
        discount: invoice.discount?.toString() || "0",
        due_date: invoice.due_date || "",
        status: invoice.status || "draft",
        notes: invoice.notes || "",
        line_items: invoice.line_items || [],
      });
    } else {
      // Reset form for create mode
      setFormData({
        board: "",
        client_id: "",
        amount: "",
        tax_percentage: "15.00",
        discount: "0",
        due_date: "",
        status: "draft",
        notes: "",
        line_items: [],
      });
    }
  }, [invoice, mode, isOpen]);

  useEffect(() => {
    if (formData.board) {
      const board = boards.find((b) => b.id.toString() === formData.board);
      setSelectedBoard(board || null);
      // Auto-select first user if available
      if (board && board.users.length > 0 && !formData.client_id) {
        setFormData((prev) => ({ ...prev, client_id: board.users[0].id.toString() }));
      }
    }
  }, [formData.board, boards]);

  const handleAddLineItem = () => {
    if (newLineItem.description && newLineItem.rate > 0) {
      const amount = newLineItem.quantity * newLineItem.rate;
      setFormData((prev) => ({
        ...prev,
        line_items: [
          ...prev.line_items,
          {
            ...newLineItem,
            amount,
          },
        ],
      }));
      setNewLineItem({ description: "", quantity: 1, rate: 0 });
    }
  };

  const handleRemoveLineItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index),
    }));
  };

  const calculateSubtotal = () => {
    if (formData.line_items.length > 0) {
      return formData.line_items.reduce((sum, item) => sum + item.amount, 0);
    }
    return parseFloat(formData.amount) || 0;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * parseFloat(formData.tax_percentage)) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = parseFloat(formData.discount) || 0;
    return subtotal + tax - discount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceData = {
      board: parseInt(formData.board),
      client_id: parseInt(formData.client_id),
      amount: formData.line_items.length > 0 ? calculateSubtotal() : parseFloat(formData.amount),
      tax_percentage: parseFloat(formData.tax_percentage),
      discount: parseFloat(formData.discount),
      due_date: formData.due_date,
      status: formData.status,
      notes: formData.notes,
      line_items: formData.line_items.length > 0 ? formData.line_items : undefined,
    };

    onSubmit(invoiceData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "create" ? "Create New Invoice" : "Edit Invoice"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project *
            </label>
            <select
              value={formData.board}
              onChange={(e) => setFormData({ ...formData, board: e.target.value, client_id: "" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a project</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>

          {/* Client Selection */}
          {selectedBoard && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client *
              </label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a client</option>
                {selectedBoard.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Line Items Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Line Items (Optional)</h3>
            
            {/* Existing Line Items */}
            {formData.line_items.length > 0 && (
              <div className="mb-4 space-y-2">
                {formData.line_items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.description}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × R{item.rate.toLocaleString()} = R{item.amount.toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(index)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Line Item Form */}
            <div className="grid grid-cols-12 gap-3">
              <input
                type="text"
                placeholder="Description"
                value={newLineItem.description}
                onChange={(e) => setNewLineItem({ ...newLineItem, description: e.target.value })}
                className="col-span-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Qty"
                min="1"
                value={newLineItem.quantity}
                onChange={(e) => setNewLineItem({ ...newLineItem, quantity: parseInt(e.target.value) || 1 })}
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Rate"
                min="0"
                step="0.01"
                value={newLineItem.rate || ""}
                onChange={(e) => setNewLineItem({ ...newLineItem, rate: parseFloat(e.target.value) || 0 })}
                className="col-span-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddLineItem}
                className="col-span-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Amount (if no line items) */}
          {formData.line_items.length === 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (R) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="0.00"
              />
            </div>
          )}

          {/* Tax and Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.tax_percentage}
                onChange={(e) => setFormData({ ...formData, tax_percentage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (R)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">R{calculateSubtotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Tax ({formData.tax_percentage}%):</span>
              <span className="font-semibold text-gray-900">R{calculateTax().toLocaleString()}</span>
            </div>
            {parseFloat(formData.discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Discount:</span>
                <span className="font-semibold text-red-600">-R{parseFloat(formData.discount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-blue-300">
              <span className="text-gray-900">Total:</span>
              <span className="text-blue-600">R{calculateTotal().toLocaleString()}</span>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any additional notes here..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              {mode === "create" ? "Create Invoice" : "Update Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

