# 🧪 Role-Based Testing Guide

## Overview
Comprehensive testing guide for all user roles: Admin, Staff, Developer, Normal User, and Client.

---

## 👤 User Roles & Access

### 1. Admin User
**Permissions:** Full access to everything
**Access:**
- ✅ User Dashboard
- ✅ Admin Dashboard (all tabs)
- ✅ Developer Dashboard
- ✅ All public pages
- ✅ Settings and configuration

### 2. Staff User
**Permissions:** Project and task management
**Access:**
- ✅ User Dashboard
- ✅ Admin Dashboard (limited tabs)
- ✅ Developer Dashboard
- ✅ All public pages
- ❌ System settings (admin only)

### 3. Developer/Freelancer
**Permissions:** Assigned projects and tasks
**Access:**
- ✅ User Dashboard
- ✅ Developer Dashboard
- ✅ My Tasks (assigned only)
- ✅ All public pages
- ❌ Admin Dashboard
- ❌ User management

### 4. Normal User (Client)
**Permissions:** Own projects and profile
**Access:**
- ✅ User Dashboard
- ✅ My Projects
- ✅ My Appointments
- ✅ My Proposals
- ✅ Profile settings
- ❌ Admin/Dev dashboards
- ❌ Other users' data

### 5. Guest (Not Logged In)
**Permissions:** Public pages only
**Access:**
- ✅ Homepage
- ✅ Services
- ✅ Blog
- ✅ About Us
- ✅ Contact
- ✅ Login/Signup
- ❌ All dashboards
- ❌ User-specific content

---

## 🧪 Testing Scenarios

### TEST USER: ludmil
**Credentials:**
```
Username: ludmil
Password: Maitland@2025
```

---

## 📋 Complete Testing Checklist

### PART 1: Guest/Anonymous User Testing

#### Homepage Testing
- [ ] Visit https://www.maindodigital.com/
- [ ] **Verify:**
  - [ ] Page loads correctly
  - [ ] Navigation menu visible
  - [ ] Hero section displays
  - [ ] Services section loads
  - [ ] Testimonials display
  - [ ] Footer links work
  - [ ] **Mixpanel consent shows** (if first visit)
  - [ ] Can click "Allow" or "No, thanks"
  - [ ] **After response, notification should NEVER show again**

#### Services Testing
- [ ] Click "Services" in navigation
- [ ] **Verify:**
  - [ ] Services grid displays
  - [ ] Each service card clickable
  - [ ] Click on a service
  - [ ] Service detail page loads
  - [ ] Plans and pricing visible
  - [ ] Can click plan CTA
  - [ ] Redirects to proposal form
  - [ ] **Form pre-filled with service/plan**
  - [ ] **Visual confirmation box shows selection**

#### Blog Testing
- [ ] Click "Blog" in navigation
- [ ] **Verify:**
  - [ ] Blog posts list displays
  - [ ] Posts have images and titles
  - [ ] Pagination works
  - [ ] Click on a blog post
  - [ ] Full post displays
  - [ ] Comments section visible
  - [ ] Share buttons work

#### Contact & Forms
- [ ] Visit /contact
- [ ] Fill contact form
- [ ] Submit
- [ ] **Verify:**
  - [ ] Success message shows
  - [ ] Email sent confirmation

---

### PART 2: Normal User/Client Testing

#### Login Process
- [ ] Visit https://www.maindodigital.com/LoginScreenUser
- [ ] **Enter credentials:**
  - Username: ludmil
  - Password: Maitland@2025
- [ ] Click Login
- [ ] **Verify:**
  - [ ] Login successful
  - [ ] User menu appears in header
  - [ ] Shows "ludmil" name
  - [ ] Dropdown menu works

#### User Dashboard Access
- [ ] After login, click user menu
- [ ] Click "My Dashboard"
- [ ] **Verify:**
  - [ ] Redirects to /userDashboard
  - [ ] Welcome message shows: "Welcome back, ludmil!"
  - [ ] Avatar/initial displays
  - [ ] 4 statistics cards show:
    - Active Projects count
    - Pending Tasks count
    - Appointments count
    - Proposals count

