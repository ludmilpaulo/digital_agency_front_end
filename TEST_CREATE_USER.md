# Quick Test: Create User Feature

## 🚀 Test the New Professional User Creation

### Prerequisites:
- ✅ Backend running on port 8000
- ✅ Frontend running on port 3000
- ✅ Logged in as admin

---

## 📝 Test Steps

### 1. Navigate to Members
```
http://localhost:3000/admin → Members tab
```

### 2. Click "Create New User"
Look for the blue button with + icon at the top right

### 3. Fill in the Form

**Personal Information:**
```
First Name: Test
Last Name: User
Email: test.user@maindodigital.com
Username: testuser
Phone: +27 65 903 1234
```

**Professional Information:**
```
Job Title: Software Engineer
Department: Engineering (select from dropdown)
Role: Developer (select from dropdown)
```

**Password:**
```
☑ Auto-generate secure password (leave checked)
```

### 4. Review Welcome Email Info
Should show:
```
💌 Welcome Email
Email will be sent to: test.user@maindodigital.com
✓ Login credentials
✓ Direct link to login page
✓ Getting started guide
✓ Team welcome message
```

### 5. Click "Create User & Send Welcome Email"

---

## ✅ Expected Results

### Immediate Feedback:
1. **Loading State**
   - Button shows spinner
   - Text changes to "Creating User..."

2. **Success Toasts** (in order):
   - ✅ Green toast: "User created successfully! Welcome email sent to test.user@maindodigital.com"
   - 👋 Purple toast (1 sec later): "Test has been added to the team! 🎉"

3. **Modal Closes**
   - Automatically after success

4. **User List Refreshes**
   - New user appears in the list

---

## 👁️ What to Look For

### In the Members List:
```
┌──────────────────────────────────────┐
│ [T]  Test User                       │ ← Avatar with "T"
│      test.user@maindodigital.com •   │
│      Software Engineer • Engineering  │ ← Job title + Dept
└──────────────────────────────────────┘
```

**Check:**
- ✅ Avatar circle shows first initial "T"
- ✅ Full name displayed: "Test User"
- ✅ Email visible
- ✅ Job title shown in blue: "Software Engineer"
- ✅ Department shown: "Engineering"
- ✅ Gradient background
- ✅ Professional styling

---

## 📧 Check Welcome Email

### Email Inbox:
**Check:** test.user@maindodigital.com

**Subject:**
```
Welcome to Maindo Digital Agency! 🎉
```

**Content Should Include:**

1. **Header** (purple/blue gradient):
   - 👋 emoji
   - "Welcome to Maindo Digital Agency!"

2. **Greeting**:
   - "Hello Test User! 🎉"

3. **Credentials Box**:
   ```
   🔐 Your Login Credentials
   
   Email: test.user@maindodigital.com
   Username: testuser
   Temporary Password: [random_password]
   ```

4. **Professional Info**:
   - Your Role: Developer
   - Department: Engineering

5. **Login Button**:
   - Blue button linking to login page

6. **Getting Started**:
   - Complete your profile
   - Explore the dashboard
   - Check assigned projects
   - Connect with team

7. **Footer**:
   - Maindo Digital Agency
   - support@maindodigital.com
   - Website URL

---

## 🧪 Test Login

### Use Credentials from Email:

1. Click "Login to Your Account" button in email
2. Or go to: http://localhost:3000/LoginScreenUser
3. Enter:
   - Email: test.user@maindodigital.com
   - Password: [from email]
4. Click Login

**Expected:**
- ✅ Login successful
- ✅ Welcome toast
- ✅ Redirect to dashboard
- ✅ User can access features

---

## 🔧 Error Scenarios to Test

### Test 1: Duplicate Email
**Try creating user with existing email**

Expected:
```
❌ "User with email test.user@maindodigital.com already exists"
```

### Test 2: Duplicate Username
**Try creating user with existing username**

Expected:
```
❌ "Username testuser is already taken"
```

### Test 3: Invalid Email
**Try email without @ or domain**

Expected:
```
❌ "Please enter a valid email address"
```

### Test 4: Missing Required Fields
**Leave email or username empty**

Expected:
```
❌ "Email and username are required"
```

---

## 📊 Checklist

Before submitting form:
- [ ] All required fields filled (marked with *)
- [ ] Email format is valid
- [ ] Username is unique
- [ ] Job title is descriptive
- [ ] Department selected
- [ ] Role selected

After submission:
- [ ] Success toasts appear
- [ ] Modal closes
- [ ] User appears in list
- [ ] User card shows all info
- [ ] Email received
- [ ] Email contains credentials
- [ ] Can login with credentials

---

## 🎯 Success Criteria

✅ **User created** in database  
✅ **Profile created** with job title and department  
✅ **Email sent** successfully  
✅ **User visible** in Members list  
✅ **Professional display** with avatar, title, department  
✅ **Can login** with emailed credentials  

---

## 🐛 Troubleshooting

**If email not received:**
- Check spam folder
- Verify email settings in Django settings.py
- Check backend console for email errors
- Try console email backend for testing

**If user doesn't appear:**
- Click refresh icon (if available)
- Reload page
- Check browser console for errors

**If validation fails:**
- Read error message carefully
- Check all required fields
- Verify email format
- Try different username

---

## 💡 Tips

1. **Use company email domain** for professional look
2. **Descriptive job titles** help with organization
3. **Select correct department** for proper categorization
4. **Let password auto-generate** for security
5. **Check email immediately** to verify credentials

---

## 📞 Support

If you encounter issues:
- Check browser console (F12)
- Check Django terminal for errors
- Verify both servers are running
- Check email configuration in settings.py

---

**Quick Test:** ⏱️ 2-3 minutes  
**Expected Success Rate:** 100%  

Ready to create professional user accounts with automated onboarding! 🚀

