# 🧪 Complete Production Testing Script

## 🎯 **Test Plan: Real User Simulation**

---

## 📋 **PRE-TEST CHECKLIST**

```
Environment: Production (maindodigital.com)
Test Date: October 2025
Tester: Manual User Testing
Browser: Chrome, Firefox, Safari, Mobile

✅ Backend API running: https://maindoagency.pythonanywhere.com
✅ Frontend deployed: https://www.maindodigital.com
✅ Contact info updated
✅ All features built
```

---

## 👥 **USER PERSONAS TO TEST**

### **1. New Visitor (Anonymous)**
- First time on site
- Looking for services
- Wants to learn about company

### **2. Potential Client**
- Interested in a project
- Wants to request a quote
- May book consultation

### **3. Existing Client (Logged In)**
- Has account
- Checking project status
- Viewing invoices

### **4. Admin User**
- Managing projects
- Creating invoices
- Reviewing requests

---

## 🧪 **TEST SCENARIOS**

---

## **SCENARIO 1: New Visitor Journey** 🆕

### **Step 1: Homepage Visit**

```bash
URL: https://www.maindodigital.com/

✅ Check:
□ Page loads in < 3 seconds
□ Hero banner displays
□ Trust signals visible
□ Partner logos appear (from API)
□ CTA buttons work
□ Contact info visible (+27 65 903 1894)
□ Email visible (support@maindodigital.com)
□ Navigation menu works
□ Mobile menu responsive
□ Footer displays
```

**Action Items:**
1. Click "Get Free Consultation" button
2. Hover over service cards
3. Scroll to trust signals section
4. Check partner logos load (grayscale → color on hover)
5. Test mobile view (resize browser)

---

### **Step 2: Services Exploration**

```bash
URL: /services

✅ Check:
□ All services listed
□ Service cards clickable
□ Images load properly
□ Descriptions readable
□ CTAs visible
□ Back navigation works
```

**Action Items:**
1. Click on "Web Development" service
2. Read service details
3. Check pricing information
4. Click "Get Started" button
5. Return to services page

---

### **Step 3: About Us Page**

```bash
URL: /about-us

✅ Check:
□ Company info loads
□ Team members display
□ Partner logos show (same as homepage)
□ Timeline/milestones visible
□ Testimonials carousel works
□ LinkedIn links work
□ Contact info correct
```

**Action Items:**
1. Read company story
2. View team member profiles
3. Click LinkedIn icons
4. Scroll through testimonials
5. Verify partner logos match homepage

---

### **Step 4: Contact/Appointment**

```bash
URL: /appointment or /contact

✅ Check:
□ Contact form displays
□ All fields editable
□ Date/time picker works
□ Email validation
□ Phone validation
□ Submit button enabled
□ Success message shows
```

**Action Items:**
1. Fill out contact form
2. Select appointment date/time
3. Enter test data:
   - Name: Test User
   - Email: test@example.com
   - Phone: +27 65 903 1894
   - Message: "Testing appointment booking"
4. Submit form
5. Verify confirmation message

---

## **SCENARIO 2: Client Registration** 📝

### **Step 1: Sign Up**

```bash
URL: /SignupScreen

✅ Check:
□ Registration form displays
□ All fields required
□ Password strength indicator
□ Email validation
□ Username availability check
□ Terms checkbox
□ Submit button works
```

**Test Data:**
```
Username: testclient2025
Email: testclient2025@example.com
Password: SecurePass123!
First Name: Test
Last Name: Client
```

**Action Items:**
1. Enter registration details
2. Check password requirements
3. Accept terms
4. Submit form
5. Verify email sent (check console in dev)
6. Check success redirect

---

### **Step 2: Login**

```bash
URL: /LoginScreenUser

✅ Check:
□ Login form displays
□ Email field validation
□ Password field masked
□ "Remember me" option
□ "Forgot password" link
□ Submit button works
□ Error messages clear
```

**Test Data:**
```
Email: testclient2025@example.com
Password: SecurePass123!
```

**Action Items:**
1. Enter credentials
2. Click login
3. Verify redirect to dashboard
4. Check authentication token
5. Test "Forgot password" link

---

## **SCENARIO 3: Client Dashboard Journey** 👤

### **Step 1: Dashboard Overview**

```bash
URL: /userDashboard

✅ Check:
□ Dashboard loads
□ User info displays
□ Projects section visible
□ Tasks section visible
□ Appointments section visible
□ Proposals section visible
□ Invoices section visible
□ All data loads from API
```

