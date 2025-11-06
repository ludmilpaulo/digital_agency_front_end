# Quick Test Guide - Login Error Messages

## 🧪 How to Test the Improved Login Errors

### Prerequisites
- ✅ Both servers running (backend on 8000, frontend on 3000)
- ✅ Browser open to http://localhost:3000

---

## Test Scenarios

### 1️⃣ Test: User Doesn't Exist

**Steps:**
1. Go to login page: http://localhost:3000/LoginScreenUser
2. Enter:
   - Email/Username: `nonexistent@test.com`
   - Password: `anything123`
3. Click "Login"

**Expected Result:**
- ❌ Red toast: "No account found with email: nonexistent@test.com"
- 💡 Blue toast with lightbulb (1 sec later): "Please check your credentials or sign up for a new account."
- Error text appears below form
- Status in console: 404

---

### 2️⃣ Test: Wrong Password

**Steps:**
1. First, create a test user in Django admin:
   - Go to http://localhost:8000/admin/
   - Create user: `testuser@test.com` / password: `correctpass123`
2. Go to login page
3. Enter:
   - Email: `testuser@test.com`
   - Password: `wrongpassword`
4. Click "Login"

**Expected Result:**
- ❌ Red toast: "Incorrect password. Please try again."
- 💡 Blue toast with lightbulb (1 sec later): "Forgot your password? You can reset it."
- Error text appears below form
- Status in console: 401

---

### 3️⃣ Test: Deactivated Account

**Steps:**
1. In Django admin, deactivate the test user:
   - Go to http://localhost:8000/admin/accounts/user/
   - Find testuser, edit, uncheck "Active"
   - Save
2. Try to login with correct credentials:
   - Email: `testuser@test.com`
   - Password: `correctpass123`
3. Click "Login"

**Expected Result:**
- ❌ Red toast: "This account has been deactivated. Please contact support."
- Status in console: 403
- No suggestion toast (this is critical error)

---

### 4️⃣ Test: Successful Login

**Steps:**
1. Re-activate the test user in Django admin
2. Go to login page
3. Enter correct credentials:
   - Email: `testuser@test.com`
   - Password: `correctpass123`
4. Click "Login"

**Expected Result:**
- ✅ Green toast: "Welcome back, testuser!"
- Redirect to appropriate dashboard
- User data stored in Redux & localStorage
- Status in console: 200

---

### 5️⃣ Test: Empty Fields

**Steps:**
1. Go to login page
2. Leave fields empty
3. Click "Login"

**Expected Result:**
- ❌ Red toast: "Both username/email and password are required."
- Status in console: 400

---

## 🔍 What to Check

### In Browser Console (F12):
```javascript
// Look for these logs:
"------ Login attempt ------"
"Parsed login_id: 'email@test.com', password present: true"
"Login response status: 401 OK: false"
"Login error: { message: '...', field: 'password', suggestion: '...', status: 401 }"
```

### In Django Terminal:
```
------ Login attempt ------
Raw request data: {'username': 'test@test.com', 'password': '****'}
Trying to find user by email...
User found: test@test.com
authenticate() result: None
Login failed: Wrong password.
[06/Nov/2025 10:15:23] "POST /account/custom-login/ HTTP/1.1" 401 128
```

---

## ✅ Success Criteria

All tests should show:
- ✅ Specific error messages (not generic "Invalid credentials")
- ✅ Helpful suggestions where applicable
- ✅ Correct HTTP status codes (404, 401, 403, 200)
- ✅ Toast notifications with proper styling
- ✅ Console logs showing detailed error info

---

## 🐛 Troubleshooting

**If errors don't show:**
1. Check browser console for any JavaScript errors
2. Verify both servers are running
3. Clear browser cache (Ctrl+Shift+Del)
4. Hard refresh (Ctrl+F5)

**If backend changes don't apply:**
1. Restart Django server:
   ```bash
   cd H:\GitHub\digital_agency
   python manage.py runserver 8000
   ```

**If frontend changes don't apply:**
1. Restart Next.js server:
   ```bash
   cd H:\GitHub\digital_agency_front_end
   npm run dev
   ```

---

## 📸 Screenshots Expected

### Wrong Password:
![Error Toast]
- Red toast: "Incorrect password. Please try again."
- Blue toast: "Forgot your password? You can reset it."

### User Not Found:
![Error Toast]
- Red toast: "No account found with email: test@test.com"
- Blue toast: "Please check your credentials or sign up for a new account."

---

**Ready to test!** 🚀

If all tests pass, the login error handling is working perfectly!

