# 🧪 Live Testing Instructions - Step by Step

## 🚀 Current Server Status

✅ **Backend:** Running on http://localhost:8000  
✅ **Frontend:** Running on http://localhost:3004  
✅ **Test Users:** Created and ready

---

## 🔐 Test User Credentials

### 1. Admin User (Full Access)
- **URL:** http://localhost:3004/LoginScreenUser
- **Username:** `admin_test`
- **Password:** `Admin@Test2025`
- **Access Level:** Full admin dashboard, all CRUD operations

### 2. Developer User (Project Management)
- **URL:** http://localhost:3004/LoginScreenUser
- **Username:** `developer_test`
- **Password:** `Dev@Test2025`
- **Access Level:** Developer dashboard, boards, tasks

### 3. Normal User (Basic Access)
- **URL:** http://localhost:3004/LoginScreenUser
- **Username:** `normal_user`
- **Password:** `User@Test2025`
- **Access Level:** User dashboard, profile management

### 4. Client User (Customer Portal)
- **URL:** http://localhost:3004/LoginScreenUser
- **Username:** `client_user`
- **Password:** `Client@Test2025`
- **Access Level:** User dashboard, view projects

### 5. Your Existing Admin
- **Username:** `ludmil`
- **Password:** `Maitland@2025`
- **Access Level:** Full superuser access

---

## 📋 Testing Sequence

### PHASE 1: Guest User Testing (No Login) 🌐

**Start Here:**
1. Open browser (Chrome/Edge recommended)
2. Navigate to: http://localhost:3004
3. **Test Homepage:**
   - [ ] Page loads correctly
   - [ ] All sections visible
   - [ ] Images load
   - [ ] Navigation works
   - [ ] Footer subscribe form visible

4. **Test Public Pages:**
   ```
   ✓ http://localhost:3004/services
   ✓ http://localhost:3004/about-us
   ✓ http://localhost:3004/projects
   ✓ http://localhost:3004/blog
   ✓ http://localhost:3004/contact
   ✓ http://localhost:3004/careers
   ✓ http://localhost:3004/testimonial
   ✓ http://localhost:3004/faq
   ```

5. **Test Service Selection Flow:**
   - [ ] Go to services page
   - [ ] Click on "Website Packages" or any service
   - [ ] Click a plan (e.g., "Basic", "Pro", "Enterprise")
   - [ ] Should redirect to `/proposal` with plan pre-filled
   - [ ] Form should show selected service and plan
   - [ ] Fill out proposal form
   - [ ] Submit successfully

6. **Test Mobile Responsiveness (Guest):**
   - [ ] Press F12 → Toggle device toolbar
   - [ ] Test iPhone SE (375px)
   - [ ] Test iPad (768px)
   - [ ] All content fits and is readable

---

### PHASE 2: Admin User Testing 👨‍💼

**Login as Admin:**
1. Go to: http://localhost:3004/LoginScreenUser
2. Enter username: `admin_test`
3. Enter password: `Admin@Test2025`
4. Click Login

**Admin Dashboard Tests:**

#### A. Dashboard Access & Navigation
- [ ] Successfully redirected to `/admin`
- [ ] See welcome message with username
- [ ] See 3 stat cards (Boards, Users, Tasks)
- [ ] Sidebar visible on desktop
- [ ] Hamburger menu works on mobile

#### B. Analytics Tab (Default)
- [ ] 4 stat cards display:
  - Total Users
  - Page Views
  - Total Tasks
  - Active Sessions
- [ ] Area chart (Page Views & Users) renders
- [ ] Pie chart (Traffic Sources) renders
- [ ] Bar chart (User Activity) renders
- [ ] Line chart (Conversion Rate) renders
- [ ] Charts are interactive (hover works)
- [ ] Real-time activity feed shows

#### C. Services CRUD
1. **Click "Services" tab**
   - [ ] View list of services
   
2. **Create New Service:**
   - [ ] Click "Add Service" or similar button
   - [ ] Fill in:
     - Title: "Test Service Live"
     - Description: "This is a live test service"
     - Price: "$999"
     - Category: "Web Development"
   - [ ] Upload image (optional)
   - [ ] Click Save
   - [ ] Success message appears
   - [ ] New service appears in list

3. **Edit Service:**
   - [ ] Click edit on created service
   - [ ] Change title to "Test Service Updated"
   - [ ] Click Save
   - [ ] Changes reflect immediately

4. **Delete Service:**
   - [ ] Click delete on test service
   - [ ] Confirmation modal appears
   - [ ] Confirm delete
   - [ ] Service removed from list

