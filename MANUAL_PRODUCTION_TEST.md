# 🧪 MANUAL PRODUCTION TESTING CHECKLIST

## 📋 **COMPLETE REAL-LIFE TEST GUIDE**

**Test URL:** https://www.maindodigital.com  
**API URL:** https://maindoagency.pythonanywhere.com

**Before Testing:** Make sure you've deployed latest code (git pull + reload)

---

## ✅ **TEST 1: APPOINTMENT BOOKING (Critical)**

### **Steps:**
1. Go to https://www.maindodigital.com/appointment
2. Fill in ALL fields:
   - Date: Tomorrow's date
   - Time: 10:00
   - Reason: "Website consultation"
   - Phone: +27123456789
   - Email: testuser@example.com (use unique email each time)
3. Click "Book Appointment"

### **Expected Result:**
- ✅ Success message: "Appointment booked successfully!"
- ✅ Redirects to homepage
- ✅ Email sent to testuser@example.com
- ✅ Email contains login credentials
- ✅ No 500 error in console

### **If Fails:**
- Check PythonAnywhere error log
- Verify migrations ran
- Ensure code was pulled from GitHub

---

## ✅ **TEST 2: USER LOGIN & DASHBOARD**

### **Steps:**
1. Go to https://www.maindodigital.com/LoginScreenUser
2. Login with:
   - Username: testuser@example.com
   - Password: +27123456789 (the phone from appointment)
3. Should redirect to user dashboard

### **Expected Result:**
- ✅ Login successful
- ✅ Dashboard loads
- ✅ See tabs: Overview, Projects, Tasks, Appointments, Proposals, Invoices
- ✅ Appointment appears in Appointments tab
- ✅ No console errors

---

## ✅ **TEST 3: PROPOSAL REQUEST (User)**

### **Steps:**
1. Go to https://www.maindodigital.com/proposal
2. Fill form:
   - Name: Test Client
   - Email: test@example.com
   - Phone: +27987654321
   - Company: Test Corp
   - Service: Select any service
   - Timeline: 6-8 weeks
   - Message: "Need a professional website"
3. Submit

### **Expected Result:**
- ✅ Success message
- ✅ Board auto-created in backend
- ✅ Email sent to admins
- ✅ User can see proposal in dashboard (if logged in)

---

## ✅ **TEST 4: ADMIN LOGIN**

### **Steps:**
1. Go to https://www.maindodigital.com/admin
2. Login with admin credentials
3. Dashboard loads

### **Expected Result:**
- ✅ Admin dashboard loads
- ✅ See sidebar menu
- ✅ All tabs accessible
- ✅ No console errors

---

## ✅ **TEST 5: ADMIN - VIEW APPOINTMENTS**

### **Steps:**
1. In admin dashboard, click "Appointments"
2. View list of appointments

### **Expected Result:**
- ✅ Page loads without errors
- ✅ See all appointments
- ✅ Can filter by status
- ✅ Can search appointments
- ✅ Can edit appointments
- ✅ No "Cannot read properties of undefined" error

---

## ✅ **TEST 6: ADMIN - PROPOSAL WORKFLOW**

### **Steps:**
1. In admin dashboard, click "Documents"
2. Click "Proposals" tab (first tab)
3. See list of proposal requests
4. Click "Edit Details" on a proposal
5. Fill in:
   - Estimated Budget: 50000
   - Duration: "6-8 weeks"
   - Scope of Work: "Detailed project description"
   - Deliverables: Add at least 2 items
   - Terms: Keep default or customize
6. Save
7. Click "Generate PDF"
8. Click "Sign Proposal"
9. Draw signature in pad (or type/upload)
10. Click Save
11. Click "Send to Client"

### **Expected Result:**
- ✅ Edit modal opens
- ✅ Details save successfully
- ✅ PDF generates
- ✅ Signature pad works (no "p is not a function" error)
- ✅ Signature saves
- ✅ Email sent to client
- ✅ Status changes through workflow
- ✅ Can download PDF
- ✅ No 500 errors

---

## ✅ **TEST 7: ADMIN - TASK MANAGEMENT**

### **Steps:**
1. Go to Boards section
2. Open a project board
3. Click "Create Task" (if button available)
4. Fill in task details
5. Assign to user
6. Save

