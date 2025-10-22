# 📄 Invoice System & Live Link Feature - Implementation Guide

## ✅ Backend Implementation Complete!

### **Features Added:**

1. **Invoice Model** - Complete invoicing system
2. **PDF Generation** - Professional invoice PDFs
3. **Email Notifications** - Automated invoice delivery
4. **Admin Interface** - Full invoice management
5. **API Endpoints** - RESTful invoice operations

---

## 🎯 Backend Features

### **Invoice Model Fields:**
```python
- invoice_number (auto-generated)
- board (project)
- client (user)
- amount, tax_percentage, discount
- issue_date, due_date, paid_date
- status (draft/sent/paid/overdue/cancelled)
- notes, payment_method, payment_reference
- line_items (JSON for detailed billing)
```

### **Computed Properties:**
- `subtotal` - Base amount
- `tax_amount` - Calculated tax
- `total_amount` - Final amount with tax & discount
- `is_overdue` - Automatic overdue detection

---

## 📡 API Endpoints

### **Base URL:** `/task/invoices/`

#### **1. List Invoices**
```
GET /task/invoices/
GET /task/invoices/?user_id=8  (User's invoices)
GET /task/invoices/?board_id=13  (Project invoices)
GET /task/invoices/?status=paid  (Filter by status)
```

#### **2. Create Invoice**
```
POST /task/invoices/
Body: {
  "board": 13,
  "client_id": 8,
  "amount": 6000.00,
  "due_date": "2025-11-30",
  "tax_percentage": 15.00,
  "status": "draft"
}
```

#### **3. Download PDF**
```
GET /task/invoices/{id}/download_pdf/
Returns: PDF file download
```

#### **4. Send Invoice Email**
```
POST /task/invoices/{id}/send_invoice/
Sends PDF to client email
```

#### **5. Mark as Paid**
```
POST /task/invoices/{id}/mark_as_paid/
Body: {
  "payment_method": "Bank Transfer",
  "payment_reference": "REF123456"
}
```

---

## 👨‍💼 Admin Dashboard Features

### **Invoice Management:**
Admins can access via Django Admin at `/admin/tasks/invoice/`

**Features:**
- Create invoices for any project/client
- Set amount, tax, discount
- Add line items for detailed billing
- Mark as sent/paid/overdue
- Download PDFs
- Send invoices via email

---

## 💻 Frontend Implementation Needed

### **1. User Dashboard - Invoice Display**

**Location:** `app/userDashboard/UserDashboardClient.tsx`

**Required Changes:**
```typescript
// Add invoice interface
interface Invoice {
  id: number;
  invoice_number: string;
  board_name: string;
  amount: number;
  total_amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  paid_date?: string;
  is_overdue: boolean;
}

// Fetch invoices
const fetchInvoices = async () => {
  const res = await fetch(`${baseAPI}/task/invoices/?user_id=${userId}`);
  const data = await res.json();
  setInvoices(data);
};

// Download invoice PDF
const handleDownloadInvoice = (invoiceId: number) => {
  window.open(`${baseAPI}/task/invoices/${invoiceId}/download_pdf/`, '_blank');
};
```

**UI Elements to Add:**
- Invoice tab/section in dashboard
- Invoice list with status badges
- Download PDF button for each invoice
- Payment status indicators

### **2. Live Link Button for Completed Projects**

**Add to project card rendering:**
```typescript
{project.status === 'Concluded' && project.client_link && (
  <a
    href={project.client_link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
  >
    <FaExternalLinkAlt />
    View Live Site
  </a>
)}
```

---

## 🖥️ Admin Frontend Features Needed

### **Invoice Creation Modal**

**Location:** `app/admin/boards/InvoiceModal.tsx` (new file)

**Features:**
- Board selection
- Client selection (from board users)
- Amount input
- Tax percentage (default 15%)
- Due date selector
- Line items editor
- Notes field

**Actions:**
- Create Draft
- Create & Send
- Preview PDF

---

## 📧 Email Templates

### **Invoice Sent Email** (`templates/email/invoice_sent.html`)
```html
<!DOCTYPE html>
<html>
<head><title>Invoice</title></head>
<body>
  <h2>New Invoice from Maindo Digital Agency</h2>
  <p>Hi {{ invoice.client.username }},</p>
  <p>Please find attached invoice {{ invoice.invoice_number }} for project {{ invoice.board.name }}.</p>
  
  <table>
    <tr><td>Invoice Number:</td><td>{{ invoice.invoice_number }}</td></tr>
    <tr><td>Amount:</td><td>R{{ invoice.total_amount }}</td></tr>
    <tr><td>Due Date:</td><td>{{ invoice.due_date }}</td></tr>
  </table>
  
  <p>You can also view and download this invoice from your dashboard.</p>
  <a href="{{ dashboard_url }}">View Dashboard</a>
  
  <p>Thank you!</p>
</body>
</html>
```