#### D. Posts (Blog) CRUD
1. **Click "Posts" tab**
   - [ ] View all blog posts
   
2. **Create Post:**
   - [ ] Click "Add Post"
   - [ ] Fill in:
     - Title: "Live Test Blog Post"
     - Content: "Testing blog functionality"
     - Category: Select one
     - Author: Your name
   - [ ] Upload featured image
   - [ ] Set publish date
   - [ ] Click Save/Publish
   - [ ] Post appears in list

3. **Edit & Delete:**
   - [ ] Edit post title
   - [ ] Save changes
   - [ ] Delete test post

#### E. Projects CRUD
1. **Click "Projects" tab**
   - [ ] View all projects
   
2. **Create Project:**
   - [ ] Click "Add Project"
   - [ ] Fill in:
     - Name: "Live Test Project"
     - Description: "Testing project management"
     - Client: "Test Client"
     - Start Date: Today
     - Deadline: +30 days
     - Budget: $5000
     - Status: "In Progress"
   - [ ] Click Save
   - [ ] Project appears

3. **Test Edit & Delete:**
   - [ ] Edit project
   - [ ] Update status
   - [ ] Delete project

#### F. Appointments CRUD
1. **Click "Appointments" tab**
   - [ ] View appointments
   
2. **Create Appointment:**
   - [ ] Add new appointment
   - [ ] Set date/time
   - [ ] Select service
   - [ ] Add client details
   - [ ] Save successfully

#### G. Solutions, Testimonials, Team
- [ ] Test each tab
- [ ] Create one entry in each
- [ ] Edit entry
- [ ] Delete entry
- [ ] Verify all work correctly

#### H. Boards Management
- [ ] Click "Boards" tab
- [ ] View existing boards
- [ ] Create new board "Admin Test Board"
- [ ] Assign users to board
- [ ] Edit board details
- [ ] Delete test board

#### I. Members Management
- [ ] Click "Members" tab
- [ ] View all users
- [ ] Check user groups
- [ ] Verify roles assigned correctly

#### J. Tasks Management
- [ ] Click "My Tasks" or "Task Table"
- [ ] View all tasks
- [ ] Create new task
- [ ] Assign to user
- [ ] Change status
- [ ] Mark as complete
- [ ] Delete task

#### K. Documents
- [ ] Click "Documents" tab
- [ ] Upload a test PDF
- [ ] View document
- [ ] Try signing feature:
   - [ ] Click "Sign Document"
   - [ ] PDF viewer loads
   - [ ] Click on PDF to place signature
   - [ ] Signature appears at correct position
   - [ ] Can drag/resize signature
   - [ ] Save signed document
   - [ ] Verify saved correctly

#### L. Campaign
- [ ] Click "Campaign" tab
- [ ] Create email campaign
- [ ] Select recipients
- [ ] Write email content
- [ ] Schedule or send
- [ ] View campaign status

#### M. Careers
- [ ] Click "Careers" tab
- [ ] View job postings
- [ ] Create new job posting
- [ ] Edit job details
- [ ] View applications (if any)
- [ ] Delete job posting

#### N. Settings
- [ ] Click "Settings" tab
- [ ] View profile information
- [ ] Update profile:
   - [ ] Change name
   - [ ] Update email
   - [ ] Upload avatar
   - [ ] Save changes
- [ ] Change password:
   - [ ] Enter current password
   - [ ] Enter new password
   - [ ] Confirm new password
   - [ ] Submit
   - [ ] Success message
- [ ] Update notification preferences
- [ ] Test appearance settings

#### O. Mobile Testing (Admin)
- [ ] Press F12 → Device toolbar
- [ ] iPhone SE (375px):
   - [ ] Hamburger menu appears
   - [ ] Click hamburger → sidebar slides in
   - [ ] Tap outside → sidebar closes
   - [ ] Stats show 2 columns
   - [ ] Tabs scroll horizontally
   - [ ] All buttons tappable
   - [ ] Forms usable
- [ ] iPad (768px):
   - [ ] Better layout
   - [ ] 3-4 column stats
   - [ ] More spacing
- [ ] Desktop (1920px):
   - [ ] Full layout
   - [ ] Sidebar always visible
   - [ ] 4 column stats

#### P. Logout & Re-login
- [ ] Click logout
- [ ] Redirected to login page
- [ ] Login again with same credentials
- [ ] Access admin dashboard successfully

---

### PHASE 3: Developer User Testing 💻

**Login as Developer:**
1. Logout from admin
2. Go to: http://localhost:3004/LoginScreenUser
3. Login with:
   - Username: `developer_test`
   - Password: `Dev@Test2025`