### **Expected Result:**
- ✅ Task created
- ✅ Appears in board
- ✅ User can see in their "My Tasks" tab
- ✅ Email sent to assignee

---

## ✅ **TEST 8: USER - VIEW TASKS**

### **Steps:**
1. Login as regular user
2. Go to "Tasks" tab in dashboard
3. View assigned tasks

### **Expected Result:**
- ✅ Tasks page loads
- ✅ See statistics (total, in progress, completed, overdue)
- ✅ See task cards
- ✅ Can click on task
- ✅ Task detail modal opens
- ✅ Can update status
- ✅ Can log time
- ✅ Can add comments

---

## ✅ **TEST 9: USER - SIGN PROPOSAL**

### **Steps:**
1. Login as user who received proposal
2. Go to "Proposals" tab
3. See proposal with status "Sent to Client"
4. Click "Sign Proposal"
5. Draw signature
6. Submit

### **Expected Result:**
- ✅ Signature pad works
- ✅ Signature saves
- ✅ Proposal marked as signed
- ✅ Admin receives notification
- ✅ Board status updates to "In Progress"

---

## ✅ **TEST 10: GENERAL FUNCTIONALITY**

### **Homepage:**
- ✅ Loads without errors
- ✅ All images load
- ✅ Navigation works
- ✅ Contact info visible (+27 65 903 1894)
- ✅ Email visible (support@maindodigital.com)

### **Services Page:**
- ✅ Lists all services
- ✅ Service details pages load
- ✅ CTA buttons work

### **Blog:**
- ✅ Blog list loads
- ✅ Individual posts load
- ✅ Images display

### **Contact:**
- ✅ Contact form loads
- ✅ Form can be submitted
- ✅ Contact info correct

---

## 📊 **EXPECTED RESULTS**

### **All Tests Passing:**
- ✅ No 500 errors
- ✅ No console errors
- ✅ No "undefined" errors
- ✅ All forms work
- ✅ All workflows complete
- ✅ Emails send (or log if console backend)
- ✅ Database updates correctly

### **Success Criteria:**
- At least 90% of tests pass
- Critical features (appointment, proposal) work
- No blocking errors
- User experience smooth

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue: 500 Error on Appointment**
**Fix:** Run migrations on production
```bash
cd ~/digital_agency
git pull origin main
python manage.py migrate
```

### **Issue: Signature Pad Error**
**Fix:** Clear browser cache, reload page

### **Issue: Email Not Sending**
**Check:** Console backend in settings (emails print to log)
**Or:** Configure SMTP for real email sending

### **Issue: Tasks Not Showing**
**Fix:** Ensure user has tasks assigned in admin

### **Issue: Proposals Not Loading**
**Fix:** Ensure migrations ran (services app)

---

## 📝 **TEST RECORD**

**Date:** _______________  
**Tester:** _______________  
**Environment:** Production

| Test # | Feature | Status | Notes |
|--------|---------|--------|-------|
| 1 | Appointment Booking | [ ] | |
| 2 | User Login | [ ] | |
| 3 | Proposal Request | [ ] | |
| 4 | Admin Login | [ ] | |
| 5 | Admin Appointments | [ ] | |
| 6 | Proposal Workflow | [ ] | |
| 7 | Task Management | [ ] | |
| 8 | User Tasks | [ ] | |
| 9 | Sign Proposal | [ ] | |
| 10 | General Pages | [ ] | |

**Overall Status:** [ ] PASS  [ ] FAIL

**Notes:**
____________________________________________________________
____________________________________________________________
____________________________________________________________

---

## 🎯 **FINAL CHECKLIST**

Before declaring success:
- [ ] Appointment booking works
- [ ] User can login with generated credentials
- [ ] Admin can view appointments
- [ ] Admin can manage proposals
- [ ] Signature pad captures signatures
- [ ] Proposals can be sent to clients
- [ ] Users can see and action tasks
- [ ] No critical console errors
- [ ] Contact information correct
- [ ] All pages load

---

## 🎉 **SUCCESS**

If all tests pass:
✅ Your digital agency platform is production-ready!
✅ All features working
✅ Ready for real clients

**Deploy with confidence!** 🚀

