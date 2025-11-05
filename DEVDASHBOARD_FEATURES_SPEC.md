# 🚀 Developer Dashboard - Complete Feature Specification

## Overview
Transform the devDashBoard into a comprehensive project management and document workflow system for staff members.

---

## 📋 Core Features

### 1. **User Profile Management** (CRUD)
- ✅ **Read:** View own profile
- ✅ **Update:** Edit profile information (name, email, avatar, bio)
- 📸 **Upload:** Profile picture
- 🔐 **Security:** Change password

**Profile Fields:**
- Username
- Email
- First Name / Last Name
- Avatar/Photo
- Bio/Description
- Role (Dev, PM, etc.)
- Contact Information
- Skills/Technologies

---

### 2. **Board Management** (CUD + Enhanced Features)
- ✅ **Create:** New project boards
- ✅ **Update:** Edit board details
- ✅ **Delete:** Remove boards
- 📊 **View:** Board details and progress
- 👥 **Assign:** Line managers to boards
- 📅 **Track:** Deadlines, budget, status

**Board Fields:**
- Name
- Description
- Development Link
- Repository Link
- Client Link
- Sample/Demo Link
- Assigned Line Managers
- Team Members
- Budget & Budget Used
- Start Date / End Date / Deadline
- Status (Started, In Progress, Concluded)

---

### 3. **Task Management** (CRUD)
- ✅ **Create:** Tasks within boards/lists
- ✅ **Read:** View task details
- ✅ **Update:** Edit task information
- ✅ **Delete:** Remove tasks
- 👤 **Assign:** Tasks to team members
- 📎 **Attach:** Files and images
- 💬 **Comment:** On tasks
- ✅ **Status:** Not Started, In Progress, Completed

**Task Fields:**
- Title
- Description
- Status
- Priority (High, Medium, Low)
- Assignees (multiple users)
- Due Date
- Attachments/Images
- Comments
- Checklist items

---

### 4. **Document Signing Workflow**

#### 4.1 Staff Signs Document
- 📄 **Upload/View:** Documents requiring signature
- ✍️ **Sign:** Digital signature pad
- 📅 **Timestamp:** Auto-record signing date/time
- 💾 **Save:** Signed PDF with signature overlay

#### 4.2 Route to Line Manager
- 📤 **Auto-send:** To assigned line manager after staff signs
- 📧 **Notify:** Email notification to line manager
- ⏳ **Status:** Pending Manager Signature
- 🔔 **Reminders:** Auto-reminders if not signed

#### 4.3 Line Manager Signs
- 📥 **Receive:** Documents from staff
- 👀 **Review:** Document content
- ✍️ **Sign:** Manager signature
- ✅ **Approve/Reject:** Final decision
- 📨 **Complete:** Both signatures recorded

**Document Flow:**
```
Staff → Sign Document → Auto-route to Line Manager → 
Manager Reviews → Manager Signs → Document Complete
```

---

### 5. **Line Manager Assignment**

#### 5.1 Assign to Boards
- Select line manager from dropdown
- Multiple managers per board
- Manager can see all assigned boards
- Manager dashboard view

#### 5.2 Assign to Tasks
- Assign specific tasks to line managers
- Manager oversight of task progress
- Approval workflow for task completion
- Manager can reassign tasks

**Manager Capabilities:**
- View all assigned boards
- Monitor task progress
- Approve/reject deliverables
- Reassign tasks
- Sign documents
- View team performance

---

## 🎨 UI Components Needed

### New Components to Create:

1. **ProfileEditor.tsx**
   - Profile form
   - Avatar upload
   - Password change

2. **BoardDetailView.tsx**
   - Full board details
   - Task lists
   - Team members
   - Progress tracking

3. **TaskCard.tsx**
   - Task display
   - Status badges
   - Assignee avatars
   - Due date

4. **TaskModal.tsx**
   - Create/Edit tasks
   - Assign users
   - Add comments
   - Upload files

5. **DocumentSigner.tsx**
   - PDF viewer
   - Signature pad
   - Sign & send workflow

6. **ManagerAssignment.tsx**
   - Manager selector
   - Assign to boards/tasks
   - Notification settings

7. **DocumentWorkflow.tsx**
   - Document list
   - Pending signatures
   - Signature status
   - Download signed docs

---

## 🗄️ Backend Models Required

### Profile Model
```python
class StaffProfile(models.Model):
    user = ForeignKey(User)
    avatar = ImageField()
    bio = TextField()
    phone = CharField()
    skills = JSONField()
    line_manager = ForeignKey(User, related_name='direct_reports')
```

### Board Model (Enhanced)
```python
class Board(models.Model):
    name = CharField()
    description = TextField()
    development_link = URLField()
    repository_link = URLField()
    client_link = URLField()
    managers = ManyToManyField(User, related_name='managed_boards')
    team_members = ManyToManyField(User, related_name='boards')
    budget = DecimalField()
    budget_used = DecimalField()
    deadline = DateField()
    status = CharField(choices=[...])
```