### **Invoice Paid Email** (`templates/email/invoice_paid.html`)
```html
<!DOCTYPE html>
<html>
<head><title>Payment Received</title></head>
<body>
  <h2>Payment Received - Thank You!</h2>
  <p>Hi {{ invoice.client.username }},</p>
  <p>We have received your payment for invoice {{ invoice.invoice_number }}.</p>
  
  <table>
    <tr><td>Invoice Number:</td><td>{{ invoice.invoice_number }}</td></tr>
    <tr><td>Amount Paid:</td><td>R{{ invoice.total_amount }}</td></tr>
    <tr><td>Payment Date:</td><td>{{ invoice.paid_date }}</td></tr>
  </table>
  
  <p>Thank you for your business!</p>
</body>
</html>
```

---

## 🧪 Testing the Invoice System

### **Backend Tests:**

1. **Create Invoice via Admin:**
   - Go to `/admin/tasks/invoice/`
   - Click "Add Invoice"
   - Select board and client
   - Enter amount and due date
   - Save

2. **Download PDF:**
   - Navigate to: `http://127.0.0.1:8000/task/invoices/1/download_pdf/`
   - Should download professional PDF

3. **API Test:**
```powershell
# Create invoice
$body = @{
  board = 13
  client_id = 8
  amount = 6000.00
  due_date = "2025-11-30"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:8000/task/invoices/" `
  -Method POST -Body $body -ContentType "application/json"

# List invoices
Invoke-WebRequest -Uri "http://127.0.0.1:8000/task/invoices/?user_id=8"
```

---

## 🎨 UI/UX Design Recommendations

### **Invoice Card Design:**
```
╔══════════════════════════════════════╗
║  📄 Invoice #INV-20251021210000      ║
║  Project: Website Redesign           ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║  Amount: R6,000.00                   ║
║  Tax (15%): R900.00                  ║
║  Total: R6,900.00                    ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║  Status: PAID ✓                      ║
║  Due Date: 2025-11-30                ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║  [📥 Download PDF]  [✉️ Resend]     ║
╚══════════════════════════════════════╝
```

### **Status Badge Colors:**
- **Draft**: Gray
- **Sent**: Blue
- **Paid**: Green
- **Overdue**: Red
- **Cancelled**: Dark Gray

---

## 🔄 Workflow

### **Admin Creates Invoice:**
1. Admin goes to Django Admin
2. Creates invoice for completed project
3. Sets amount, tax, due date
4. Saves as "draft" or "sent"
5. If "sent", email automatically sent with PDF

### **User Receives Invoice:**
1. User receives email with PDF attachment
2. User logs into dashboard
3. Views invoice in "Invoices" tab
4. Downloads PDF if needed
5. Makes payment

### **Admin Marks as Paid:**
1. Admin receives payment confirmation
2. Marks invoice as "paid" in admin
3. Adds payment method and reference
4. User receives payment confirmation email

---

## 📊 Migration Applied

**File:** `tasks/migrations/0005_invoice.py`

**Status:** ✅ Migrated successfully

**Database Table:** `tasks_invoice`

---

## 🚀 Next Steps

### **Immediate (Backend Complete):**
- ✅ Invoice model created
- ✅ PDF generation working
- ✅ API endpoints ready
- ✅ Admin interface configured
- ✅ Migrations applied

### **Frontend Implementation Needed:**
1. Add invoice fetching to UserDashboardClient
2. Create invoice display section
3. Add download PDF button
4. Add live link button for concluded projects
5. Create admin invoice modal (optional - can use Django admin)

---

## 💡 Example Usage

### **Creating an Invoice (Admin):**
```python
from tasks.models import Invoice, Board
from django.contrib.auth import get_user_model

User = get_user_model()

# Get project and client
board = Board.objects.get(id=13)
client = board.users.first()

# Create invoice
invoice = Invoice.objects.create(
    board=board,
    client=client,
    amount=6000.00,
    due_date="2025-11-30",
    status='sent'
)

print(f"Invoice created: {invoice.invoice_number}")
print(f"Total amount: R{invoice.total_amount}")
```

### **Downloading Invoice (User):**
```typescript
const downloadInvoice = async (invoiceId: number) => {
  try {
    const response = await fetch(
      `${baseAPI}/task/invoices/${invoiceId}/download_pdf/`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoiceId}.pdf`;
    a.click();
  } catch (error) {
    console.error('Error downloading invoice:', error);
  }
};
```

---

## ✅ Summary

| Feature | Backend | Frontend | Status |
|---------|---------|----------|--------|
| Invoice Model | ✅ | - | Complete |
| PDF Generation | ✅ | - | Complete |
| Email Sending | ✅ | - | Complete |
| API Endpoints | ✅ | - | Complete |
| Admin Interface | ✅ | - | Complete |
| User Dashboard Display | - | ⏳ | Pending |
| Download Button | - | ⏳ | Pending |
| Live Link Button | - | ⏳ | Pending |
| Invoice List UI | - | ⏳ | Pending |

---

**Backend is 100% complete and ready to use!**
**Frontend implementation can begin now.**

🎉 Admins can start creating invoices via Django Admin immediately!