#### Overview Tab (Default)
- [ ] **Verify Overview Tab:**
  - [ ] Recent projects section
  - [ ] Project cards show:
    - Title
    - Description
    - Progress bar
    - Status badge
    - Start date and deadline
  - [ ] Upcoming appointments section
  - [ ] Appointment cards show:
    - Service name
    - Date and time
    - Status
    - Notes

#### My Projects Tab
- [ ] Click "My Projects" tab
- [ ] **Verify:**
  - [ ] All user projects display
  - [ ] Project cards show:
    - Title and description
    - Status badge (color-coded)
    - Progress bar with percentage
    - Start date and deadline
  - [ ] "View Details" button clickable
  - [ ] "Request New Project" button visible
  - [ ] Grid layout responsive

#### My Tasks Tab
- [ ] Click "My Tasks" tab
- [ ] **Verify:**
  - [ ] Task table displays
  - [ ] Columns show:
    - Task name
    - Status (color-coded)
    - Priority (color-coded)
    - Due date
    - Actions
  - [ ] Edit button works
  - [ ] Table is responsive

#### Appointments Tab
- [ ] Click "Appointments" tab
- [ ] **Verify:**
  - [ ] Appointments list displays
  - [ ] Each appointment shows:
    - Service name
    - Date and time
    - Status badge
    - Notes
  - [ ] "Reschedule" button visible
  - [ ] "Cancel" button visible
  - [ ] "Book New Appointment" button links to /appointment

#### Proposals Tab
- [ ] Click "Proposals" tab
- [ ] **Verify:**
  - [ ] Proposals list displays
  - [ ] Each proposal shows:
    - Service requested
    - Status (Approved/Under Review/etc)
    - Submission date
    - Last updated date
  - [ ] "View Details" button
  - [ ] "Download" button
  - [ ] "New Proposal Request" button links to /proposal

#### Profile Tab
- [ ] Click "Profile" tab
- [ ] **Verify:**
  - [ ] Avatar displays
  - [ ] "Change Photo" button visible
  - [ ] Form fields editable:
    - Full Name
    - Email
    - Phone
    - Company
  - [ ] "Save Changes" button
  - [ ] "Cancel" button
  - [ ] Account settings section:
    - Change Password
    - Notification Preferences
    - Delete Account

#### Profile Edit Test
- [ ] Change your name in profile
- [ ] Click "Save Changes"
- [ ] **Verify:**
  - [ ] Success notification appears
  - [ ] Name updates in header
  - [ ] Data persists on refresh
  - [ ] **Mixpanel tracks "Profile Updated" event**

---

### PART 3: Staff User Testing

#### Admin Dashboard Access (Staff)
- [ ] After login, click user menu
- [ ] Click "Admin Panel"
- [ ] **Verify:**
  - [ ] Staff check passes
  - [ ] Redirects to /admin
  - [ ] Sidebar visible
  - [ ] Tabs accessible

#### Analytics Tab (DEFAULT)
- [ ] **Verify Analytics Tab loads first:**
  - [ ] 4 stat cards display:
    - Total Users (number)
    - Page Views (number)
    - Total Tasks (number)
    - Active Sessions (number)
  - [ ] Charts display:
    - Page Views & Users (Area chart)
    - Traffic Sources (Pie chart)
    - User Activity (Bar chart)
    - Conversion Rate (Line chart)
  - [ ] Real-time activity feed shows
  - [ ] Export Report button visible
  - [ ] Date range selector visible

#### Charts Interaction
- [ ] **Hover over charts:**
  - [ ] Tooltips appear
  - [ ] Data labels show
  - [ ] Interactive elements respond
  - [ ] Charts are responsive

#### Boards Tab
- [ ] Click "Boards" tab
- [ ] **Verify:**
  - [ ] Kanban boards display
  - [ ] Can create new board
  - [ ] Can view lists
  - [ ] Can manage cards
  - [ ] Drag and drop works

