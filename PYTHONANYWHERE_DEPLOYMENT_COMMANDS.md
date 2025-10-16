# 🚀 PythonAnywhere Deployment - Execute These Commands

## Current Status: Code pulled, now complete deployment

---

## ✅ Step-by-Step Commands

### You're already in: `~/digital_agency (main)`

Run these commands in order:

---

### 1. Activate Virtual Environment
```bash
source myenv/bin/activate
```

**Expected:** `(myenv)` should appear in prompt

---

### 2. Install/Update Dependencies
```bash
pip install -r requirements.txt
```

**This installs:**
- All required packages
- New dependencies if any
- Updates existing packages

**Wait for:** Installation to complete (~2-5 minutes)

---

### 3. Run Database Migrations
```bash
python manage.py migrate
```

**Expected output:**
```
Running migrations:
  Applying [app].[migration]... OK
  ...
```

**If "No migrations to apply":** That's fine, database is up to date

---

### 4. Create Test Users (Optional but Recommended)
```bash
python manage.py create_test_users
```

**This creates:**
- admin_test / Admin@Test2025
- developer_test / Dev@Test2025
- normal_user / User@Test2025
- client_user / Client@Test2025

**Expected:** User creation confirmation messages

---

### 5. Collect Static Files
```bash
python manage.py collectstatic --no-input
```

**Expected:**
```
X static files copied to '/path/to/static'
```

---

### 6. Check for Errors
```bash
python manage.py check
```

**Should show:**
```
System check identified no issues (0 silenced).
```

**If errors shown:** Share them and I'll help fix

---

### 7. Test Server Locally (Optional)
```bash
python manage.py runserver
```

**Press Ctrl+C to stop**

**This verifies server starts without errors**

---

### 8. RELOAD WEB APP (CRITICAL!)

**In PythonAnywhere Web Interface:**
1. Click "Web" tab at top
2. Find your web app: `maindoagency.pythonanywhere.com`
3. Scroll to top
4. Click green **"Reload maindoagency.pythonanywhere.com"** button
5. Wait for confirmation message

**This activates all your changes!**

---

### 9. Verify Deployment

**Run test from your local computer:**
```powershell
cd H:\GitHub\digital_agency_front_end
.\test_production.ps1
```

**Should now show:**
```
✅ All frontend tests: PASSED
✅ All backend tests: PASSED
✅ Success rate: 100%
```

---

## 🔍 Troubleshooting

### If You See Errors:

#### **Check Error Logs:**
```
PythonAnywhere Web tab → Log files section

Click:
1. Error log - Shows Python errors
2. Server log - Shows requests
```

#### **Common Issues:**

**Issue 1: Import Errors**
```bash
# Solution: Reinstall requirements
pip install -r requirements.txt --upgrade
```

**Issue 2: Database Errors**
```bash
# Solution: Check migrations
python manage.py showmigrations
python manage.py migrate --run-syncdb
```

**Issue 3: Static Files**
```bash
# Solution: Recollect
python manage.py collectstatic --clear --no-input
```

**Issue 4: WSGI Configuration**
```
Check WSGI file in Web tab
Ensure it points to correct settings module
```

---

## ✅ Expected Results

### After Successful Deployment:

**All These Should Work:**
```
✅ https://maindoagency.pythonanywhere.com/admin/
✅ https://maindoagency.pythonanywhere.com/careers/careers/
✅ https://maindoagency.pythonanywhere.com/information/services/
✅ https://maindoagency.pythonanywhere.com/posts/blogs/
✅ https://maindoagency.pythonanywhere.com/projects/
✅ https://maindoagency.pythonanywhere.com/task/boards/
✅ https://maindoagency.pythonanywhere.com/accounts/auto-create-user/
✅ And all other endpoints!
```

**Frontend Integration:**
```
✅ www.maindodigital.com/services → Select plan → Submit
✅ Account created automatically
✅ Board created
✅ Emails sent
✅ Everything works!
```

---

## 🎯 Quick Command Summary

**Copy-paste this entire block:**

```bash
# Activate environment
source myenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create test users
python manage.py create_test_users

# Collect static files
python manage.py collectstatic --no-input

# Check for errors
python manage.py check

# Done! Now reload web app in Web tab
echo "✅ Commands complete! Now:"
echo "1. Go to Web tab"
echo "2. Click Reload button"
echo "3. Test your site!"
```

---

## 📊 Post-Deployment Checklist

After reload, verify:

- [ ] Django admin accessible
- [ ] API endpoints return data (not 500)
- [ ] Frontend loads data from backend
- [ ] Can submit service request
- [ ] Account creation works
- [ ] Email notifications send
- [ ] Board creation works
- [ ] Login with test users works
- [ ] Dashboards show real data

---

## 🎉 Once Deployed

**Test the complete flow:**

1. **Visit:** https://www.maindodigital.com/services
2. **Select:** Any plan
3. **Fill form** with real email
4. **Submit**
5. **Check:** Email received
6. **Login** with credentials
7. **Explore** user dashboard
8. **As Admin:** Check boards tab for auto-created board

**Everything should work perfectly!**

---

## 📞 If You Need Help

**Share:**
1. Error log contents (from Web tab)
2. Output of `python manage.py check`
3. Any error messages you see

**I'll help you fix it!**

---

**You're almost there! Just run the commands above and reload the web app!** 🚀