### Task Model
```python
class Task(models.Model):
    title = CharField()
    description = TextField()
    board = ForeignKey(Board)
    list = ForeignKey(List, null=True)
    assignees = ManyToManyField(User)
    status = CharField(choices=[...])
    priority = CharField(choices=[...])
    due_date = DateField()
    image = ImageField()
    created_by = ForeignKey(User)
```

### Document Model
```python
class StaffDocument(models.Model):
    title = CharField()
    document = FileField()
    staff_user = ForeignKey(User, related_name='staff_documents')
    line_manager = ForeignKey(User, related_name='documents_to_review')
    staff_signature = ImageField(null=True)
    staff_signed_at = DateTimeField(null=True)
    manager_signature = ImageField(null=True)
    manager_signed_at = DateTimeField(null=True)
    status = CharField(choices=[
        ('pending_staff', 'Pending Staff Signature'),
        ('pending_manager', 'Pending Manager Signature'),
        ('completed', 'Fully Signed'),
        ('rejected', 'Rejected')
    ])
```

---

## 📡 API Endpoints Needed

### Profile
- `GET /api/profile/me/` - Get own profile
- `PUT /api/profile/me/` - Update profile
- `POST /api/profile/avatar/` - Upload avatar
- `POST /api/profile/change-password/` - Change password

### Boards
- `GET /api/boards/` - List boards
- `POST /api/boards/` - Create board
- `GET /api/boards/{id}/` - Board details
- `PUT /api/boards/{id}/` - Update board
- `DELETE /api/boards/{id}/` - Delete board
- `POST /api/boards/{id}/assign-manager/` - Assign manager

### Tasks
- `GET /api/tasks/` - List tasks
- `POST /api/tasks/` - Create task
- `GET /api/tasks/{id}/` - Task details
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task
- `POST /api/tasks/{id}/assign/` - Assign to users
- `POST /api/tasks/{id}/comment/` - Add comment

### Documents
- `GET /api/documents/pending/` - Documents to sign
- `POST /api/documents/` - Upload document
- `POST /api/documents/{id}/sign-staff/` - Staff signs
- `POST /api/documents/{id}/sign-manager/` - Manager signs
- `GET /api/documents/{id}/download/` - Download signed doc

---

## 🔄 Workflow Examples

### Scenario 1: Create Board & Assign Tasks
1. Staff creates new board
2. Staff adds tasks to board
3. Staff assigns line manager to board
4. Staff assigns specific tasks to team members
5. Line manager receives notification
6. Manager monitors progress

### Scenario 2: Document Signing
1. Staff uploads document requiring signature
2. Staff signs document using signature pad
3. System auto-routes to assigned line manager
4. Manager receives email notification
5. Manager opens document in dashboard
6. Manager reviews and signs
7. Both parties receive completed document

### Scenario 3: Task Completion
1. Staff completes task
2. Task marked as complete
3. If requires manager approval:
   - Notification sent to manager
   - Manager reviews deliverable
   - Manager approves/rejects
4. Task status updated
5. Board progress updated

---

## 🎯 Implementation Phases

### Phase 1: Foundation ✅
- Profile viewing
- Basic board CRUD
- Authentication

### Phase 2: Task Management 🔨
- Task CRUD within boards
- Task assignment
- Status tracking

### Phase 3: Manager Features 📊
- Line manager assignment
- Manager dashboard view
- Task approval workflow

### Phase 4: Document Signing ✍️
- Document upload
- Signature pad integration
- PDF generation with signatures
- Auto-routing workflow

### Phase 5: Notifications & Polish 🔔
- Email notifications
- In-app notifications
- Real-time updates
- UI/UX improvements

---

## 🛠️ Technology Stack

**Frontend:**
- Next.js 14+
- React
- TypeScript
- Tailwind CSS
- Headless UI
- React Signature Canvas (for signatures)
- PDF.js / react-pdf (for PDF viewing)
- Axios for API calls

**Backend:**
- Django REST Framework
- PostgreSQL
- ReportLab (PDF generation)
- Pillow (image processing)
- Django Channels (real-time, optional)

---

## 📱 Responsive Design
- Mobile-first approach
- Touch-friendly signature pad
- Responsive tables for task lists
- Mobile-optimized modals
- Swipe gestures for task cards

---

## 🔐 Security & Permissions

**Access Levels:**
1. **Staff** - Own boards, tasks, documents
2. **Line Manager** - Assigned boards, tasks to review, documents to sign
3. **Admin** - Full access to everything

**Permissions:**
- Staff can create/edit their boards
- Only assigned managers can approve tasks
- Only assigned manager can sign documents
- Cannot modify signed documents
- Audit trail for all signatures

---

**Version:** 1.0.0  
**Last Updated:** November 5, 2025  
**Status:** 🚧 In Development