#### Members Tab
- [ ] Click "Members" tab
- [ ] **Verify:**
  - [ ] User list displays
  - [ ] Can search users
  - [ ] Can view user details
  - [ ] Can manage groups
  - [ ] Permissions visible

#### My Tasks Tab
- [ ] Click "My Tasks" tab
- [ ] **Verify:**
  - [ ] Assigned tasks show
  - [ ] Can update status
  - [ ] Can add comments
  - [ ] Progress tracking

#### Task Table Tab
- [ ] Click "Task Table" tab
- [ ] **Verify:**
  - [ ] All tasks in table
  - [ ] Can filter by:
    - Board
    - Status
    - Assignee
  - [ ] Can assign/reassign
  - [ ] Can change status

#### Documents Tab
- [ ] Click "Documents" tab
- [ ] **Verify Documents has 5 sub-tabs:**

**Upload Tab:**
  - [ ] Can upload PDF
  - [ ] File validation works
  - [ ] Upload progress shows
  - [ ] Document appears in list

**Create Tab:**
  - [ ] Rich text editor loads
  - [ ] Can create document
  - [ ] Can save as PDF
  - [ ] Preview works

**Sign Tab:** (CRITICAL - SIGNATURE FIX)
  - [ ] Document dropdown shows
  - [ ] Select a document
  - [ ] PDF displays at 800px width
  - [ ] **Click where you want signature**
  - [ ] **Signature modal opens**
  - [ ] Can draw/type/upload signature
  - [ ] Click Save
  - [ ] **Signature appears EXACTLY where clicked** ✨
  - [ ] Can drag signature
  - [ ] **Signature stays within PDF bounds**
  - [ ] Can resize signature
  - [ ] Can rotate signature
  - [ ] Can delete signature
  - [ ] Can add multiple signatures
  - [ ] Page navigation works
  - [ ] "Submit Signed Document" works
  - [ ] Final PDF has correct placement

**Send to Sign Tab:**
  - [ ] Can select document
  - [ ] Can select recipient
  - [ ] Can send email
  - [ ] Email with link sent

**Signed Tab:**
  - [ ] Signed documents list
  - [ ] Can download signed PDFs
  - [ ] Signature visible in PDF

#### Campaign Tab
- [ ] Click "Campaign" tab
- [ ] **Verify:**
  - [ ] Can create email campaign
  - [ ] Can select recipients
  - [ ] Email editor works
  - [ ] Can send test email
  - [ ] Can view statistics

#### Careers Tab
- [ ] Click "Careers" tab
- [ ] **Verify:**
  - [ ] Job applications list
  - [ ] Can view applicant details
  - [ ] Can download resumes
  - [ ] Can update status
  - [ ] Can send responses

#### Settings Tab
- [ ] Click "Settings" tab
- [ ] **Verify:**
  - [ ] System settings visible
  - [ ] Can update configurations
  - [ ] Save button works

---

### PART 4: Developer User Testing

#### Developer Dashboard
- [ ] Login as developer
- [ ] Go to /devDashBoard
- [ ] **Verify:**
  - [ ] Professional UI loads
  - [ ] Statistics cards show:
    - Total Boards
    - Active Projects
    - Team Members
    - Tasks
  - [ ] Create New Board section
  - [ ] Can add board
  - [ ] Grid/List view toggle works
  - [ ] Board cards display
  - [ ] Can click board for details
  - [ ] Delete confirmation works

#### Task Management
- [ ] **Verify developers can:**
  - [ ] See assigned tasks only
  - [ ] Update task status
  - [ ] Add comments
  - [ ] Upload files
  - [ ] Track time

---

### PART 5: Admin User Testing

#### Full Admin Access
- [ ] Login as admin
- [ ] **Verify all admin features:**
  - [ ] Can access ALL tabs
  - [ ] Can manage users
  - [ ] Can delete/edit anything
  - [ ] Can view all analytics
  - [ ] Can configure system
  - [ ] Full CRUD on all entities

#### User Management
- [ ] Go to Members tab
- [ ] **Verify can:**
  - [ ] Create new user
  - [ ] Edit existing user
  - [ ] Delete user
  - [ ] Assign to groups
  - [ ] Set permissions
  - [ ] View user activity

