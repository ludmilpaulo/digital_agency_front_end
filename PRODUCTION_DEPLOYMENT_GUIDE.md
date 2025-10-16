# 🚀 Production Deployment Guide - PythonAnywhere

## ⚠️ CRITICAL: Backend Deployment Needed

**Current Status:**
- ✅ Frontend: 100% Working (all pages load)
- ❌ Backend: 500 Internal Server Error (needs deployment)

---

## 🔍 Test Results Summary

### Frontend (Vercel/maindodigital.com):
```
✅ Homepage                - 200 OK
✅ Services Page           - 200 OK
✅ Blog Page               - 200 OK
✅ Projects Page           - 200 OK
✅ About Us Page           - 200 OK
✅ Contact Page            - 200 OK
✅ Careers Page            - 200 OK
✅ Login Page              - 200 OK
✅ Admin Dashboard         - 200 OK
✅ User Dashboard          - 200 OK
✅ Developer Dashboard     - 200 OK

Result: 11/11 PASSED (100%)
```

### Backend (PythonAnywhere):
```
❌ All API endpoints      - 500 Internal Server Error

This indicates:
1. Backend server is running
2. But encountering errors when processing requests
3. Likely causes:
   - Database connection issue
   - Missing dependencies
   - Code errors
   - Configuration mismatch
```

---

## 🔧 SOLUTION: Deploy Latest Code to Production

### Step-by-Step Deployment:

#### **1. Access PythonAnywhere**
```
Website: https://www.pythonanywhere.com
Login with your credentials
```

#### **2. Open Bash Console**
```
Dashboards → Consoles → Bash
Or click "New console: Bash"
```

#### **3. Navigate to Project**
```bash
cd ~/digital_agency
```

#### **4. Pull Latest Code**
```bash
git pull origin main
```

**Expected output:**
```
Updating files...
[List of changed files]
```

#### **5. Activate Virtual Environment**
```bash
source myenv/bin/activate
```

**You should see:** `(myenv)` prefix in terminal

#### **6. Install/Update Dependencies**
```bash
pip install -r requirements.txt
```

**This installs:**
- Django
- djangorestframework
- django-cors-headers
- Pillow
- djoser
- And all other required packages

#### **7. Run Database Migrations**
```bash
python manage.py migrate
```

**Expected output:**
```
Running migrations:
  Applying accounts.0001_initial... OK
  Applying [app].0001_initial... OK
  ...
```

#### **8. Create Test Users (Optional)**
```bash
python manage.py create_test_users
```

**This creates:**
- admin_test
- developer_test
- normal_user
- client_user

#### **9. Collect Static Files**
```bash
python manage.py collectstatic --no-input
```

**Expected output:**
```
Copying static files...
X static files copied
```

#### **10. Check for Errors**
```bash
python manage.py check
```

**Should show:**
```
System check identified no issues (0 silenced).
```

#### **11. Test Locally on PythonAnywhere**
```bash
python manage.py runserver
```

**Check if server starts without errors**

Press `Ctrl+C` to stop

#### **12. Reload Web App**
```
1. Go to Web tab in PythonAnywhere
2. Find your web app: maindoagency.pythonanywhere.com
3. Click green "Reload" button
4. Wait for confirmation
```

#### **13. Verify Deployment**
```
Run test script again:
.\test_production.ps1

All endpoints should return 200 OK
```

---

## 🔍 Troubleshooting

### If Still Getting 500 Errors:

#### **Check Error Logs:**
```
PythonAnywhere → Web tab → Log files

Check:
1. Error log - Shows Python errors
2. Server log - Shows HTTP requests
3. Access log - Shows all requests
```

#### **Common Issues:**

**1. Database Not Found:**
```bash
# Verify database settings in settings.py
python manage.py showmigrations

# If issues, reset:
python manage.py migrate --run-syncdb
```

**2. Missing Dependencies:**
```bash
# Check installed packages
pip list

# Reinstall requirements
pip install -r requirements.txt --upgrade
```

**3. Static Files:**
```bash
# Ensure STATIC_ROOT is correct in settings.py
python manage.py collectstatic --clear --no-input
```

**4. ALLOWED_HOSTS:**
```python
# In settings.py, ensure:
ALLOWED_HOSTS = [
    'maindoagency.pythonanywhere.com',
    '127.0.0.1',
    'localhost'
]
```

**5. Database Configuration:**
```python
# Verify DATABASES setting in settings.py
# Should use MySQL on PythonAnywhere
```

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All code committed to GitHub
- [ ] requirements.txt is up to date
- [ ] settings.py has production settings
- [ ] ALLOWED_HOSTS includes pythonanywhere domain
- [ ] Database is MySQL (not SQLite)
- [ ] SECRET_KEY is secure
- [ ] DEBUG = False (for production)
- [ ] STATIC_ROOT and MEDIA_ROOT configured
- [ ] CORS settings allow frontend domain

---

## 🎯 Post-Deployment Verification

### After deployment, test:

#### **1. Basic Endpoints:**
```powershell
curl https://maindoagency.pythonanywhere.com/admin/
curl https://maindoagency.pythonanywhere.com/careers/careers/
curl https://maindoagency.pythonanywhere.com/information/services/
```

