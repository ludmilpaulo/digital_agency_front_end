"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";
import { useGetBoardsQuery } from "@/redux/services/boardsApi";
import { 
  FileText, Plus, Download, Mail, Check, Edit, Trash2, 
  DollarSign, Calendar, User, AlertCircle 
} from "lucide-react";
import InvoiceModal from "./InvoiceModal";
import { baseAPI } from "@/useAPI/api";
import toast from "react-hot-toast";

interface Invoice {
  id: number;
  invoice_number: string;
  board: number;
  board_name: string;
  client: {
    id: number;
    username: string;
    email: string;
  };
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  paid_date?: string;
  is_overdue: boolean;
  notes: string;
}

export default function InvoicesAdmin() {
  const user = useSelector(selectUser);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch boards for the modal
  const { data: boards = [] } = useGetBoardsQuery({});

  // Fetch invoices
  React.useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseAPI}/task/invoices/`);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      const response = await fetch(`${baseAPI}/task/invoices/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        toast.success("Invoice created successfully!");
        setShowModal(false);
        fetchInvoices();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to create invoice");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  };

  const handleUpdateInvoice = async (invoiceData: any) => {
    if (!selectedInvoice) return;

    try {
      const response = await fetch(`${baseAPI}/task/invoices/${selectedInvoice.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        toast.success("Invoice updated successfully!");
        setShowModal(false);
        setSelectedInvoice(null);
        fetchInvoices();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to update invoice");
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice");
    }
  };

  const handleDeleteInvoice = async (invoiceId: number) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const response = await fetch(`${baseAPI}/task/invoices/${invoiceId}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Invoice deleted successfully!");
        fetchInvoices();
      } else {
        toast.error("Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    }
  };

  const handleDownloadPDF = (invoiceId: number, invoiceNumber: string) => {
    window.open(`${baseAPI}/task/invoices/${invoiceId}/download_pdf/`, "_blank");
    toast.success("Downloading invoice PDF...");
  };

  const handleSendInvoice = async (invoiceId: number) => {
    try {
      const response = await fetch(`${baseAPI}/task/invoices/${invoiceId}/send_invoice/`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.detail || "Invoice sent successfully!");
        fetchInvoices();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to send invoice");
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Failed to send invoice");
    }
  };

  const handleMarkAsPaid = async (invoiceId: number) => {
    const paymentMethod = prompt("Enter payment method (e.g., Bank Transfer, Card):");
    if (!paymentMethod) return;

    const paymentReference = prompt("Enter payment reference:");

    try {
      const response = await fetch(`${baseAPI}/task/invoices/${invoiceId}/mark_as_paid/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method: paymentMethod,
          payment_reference: paymentReference || "",
        }),
      });

      if (response.ok) {
        toast.success("Invoice marked as paid!");
        fetchInvoices();
      } else {
        toast.error("Failed to mark invoice as paid");
      }
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("Failed to mark invoice as paid");
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
      const matchesSearch =
        invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.board_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.username.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [invoices, filterStatus, searchTerm]);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const paid = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total_amount, 0);
    const pending = invoices.filter((inv) => inv.status !== "paid" && inv.status !== "cancelled").reduce((sum, inv) => sum + inv.total_amount, 0);
    const overdue = invoices.filter((inv) => inv.is_overdue && inv.status !== "paid").length;

    return { total, paid, pending, overdue };
  }, [invoices]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600 mt-1">Create and manage client invoices</p>
        </div>
        <button
          onClick={() => {
            setModalMode("create");
            setSelectedInvoice(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">R{stats.total.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Paid</p>
              <p className="text-2xl font-bold text-green-600 mt-1">R{stats.paid.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">R{stats.pending.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdue}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading invoices...</p>
          </div>
        ) : filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.invoice_number}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(invoice.issue_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{invoice.board_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{invoice.client.username}</div>
                      <div className="text-xs text-gray-500">{invoice.client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        R{invoice.total_amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        + Tax: R{invoice.tax_amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : invoice.status === "sent"
                            ? "bg-blue-100 text-blue-700"
                            : invoice.status === "overdue" || invoice.is_overdue
                            ? "bg-red-100 text-red-700"
                            : invoice.status === "draft"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {invoice.status.toUpperCase()}
                        {invoice.is_overdue && invoice.status !== "paid" && " (OVERDUE)"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </div>
                      {invoice.paid_date && (
                        <div className="text-xs text-green-600">
                          Paid: {new Date(invoice.paid_date).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownloadPDF(invoice.id, invoice.invoice_number)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {invoice.status !== "paid" && (
                          <>
                            <button
                              onClick={() => handleSendInvoice(invoice.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Send Invoice"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMarkAsPaid(invoice.id)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Mark as Paid"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setModalMode("edit");
                            setSelectedInvoice(invoice);
                            setShowModal(true);
                          }}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Invoices Found</h3>
            <p className="text-gray-500 mb-6">Create your first invoice to get started.</p>
            <button
              onClick={() => {
                setModalMode("create");
                setSelectedInvoice(null);
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create First Invoice
            </button>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedInvoice(null);
        }}
        onSubmit={modalMode === "create" ? handleCreateInvoice : handleUpdateInvoice}
        boards={boards}
        mode={modalMode}
        invoice={selectedInvoice}
      />
    </div>
  );
}