**Developer Dashboard Tests:**

#### A. Dashboard Access
- [ ] Redirected to `/devDashBoard`
- [ ] See welcome message
- [ ] See 4 stat cards (Boards, Active Projects, Team Members, Tasks)
- [ ] Admin Panel button visible (should redirect to admin)

#### B. Board Management
1. **View Boards:**
   - [ ] See all boards you have access to
   - [ ] Grid view displays properly
   
2. **Create Board:**
   - [ ] Enter board name in input: "Dev Test Board"
   - [ ] Click "Add Board"
   - [ ] Board appears in list
   - [ ] Success message shown

3. **View Board Details:**
   - [ ] Click on created board
   - [ ] Modal or page shows board details
   - [ ] Can see lists (if any)
   - [ ] Can see cards

4. **View Toggle:**
   - [ ] Switch between Grid and List view
   - [ ] Both views work correctly

5. **Edit Board:**
   - [ ] Edit board name
   - [ ] Add development link
   - [ ] Add repository link
   - [ ] Save changes

6. **Delete Board:**
   - [ ] Delete test board
   - [ ] Confirmation required
   - [ ] Board removed

#### C. Mobile Testing (Developer)
- [ ] Test on iPhone SE
- [ ] Stats show 2 columns
- [ ] Create board section stacks
- [ ] Button shows "Add" instead of "Add Board"
- [ ] Board grid adjusts (1 col mobile)

#### D. Access Control
- [ ] Try accessing `/admin`
- [ ] Should have staff access
- [ ] Limited admin functions visible

---

### PHASE 4: Normal User Testing 👥

**Login as Normal User:**
1. Logout from developer
2. Login with:
   - Username: `normal_user`
   - Password: `User@Test2025`

**User Dashboard Tests:**

#### A. Dashboard Access
- [ ] Redirected to `/userDashboard`
- [ ] See welcome message with name
- [ ] Avatar or initials display
- [ ] 4 stat cards visible
- [ ] Settings button visible

#### B. Overview Tab
- [ ] View recent projects
- [ ] View recent tasks
- [ ] See dashboard summary
- [ ] All data displays correctly

#### C. My Projects Tab
- [ ] Click "My Projects" tab
- [ ] View projects assigned to user
- [ ] Project cards display properly
- [ ] Can click for details

#### D. My Tasks Tab
- [ ] Click "My Tasks" tab
- [ ] View assigned tasks
- [ ] Can filter by status
- [ ] Task details visible
- [ ] Can mark tasks complete (if allowed)

#### E. Appointments Tab
- [ ] View scheduled appointments
- [ ] See appointment details
- [ ] Can view history

#### F. Proposals Tab
- [ ] View submitted proposals
- [ ] Check proposal status
- [ ] View details

#### G. Profile Tab
- [ ] Click "Profile" tab
- [ ] View profile information
- [ ] Edit profile:
   - [ ] Change name
   - [ ] Update email
   - [ ] Update phone
   - [ ] Update company
   - [ ] Upload avatar
   - [ ] Save changes
   - [ ] Success message
   - [ ] Changes persist after refresh

#### H. Mobile Testing (User)
- [ ] Test on mobile devices
- [ ] Header stacks properly
- [ ] Stats show 2 columns
- [ ] Tabs scroll
- [ ] Tab labels shortened
- [ ] All content accessible

#### I. Access Control
- [ ] Try accessing `/admin`
- [ ] Should be denied or redirected
- [ ] Try accessing `/devDashBoard`
- [ ] Should be denied or redirected

---

### PHASE 5: Client User Testing 🤝

**Login as Client:**
1. Logout from normal user
2. Login with:
   - Username: `client_user`
   - Password: `Client@Test2025`

**Client Dashboard Tests:**
- [ ] Access user dashboard
- [ ] View projects
- [ ] Check project progress
- [ ] View tasks assigned
- [ ] Update profile
- [ ] Same functionality as normal user

---

### PHASE 6: Cross-Browser Testing 🌐

**Test in Multiple Browsers:**

#### Chrome/Edge
- [ ] All features work
- [ ] No console errors
- [ ] Animations smooth

#### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Layouts correct

#### Safari (if available)
- [ ] All features work
- [ ] iOS Safari mobile
- [ ] Touch interactions work

---

### PHASE 7: API Endpoint Testing 🔌

**Test Backend APIs:**

Open a new terminal and test these endpoints:

```powershell
# Test Services API
curl http://localhost:8000/information/services/

# Test Blogs API
curl http://localhost:8000/posts/blogs/

# Test Projects API
curl http://localhost:8000/projects/

# Test Solutions API
curl http://localhost:8000/solutions/

# Test Testimonials API
curl http://localhost:8000/information/testimonials/

# Test Team API
curl http://localhost:8000/information/team/

# Test Careers API
curl http://localhost:8000/careers/careers/

# Test Appointments API (requires auth)
curl http://localhost:8000/appointments/ -H "Authorization: Bearer YOUR_TOKEN"

# Test Boards API (requires auth)
curl http://localhost:8000/api/boards/ -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Results:**
- [ ] All return 200 OK or appropriate status
- [ ] JSON data returned
- [ ] No server errors
- [ ] Protected endpoints require auth

---

### PHASE 8: Performance Testing ⚡

**Load Time Checks:**
- [ ] Homepage loads < 3 seconds
- [ ] Admin dashboard loads < 5 seconds
- [ ] API responses < 500ms
- [ ] No layout shift during load
- [ ] Images load progressively

**Network Tab (F12):**
- [ ] Check bundle sizes
- [ ] Check API call times
- [ ] Check for failed requests
- [ ] Check for duplicate calls

---

### PHASE 9: Error Handling Testing 🐛

**Test Error Scenarios:**

1. **Invalid Login:**
   - [ ] Try wrong username
   - [ ] Try wrong password
   - [ ] Error message displays

2. **Network Errors:**
   - [ ] Stop backend server
   - [ ] Try loading data
   - [ ] Error message shows
   - [ ] Graceful degradation

3. **Form Validation:**
   - [ ] Submit empty forms
   - [ ] Enter invalid data
   - [ ] Validation messages appear

4. **404 Pages:**
   - [ ] Visit non-existent URL
   - [ ] 404 page displays
   - [ ] Can navigate back

---

### PHASE 10: Mixpanel Analytics Testing 📊

**Track Events:**
1. **First Visit:**
   - [ ] Analytics consent banner appears
   - [ ] Can accept or decline
   - [ ] Choice persists

2. **User Actions:**
   - [ ] Login tracked
   - [ ] Page views tracked
   - [ ] CTA clicks tracked
   - [ ] Form submissions tracked

3. **Dashboard Actions:**
   - [ ] Tab changes tracked
   - [ ] CRUD operations tracked
   - [ ] Settings changes tracked

4. **Verify in Mixpanel:**
   - [ ] Login to Mixpanel dashboard
   - [ ] See events in real-time
   - [ ] User profiles created
   - [ ] Funnel analysis works

---

## ✅ Final Checklist

Before marking testing complete:
- [ ] All 5 user roles tested
- [ ] All dashboards functional
- [ ] All CRUD operations work
- [ ] Mobile responsiveness confirmed
- [ ] API endpoints working
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] Error handling works
- [ ] Analytics tracking verified
- [ ] Documentation complete

---

## 🎯 Quick Test Links

### Frontend URLs (Port 3004)
```
Homepage:          http://localhost:3004
Login:             http://localhost:3004/LoginScreenUser
Admin Dashboard:   http://localhost:3004/admin
User Dashboard:    http://localhost:3004/userDashboard
Dev Dashboard:     http://localhost:3004/devDashBoard
Services:          http://localhost:3004/services
Blog:              http://localhost:3004/blog
Projects:          http://localhost:3004/projects
Careers:           http://localhost:3004/careers
Contact:           http://localhost:3004/contact
Proposal:          http://localhost:3004/proposal
```

### Backend URLs (Port 8000)
```
Django Admin:      http://localhost:8000/admin
API Root:          http://localhost:8000/api/
Services API:      http://localhost:8000/information/services/
Blogs API:         http://localhost:8000/posts/blogs/
Projects API:      http://localhost:8000/projects/
```

---

## 📝 Testing Notes Template

Use this to document your findings:

```
DATE: [Current Date]
TESTER: [Your Name]
BROWSER: [Browser Name/Version]

ADMIN USER TEST:
✅ Passed: [List what worked]
❌ Failed: [List what didn't work]
⚠️  Issues: [List any concerns]

DEVELOPER USER TEST:
✅ Passed:
❌ Failed:
⚠️  Issues:

NORMAL USER TEST:
✅ Passed:
❌ Failed:
⚠️  Issues:

MOBILE RESPONSIVENESS:
✅ Passed:
❌ Failed:
⚠️  Issues:

OVERALL ASSESSMENT:
[Your summary here]
```

---

## 🚀 Start Testing Now!

Begin with **PHASE 1** and work through each phase systematically.  
Document any issues you find.  
Take screenshots of any bugs or unexpected behavior.

**Good luck with your live testing! 🎉**