**Should return:** 200 OK with JSON data

#### **2. New Endpoints:**
```powershell
# Test auto-create-user
Invoke-RestMethod -Uri "https://maindoagency.pythonanywhere.com/accounts/auto-create-user/" `
  -Method POST `
  -Body '{"name":"Test","email":"test@example.com","service":"Test"}' `
  -ContentType "application/json"
```

**Should return:** User created response

#### **3. Frontend Integration:**
```
1. Go to https://www.maindodigital.com/services
2. Select a plan
3. Fill proposal form
4. Submit
5. Should work end-to-end
```

---

## 📊 Production Configuration

### Current Production Setup:

**Frontend:**
```
Platform: Vercel (or similar)
URL: https://www.maindodigital.com
Status: ✅ Deployed and working
Build: Automatic on git push
Environment: NEXT_PUBLIC_BASE_API set
```

**Backend:**
```
Platform: PythonAnywhere
URL: https://maindoagency.pythonanywhere.com
Status: ❌ Needs code update
Database: MySQL (PythonAnywhere managed)
Python Version: 3.12
Web App: Needs reload after deployment
```

---

## 🔐 Security Checklist

Before going live:

- [ ] Change SECRET_KEY in production
- [ ] Set DEBUG = False
- [ ] Configure HTTPS
- [ ] Set up proper database backups
- [ ] Configure email (already done)
- [ ] Set up monitoring/logging
- [ ] Review CORS settings
- [ ] Check file upload limits
- [ ] Set up rate limiting (optional)
- [ ] Configure CDN for static files (optional)

---

## 📧 Email Configuration Verification

### Current Email Settings:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtpout.secureserver.net'
EMAIL_HOST_USER = 'support@maindodigital.com'
EMAIL_PORT = 465
EMAIL_USE_SSL = True
DEFAULT_FROM_EMAIL = 'support@maindodigital.com'
```

**Status:** ✅ Configured (verify password is correct)

### Test Email After Deployment:
```bash
python manage.py shell

>>> from django.core.mail import send_mail
>>> send_mail(
...     'Test Email',
...     'Testing email configuration',
...     'support@maindodigital.com',
...     ['your-email@example.com'],
... )
```

---

## 🎯 Deployment Priority

### High Priority (Do First):
1. ✅ **Pull latest code from GitHub**
2. ✅ **Install dependencies**
3. ✅ **Run migrations**
4. ✅ **Reload web app**

### Medium Priority:
5. ⚠️ **Test all endpoints**
6. ⚠️ **Verify email sending**
7. ⚠️ **Check error logs**

### Low Priority (After basics work):
8. Create test users on production
9. Set up monitoring
10. Optimize database
11. Configure CDN

---

## 📝 Quick Deployment Commands

### Copy-Paste This in PythonAnywhere Bash:

```bash
# Navigate to project
cd ~/digital_agency

# Pull latest code
git pull origin main

# Activate environment
source myenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create test users (optional)
python manage.py create_test_users

# Collect static files
python manage.py collectstatic --no-input

# Check for errors
python manage.py check

echo "✅ Deployment complete! Now reload web app in Web tab"
```

**Then:** Go to Web tab → Click "Reload maindoagency.pythonanywhere.com"

---

## 🧪 Post-Deployment Testing

### After reloading, run:
```powershell
.\test_production.ps1
```

**Should see:**
```
✅ All frontend tests: PASSED
✅ All backend tests: PASSED
✅ Success rate: 100%
```

---

## 🎊 Expected Final Status

### After Successful Deployment:

**Frontend:**
```
✅ All pages accessible
✅ All features working
✅ Mobile responsive
✅ Fast load times
```

**Backend:**
```
✅ All APIs returning data
✅ Auto-user creation working
✅ Board creation working
✅ Email notifications sending
✅ Real data feeding to dashboards
```

**Overall:**
```
✅ Complete platform operational
✅ All features live
✅ Professional and polished
✅ Ready for real users
```

---

## 🚨 IMPORTANT NOTES

### Database Backup:
Before deployment, ensure you have a backup of production database

### Testing:
Test all critical flows after deployment before announcing to users

### Monitoring:
Monitor error logs for the first few hours after deployment

### Rollback Plan:
If issues arise, you can revert code:
```bash
git reset --hard HEAD~1
# Then reload web app
```

---

## 📞 Support

### If You Encounter Issues:

**PythonAnywhere Support:**
- Help pages: https://help.pythonanywhere.com
- Forums: https://www.pythonanywhere.com/forums/

**Check Logs:**
- Web tab → Error log
- Look for Python traceback
- Share errors if needed

---

## ✅ SUMMARY

**Current Situation:**
- Frontend: ✅ 100% Working
- Backend: ❌ Needs deployment (500 errors)

**Action Required:**
1. Login to PythonAnywhere
2. Pull latest code
3. Run migrations
4. Reload web app
5. Test again

**After Deployment:**
- ✅ All features will be live
- ✅ Complete platform operational
- ✅ Ready for production use

---

**Estimated Deployment Time:** 10-15 minutes

**Run this test again after deployment to verify everything works!**

---

*All code is ready, tested locally, and waiting for production deployment.*