---

## 🎯 Mixpanel Testing

### Analytics Consent Testing

#### First Visit
- [ ] Open site in incognito/private mode
- [ ] **Verify:**
  - [ ] Consent banner appears at bottom
  - [ ] Shows: "We use analytics (Mixpanel)..."
  - [ ] Two buttons: "No, thanks" and "Allow"

#### Click "Allow"
- [ ] Click "Allow" button
- [ ] **Verify:**
  - [ ] Banner disappears immediately
  - [ ] localStorage set to "accepted"
  - [ ] Mixpanel initialized
  - [ ] Console shows: "✅ Mixpanel initialized successfully"
  - [ ] **Banner NEVER shows again** (even on refresh)

#### Click "No, thanks"
- [ ] Open in new incognito window
- [ ] Click "No, thanks"
- [ ] **Verify:**
  - [ ] Banner disappears
  - [ ] localStorage set to "denied"
  - [ ] Mixpanel NOT initialized
  - [ ] No tracking occurs
  - [ ] **Banner NEVER shows again**

#### Already Responded
- [ ] Visit site after consent given
- [ ] **Verify:**
  - [ ] **NO banner shows**
  - [ ] Mixpanel loads automatically (if accepted)
  - [ ] No interruption to user
  - [ ] Clean user experience

---

### Event Tracking Verification

#### Page View Events
- [ ] Navigate through site
- [ ] **Check Mixpanel dashboard:**
  - [ ] Each page view tracked
  - [ ] URL captured
  - [ ] Timestamp correct
  - [ ] User identified (if logged in)

#### Service Selection Events
- [ ] View a service
- [ ] **Check Mixpanel:**
  - [ ] "Service Viewed" event
  - [ ] Service name captured
  - [ ] Slug captured

- [ ] Click on a plan
- [ ] **Check Mixpanel:**
  - [ ] "Plan Selected" event
  - [ ] Service, plan, price captured

#### Proposal Submission
- [ ] Submit proposal form
- [ ] **Check Mixpanel:**
  - [ ] "Proposal Submitted" event
  - [ ] All form data captured
  - [ ] Plan details included

#### Dashboard Navigation
- [ ] Login and access dashboard
- [ ] **Check Mixpanel:**
  - [ ] "User Dashboard Viewed" event
  - [ ] User ID captured

- [ ] Switch between tabs
- [ ] **Check Mixpanel:**
  - [ ] "Dashboard Tab Changed" event
  - [ ] Tab name captured

#### Profile Update
- [ ] Edit profile and save
- [ ] **Check Mixpanel:**
  - [ ] "Profile Updated" event
  - [ ] User ID captured

---

## 🎨 UI/UX Testing

### Responsive Design

#### Desktop (>1024px)
- [ ] All elements visible
- [ ] Sidebar always visible
- [ ] Full-width charts
- [ ] Multi-column grids

#### Tablet (768-1024px)
- [ ] Adapted layout
- [ ] Responsive grids
- [ ] Touch-friendly buttons
- [ ] Readable text

#### Mobile (<768px)
- [ ] Hamburger menu works
- [ ] Single column layout
- [ ] Cards stack vertically
- [ ] Forms full width
- [ ] Touch optimized
- [ ] No horizontal scroll

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

---

## 🔒 Security Testing

### Access Control
- [ ] **Guest cannot access:**
  - [ ] /userDashboard
  - [ ] /admin
  - [ ] /devDashBoard
- [ ] **Redirects to login** ✅

- [ ] **Normal user cannot access:**
  - [ ] /admin (unless staff)
  - [ ] Other users' data
- [ ] **Shows access denied** ✅

- [ ] **Staff can access:**
  - [ ] /admin
  - [ ] Project management
  - [ ] Task management
- [ ] **Works correctly** ✅

### Authentication
- [ ] Login with wrong password
- [ ] **Verify:** Error message shows

- [ ] Login with correct credentials
- [ ] **Verify:** Login successful

- [ ] Logout
- [ ] **Verify:** Session cleared, redirected