**Action Items:**
1. View project cards
2. Check project progress bars
3. Verify status badges
4. Look for "Request Project" button
5. Check statistics/metrics

---

### **Step 2: Request New Project** 🚀

```bash
Location: User Dashboard → "Request Project" button

✅ Check:
□ Modal opens
□ All fields editable
□ Service dropdown populated
□ Date picker works
□ Budget field accepts numbers
□ Priority selection works
□ Submit button enabled
```

**Test Data:**
```
Project Name: E-Commerce Website
Service: Web Development (from dropdown)
Description: Need a professional online store
Budget: 50000
Deadline: 2025-12-31
Priority: High
```

**Action Items:**
1. Click "Request Project"
2. Fill all fields
3. Select service from dropdown
4. Test "Other" option → should suggest booking appointment
5. Submit request
6. Verify success message
7. Check email notification (console in dev)
8. Verify board created for admin

---

### **Step 3: View Project Details**

```bash
Location: User Dashboard → Project Card

✅ Check:
□ Project details load
□ Progress calculation correct:
   - 100% for "Concluded"
   - Calculated for "In Progress"
   - 10% for "Started"
□ Tasks listed
□ Timeline visible
□ Budget displayed
□ Team members shown
□ Status badge correct
```

**Action Items:**
1. Click on a project
2. Scroll through details
3. Check progress bar accuracy
4. Verify budget information
5. View assigned team members

---

### **Step 4: View Live Link** 🔗

```bash
Location: Concluded Project → "View Live Site" button

✅ Check:
□ Button only shows for concluded projects
□ Link opens in new tab
□ URL is valid
□ Site loads
```

**Action Items:**
1. Find concluded project
2. Click "View Live Site"
3. Verify external link opens
4. Check site loads properly

---

### **Step 5: View & Download Invoice** 💰

```bash
Location: User Dashboard → Invoices Tab

✅ Check:
□ Invoices list displays
□ Invoice details correct:
   - Invoice number
   - Project name
   - Amount
   - Tax
   - Total
   - Status (Paid/Unpaid)
   - Due date
□ Download button visible
□ PDF generates
```

**Action Items:**
1. Navigate to Invoices tab
2. View invoice details
3. Click "Download Invoice PDF"
4. Verify PDF downloads
5. Open PDF, check:
   - Logo present
   - Contact info correct
   - Line items listed
   - Calculations accurate
   - Professional format

---

## **SCENARIO 4: Admin Workflow** 👨‍💼

### **Step 1: Admin Login**

```bash
URL: /LoginScreenUser

Test Data:
Email: admin@maindodigital.com
Password: [admin password]
```

**Action Items:**
1. Login as admin
2. Verify redirect to /admin
3. Check admin permissions

---

### **Step 2: View Project Requests**

```bash
URL: /admin

✅ Check:
□ All boards/projects display
□ New request visible
□ Client info shown
□ Request details correct
□ Quick status update works
```

**Action Items:**
1. Find newly created project request
2. View client details
3. Check project description
4. Verify all data from user request

---

### **Step 3: Manage Board/Project**

```bash
Location: Admin Dashboard → Boards

✅ Check:
□ Edit board button works
□ Can update status:
   - Started
   - In Progress
   - Review
   - Concluded
□ Can assign team members
□ Can set budget
□ Can add deadline
□ Can add client link
```

**Test Actions:**
1. Click edit on project
2. Change status to "In Progress"
3. Assign team members
4. Set budget: R50,000
5. Add development link
6. Save changes
7. Verify updates reflected

---

### **Step 4: Create Invoice** 💼

```bash
URL: /admin/invoices

✅ Check:
□ Invoice dashboard loads
□ Statistics cards display:
   - Total revenue
   - Paid amount
   - Pending amount
   - Overdue count
□ "Create Invoice" button works
□ Modal opens
```

**Action Items:**
1. Click "Create Invoice"
2. Select project from dropdown
3. Client auto-fills
4. Add line items:
   ```
   Description: Website Design
   Quantity: 1
   Rate: 20000
   
   Description: Development
   Quantity: 1
   Rate: 30000
   ```
5. Set tax: 15%
6. Set due date: +30 days
7. Set status: Sent
8. Review calculated total
9. Click "Create Invoice"

---

### **Step 5: Manage Invoice**