---

## 📊 Admin Analytics Testing

### Analytics Dashboard
- [ ] Login as staff/admin
- [ ] Go to /admin
- [ ] **Verify Analytics tab is DEFAULT**
- [ ] **Charts display:**

#### Area Chart (Page Views & Users)
- [ ] Chart renders
- [ ] Data displays
- [ ] Hover shows tooltip
- [ ] Legend visible
- [ ] Axes labeled

#### Pie Chart (Traffic Sources)
- [ ] Chart renders
- [ ] Percentages show
- [ ] Labels visible
- [ ] Colors different
- [ ] Interactive

#### Bar Chart (User Activity)
- [ ] Chart renders
- [ ] Bars display
- [ ] Hours labeled
- [ ] Tooltip works
- [ ] Responsive

#### Line Chart (Conversion Rate)
- [ ] Chart renders
- [ ] Lines visible
- [ ] Points clickable
- [ ] Legend clear
- [ ] Data accurate

#### Statistics Cards
- [ ] Total Users shows DB count
- [ ] Page Views shows Mixpanel data
- [ ] Total Tasks shows DB count
- [ ] Active Sessions shows live count

#### Real-time Activity Feed
- [ ] Feed displays
- [ ] Shows recent activities
- [ ] Icons visible
- [ ] Timestamps shown
- [ ] Scrollable

---

## 🎯 Feature Integration Testing

### Service to Proposal Flow

#### Test Flow 1: General Service Request
- [ ] Go to /services
- [ ] Click service "Learn More"
- [ ] Click "Request a Proposal" in hero
- [ ] **Verify:**
  - [ ] URL: /proposal?service=ServiceName
  - [ ] Service field pre-filled
  - [ ] Message includes service name
  - [ ] Visual box shows selected service

#### Test Flow 2: Specific Plan Request
- [ ] Go to /services
- [ ] Click service "Learn More"
- [ ] Scroll to pricing
- [ ] Click plan button (e.g., "Get Started")
- [ ] **Verify:**
  - [ ] URL: /proposal?service=X&plan=Y&price=Z
  - [ ] Service field shows: "Service - Plan ($Price)"
  - [ ] Message includes full plan details
  - [ ] Visual box shows:
    - Service name
    - Plan name
    - Price
  - [ ] User only adds personal info
  - [ ] Submit works

---

### Document Signing Flow (CRITICAL)

#### Signature Placement Test
- [ ] Login as staff/admin
- [ ] Go to /admin → Documents → Sign
- [ ] Select a document from dropdown
- [ ] **PDF displays centered at 800px**
- [ ] Click on PDF where signature should go
- [ ] **Verify click position:**
  - [ ] Signature modal opens
  - [ ] Modal has 3 tabs: Draw, Type, Upload

**Draw Tab:**
- [ ] Canvas appears
- [ ] Can draw with mouse/touch
- [ ] "Clear" button works
- [ ] Signature preview shows

**Type Tab:**
- [ ] Input field for name
- [ ] Font selector dropdown
- [ ] Preview updates live
- [ ] Multiple fonts available

**Upload Tab:**
- [ ] File input visible
- [ ] Can select image
- [ ] Preview shows
- [ ] Background removal works

- [ ] Save signature
- [ ] **CRITICAL: Verify signature appears EXACTLY where clicked**
- [ ] **NO offset or misalignment**

#### Signature Manipulation
- [ ] Hover over signature
- [ ] **Verify toolbar appears:**
  - [ ] Rotate left button (⟲)
  - [ ] Rotate right button (⟳)
  - [ ] Delete button

- [ ] Drag signature
- [ ] **Verify:**
  - [ ] Moves smoothly
  - [ ] **Cannot drag outside PDF**
  - [ ] Position updates in real-time

- [ ] Resize signature
- [ ] **Verify:**
  - [ ] Corners draggable
  - [ ] Maintains aspect ratio (optional)
  - [ ] **Cannot resize beyond PDF**

- [ ] Click rotate buttons
- [ ] **Verify:**
  - [ ] Signature rotates 15° per click
  - [ ] Visual update immediate

#### Multi-page Document
- [ ] Navigate to page 2
- [ ] Add signature on page 2
- [ ] Navigate back to page 1
- [ ] **Verify:**
  - [ ] Page 1 signature still there
  - [ ] Each page shows its own signatures
  - [ ] Page navigation preserves state

#### Submit Signed Document
- [ ] Click "Submit Signed Document"
- [ ] **Verify:**
  - [ ] Processing indicator shows
  - [ ] Success message appears
  - [ ] Signed PDF downloads/opens
  - [ ] **Signatures in correct positions**
  - [ ] **Mixpanel tracks "Document Signed"**

---

### PART 6: Cross-Browser Testing

#### Chrome
- [ ] All features work
- [ ] Charts render
- [ ] Forms submit
- [ ] No console errors

#### Firefox
- [ ] All features work
- [ ] Signatures work
- [ ] Dashboard loads

#### Safari
- [ ] iOS/macOS Safari
- [ ] Touch events work
- [ ] Charts display

#### Edge
- [ ] Windows Edge
- [ ] Full functionality

---

## 🎯 Mixpanel Event Verification

### Events to Verify in Mixpanel Dashboard

1. **Page View**
   - Properties: page, url, referrer
   - Frequency: Every navigation

2. **User Login**
   - Properties: method, userId
   - Frequency: Each login

3. **Service Viewed**
   - Properties: serviceName, slug
   - Frequency: Each service detail view

4. **Plan Selected**
   - Properties: service, plan, price
   - Frequency: Each plan click

5. **Proposal Submitted**
   - Properties: service, plan, price
   - Frequency: Each submission

6. **User Dashboard Viewed**
   - Properties: userId
   - Frequency: Each dashboard access

7. **Dashboard Tab Changed**
   - Properties: tab
   - Frequency: Each tab switch

8. **Profile Updated**
   - Properties: userId
   - Frequency: Each save

9. **Document Signed**
   - Properties: documentId, documentTitle
   - Frequency: Each signing

---

## ✅ Success Criteria

### Frontend
- [ ] All 26 pages load without errors
- [ ] Navigation works smoothly
- [ ] Forms validate and submit
- [ ] Dashboards display correctly
- [ ] Charts render properly
- [ ] Mobile responsive
- [ ] No console errors

### Backend Integration
- [ ] API calls successful
- [ ] Authentication working
- [ ] Data fetching operational
- [ ] CRUD operations functional
- [ ] File uploads working

### Analytics
- [ ] **Consent banner shows ONLY on first visit**
- [ ] **After response, NEVER shows again**
- [ ] Mixpanel initializes on consent
- [ ] Events track correctly
- [ ] User identified properly
- [ ] Dashboard shows data

### Role-Based Access
- [ ] Guest: Public only
- [ ] User: Dashboard + own data
- [ ] Developer: Tasks + boards
- [ ] Staff: Admin features
- [ ] Admin: Full access

---

## 🎊 Test Completion

### When All Checked
- [ ] All user roles tested
- [ ] All dashboards functional
- [ ] All forms working
- [ ] Signature placement perfect
- [ ] Analytics tracking
- [ ] Mixpanel consent working
- [ ] Mobile responsive
- [ ] No critical errors

### Then
✅ **APPLICATION FULLY TESTED AND VERIFIED**  
✅ **READY FOR PRODUCTION USE**  
✅ **CLEARED FOR REAL USERS**

---

## 📝 Test Report Template

After completing tests, fill in:

```
Test Date: _______________
Tested By: _______________
User Role: _______________

Tests Passed: ____ / ____
Issues Found: ____
Critical: ____
Minor: ____

Overall Status: ☐ PASS ☐ PASS WITH ISSUES ☐ FAIL

Notes:
_________________________________
_________________________________
_________________________________

Sign-off: _______________
```

---

*Testing Guide Version: 1.0*  
*Last Updated: October 15, 2025*  
*Status: Ready for execution*

**🎯 USE THIS GUIDE FOR COMPREHENSIVE ROLE-BASED TESTING**