```bash
Location: Admin Invoices → Invoice List

✅ Check:
□ New invoice appears
□ All details correct
□ Action buttons work:
   - Download PDF
   - Send Email
   - Mark as Paid
   - Edit
   - Delete
```

**Action Items:**
1. Locate created invoice
2. Click "Download PDF"
   - Verify PDF generates
   - Check professional format
   - Verify calculations
3. Click "Send Invoice"
   - Check email sent (console)
   - Verify recipient correct
4. Click "Mark as Paid"
   - Enter payment method
   - Enter reference
   - Verify status updates
5. Test search function
6. Test filter by status

---

## **SCENARIO 5: Mobile User Experience** 📱

### **Test on Mobile Device or Responsive Mode**

```bash
Devices to Test:
- iPhone 12/13/14 (iOS Safari)
- Samsung Galaxy (Android Chrome)
- iPad (Safari)
```

**Homepage:**
```
✅ Check:
□ Mobile menu hamburger works
□ Touch targets large enough (44x44px)
□ Text readable without zoom
□ Images scale properly
□ CTAs thumb-friendly
□ Forms easy to fill
□ Navigation smooth
```

**Dashboard:**
```
✅ Check:
□ Cards stack vertically
□ Tabs work on touch
□ Modals full-screen
□ Forms keyboard-friendly
□ Scrolling smooth
□ No horizontal scroll
```

**Actions:**
1. Test with Chrome DevTools (F12 → Device Toolbar)
2. Try all breakpoints:
   - 320px (Small phone)
   - 375px (iPhone)
   - 768px (Tablet)
   - 1024px (Desktop)
3. Test portrait & landscape

---

## **SCENARIO 6: SEO & Social Sharing** 🔍

### **Test 1: View Page Source**

```bash
Action: Right-click → View Page Source

✅ Check:
□ Title tag present
□ Meta description present
□ Keywords meta tag
□ Open Graph tags:
   - og:title
   - og:description
   - og:image
   - og:url
□ Twitter Card tags
□ Canonical URL
□ Structured data (JSON-LD):
   - Organization
   - LocalBusiness
   - Service
   - FAQ
   - Website
   - Offers
   - Rating
```

---

### **Test 2: Social Media Sharing**

**Facebook:**
```bash
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter: https://www.maindodigital.com
3. Click "Scrape Again"

✅ Check:
□ OG image displays
□ Title correct
□ Description appealing
□ No errors shown
```

**Twitter:**
```bash
1. Go to: https://cards-dev.twitter.com/validator
2. Enter: https://www.maindodigital.com

✅ Check:
□ Twitter Card displays
□ Image shows
□ Text readable
□ Card type: summary_large_image
```

**LinkedIn:**
```bash
1. Go to: https://www.linkedin.com/post-inspector/
2. Enter: https://www.maindodigital.com

✅ Check:
□ Preview displays
□ Image correct
□ Professional appearance
```

---

### **Test 3: Google Search**

```bash
Search: "site:maindodigital.com"

✅ Check:
□ Pages indexed
□ Titles descriptive
□ Descriptions compelling
□ Rich snippets:
   - Star ratings
   - Contact info
   - Service listings
```

---

## **SCENARIO 7: Performance Testing** ⚡

### **Test 1: Google Lighthouse**

```bash
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
   - PWA
4. Run on Desktop
5. Run on Mobile

Target Scores:
□ Performance: 90+ ✅
□ Accessibility: 95+ ✅
□ Best Practices: 95+ ✅
□ SEO: 100 ✅
□ PWA: 90+ ✅
```

---

### **Test 2: Page Load Speed**

```bash
Test Pages:
- Homepage
- Services
- About Us
- Dashboard
- Admin Panel

✅ Check:
□ First Contentful Paint < 1.8s
□ Largest Contentful Paint < 2.5s
□ Time to Interactive < 3.8s
□ Cumulative Layout Shift < 0.1
□ First Input Delay < 100ms
```

---

### **Test 3: Network Performance**

```bash
1. Open DevTools → Network tab
2. Reload page
3. Check:
   □ Total size < 3MB
   □ Requests < 50
   □ Images optimized (WebP/AVIF)
   □ JS bundles split
   □ CSS optimized
   □ No 404 errors
   □ No console errors
```

---

## **SCENARIO 8: Error Handling** ⚠️

### **Test Invalid Inputs**

**Registration:**
```
✅ Test:
□ Invalid email format
□ Weak password
□ Duplicate username
□ Missing required fields
□ Error messages clear
```

**Login:**
```
✅ Test:
□ Wrong password
□ Non-existent email
□ Empty fields
□ Error messages helpful
```

**Forms:**
```
✅ Test:
□ Invalid date ranges
□ Negative numbers in budget
□ SQL injection attempts
□ XSS attempts
□ Error boundaries catch errors
```

---

### **Test Network Errors**

```bash
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Test:
   □ Loading states show
   □ Skeleton screens display
   □ Error messages on timeout
   □ Retry mechanisms work
```

---

## **SCENARIO 9: Security Testing** 🔐

### **Authentication:**

```
✅ Test:
□ Can't access dashboard without login
□ Can't access admin without admin role
□ Token expires after logout
□ Session persists on refresh
□ Secure cookies (HttpOnly, Secure)
```

### **Authorization:**

```
✅ Test:
□ Users can't edit others' projects
□ Clients can't access admin panel
□ API endpoints protected
□ CSRF protection active
□ XSS protection active
```

### **Headers:**

```
Check in Network tab:
□ Strict-Transport-Security
□ X-Content-Type-Options: nosniff
□ X-Frame-Options: SAMEORIGIN
□ X-XSS-Protection: 1; mode=block
□ Referrer-Policy
□ Permissions-Policy
```

---

## **SCENARIO 10: Data Integrity** 📊

### **Test Data Flow:**

```
User Actions → Backend → Database → API → Frontend Display

✅ Verify:
□ Project request creates board
□ Board updates reflect in user dashboard
□ Invoice creation sends email
□ Status changes sync across users
□ Real-time updates work
```

### **Test CRUD Operations:**

```
Create:
□ Project request
□ Invoice
□ Appointment

Read:
□ Dashboard data
□ Project details
□ Invoice list

Update:
□ Board status
□ Invoice payment
□ User profile

Delete:
□ (Admin only) Invoice
□ (Admin only) Project
```

---

## **SCENARIO 11: Email Testing** 📧

### **Emails to Test:**

```
✅ Check Console Output (Dev Mode):

1. New Project Request:
   - To: Admin emails
   - Subject: Clear
   - Body: All details included
   - Links work

2. Project Request Confirmation:
   - To: Client email
   - Subject: Professional
   - Body: Next steps clear
   
3. Invoice Sent:
   - To: Client email
   - Attachment: PDF included
   - Body: Payment instructions
   
4. Payment Received:
   - To: Client email
   - Body: Thank you message
   - Details: Amount, date, reference
```

---

## **SCENARIO 12: Browser Compatibility** 🌐

### **Test Browsers:**

```
Desktop:
□ Chrome (latest)
□ Firefox (latest)
□ Safari (latest)
□ Edge (latest)

Mobile:
□ iOS Safari
□ Android Chrome
□ Samsung Internet
```

### **Features to Test:**

```
✅ Check in Each Browser:
□ Layout consistent
□ Animations smooth
□ Forms functional
□ API calls work
□ Images load
□ Icons display
□ Colors correct
□ Fonts load
```

---

## 📝 **TEST RESULTS TEMPLATE**

```markdown
## Test Execution Report

Date: [DATE]
Tester: [NAME]
Environment: Production

### Summary
- Total Tests: [NUMBER]
- Passed: [NUMBER] ✅
- Failed: [NUMBER] ❌
- Skipped: [NUMBER] ⏭️

### Critical Issues:
1. [Issue description]
   - Severity: High/Medium/Low
   - Steps to reproduce:
   - Expected result:
   - Actual result:
   - Screenshot:

### Pass Rate: [PERCENTAGE]%

### Recommendations:
1. [Recommendation]
2. [Recommendation]

### Next Steps:
- [ ] Fix critical issues
- [ ] Retest failed scenarios
- [ ] Deploy fixes
- [ ] Verify in production
```

---

## 🎯 **QUICK TEST CHECKLIST**

### **Essential 15-Minute Test:**

```
□ Homepage loads
□ Navigation works
□ Login successful
□ Dashboard displays data
□ Request project works
□ Invoice displays
□ Admin can create invoice
□ Mobile view responsive
□ No console errors
□ SEO tags present
□ Performance acceptable
□ Contact info correct
□ Partner logos display
□ Forms submit
□ Emails send (check console)
```

---

## 🚀 **READY TO TEST!**

**Start with Scenario 1 and work through each scenario systematically.**

**Document all findings in a test report.**

**Priority: Critical issues first!**

---

**Good luck with testing!** 🎉

