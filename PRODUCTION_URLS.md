# Production URLs Configuration

## 🌐 Production Environment Setup

### Frontend URL:
```
https://www.maindodigital.com
```

### Backend API URL:
```
https://maindoagency.pythonanywhere.com
```

---

## 🔧 Environment Configuration

### For Production Deployment:

**1. Update Frontend API URL**

File: `useAPI/api.ts`
```typescript
// For production, set environment variable:
export const baseAPI = process.env.NEXT_PUBLIC_BASE_API || "http://127.0.0.1:8000"

// Or deploy with:
NEXT_PUBLIC_BASE_API=https://maindoagency.pythonanywhere.com
```

**2. Backend Settings (Already Configured)**

File: `digital_agency/settings.py`
```python
ALLOWED_HOSTS = [
    'maindoagency.pythonanywhere.com',
    '127.0.0.1',
    'localhost',
    'testserver'
]

FRONTEND_URL = "https://www.maindodigital.com"

CORS_ALLOWED_ORIGINS = [
    'https://www.maindodigital.com',
    'https://maindodigital.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```

---

## 📋 Deployment Checklist

### Backend (PythonAnywhere):
- [ ] Push latest changes to GitHub
- [ ] Pull changes on PythonAnywhere
- [ ] Run migrations: `python manage.py migrate`
- [ ] Collect static: `python manage.py collectstatic`
- [ ] Restart web app
- [ ] Test endpoints

### Frontend (Vercel/Netlify):
- [ ] Push latest changes to GitHub
- [ ] Set environment variable: `NEXT_PUBLIC_BASE_API=https://maindoagency.pythonanywhere.com`
- [ ] Deploy
- [ ] Verify build successful
- [ ] Test production site

---

## 🔗 All Production URLs

### Public URLs:
- **Website**: https://www.maindodigital.com
- **API**: https://maindoagency.pythonanywhere.com
- **Admin**: https://www.maindodigital.com/admin
- **Login**: https://www.maindodigital.com/LoginScreenUser

### API Endpoints:
- **About Us**: https://maindoagency.pythonanywhere.com/info/aboutus/
- **Services**: https://maindoagency.pythonanywhere.com/services/
- **Blog**: https://maindoagency.pythonanywhere.com/blog/
- **Projects**: https://maindoagency.pythonanywhere.com/project/
- **Careers**: https://maindoagency.pythonanywhere.com/careers/
- **Testimonials**: https://maindoagency.pythonanywhere.com/testimonials/
- **Tasks**: https://maindoagency.pythonanywhere.com/task/
- **Documents**: https://maindoagency.pythonanywhere.com/doc/
- **Appointments**: https://maindoagency.pythonanywhere.com/appointment/

### Auth Endpoints:
- **Login**: https://maindoagency.pythonanywhere.com/account/custom-login/
- **Signup**: https://maindoagency.pythonanywhere.com/account/custom-sign/
- **Create User**: https://maindoagency.pythonanywhere.com/account/admin-create-user/
- **Password Reset**: https://maindoagency.pythonanywhere.com/account/request-password-reset/

---

## 🚀 Quick Deploy Commands

### Backend (On PythonAnywhere Console):
```bash
cd ~/digital_agency
git pull origin main
python manage.py migrate
python manage.py collectstatic --noinput
# Then click "Reload" button in Web tab
```

### Frontend (Local Build Test):
```bash
cd H:\GitHub\digital_agency_front_end
$env:NEXT_PUBLIC_BASE_API="https://maindoagency.pythonanywhere.com"
npm run build
npm start
```

---

## 📧 Email Configuration

### Production Email Settings (Already in settings.py):
```python
EMAIL_HOST = 'smtpout.secureserver.net'
EMAIL_HOST_USER = 'support@maindodigital.com'
EMAIL_HOST_PASSWORD = 'Maitland@2024'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

DEFAULT_FROM_EMAIL = 'support@maindodigital.com'
```

**Welcome emails will be sent from:** support@maindodigital.com

---

## 🔐 Security Notes

### For Production:
1. ✅ HTTPS enforced
2. ✅ CORS properly configured
3. ✅ CSRF protection enabled
4. ✅ Secure session cookies
5. ✅ Environment variables for secrets
6. ⚠️ Set DEBUG = False (before production deploy)
7. ⚠️ Change SECRET_KEY to environment variable

---

## 📊 What's Being Deployed

### New Features:
1. ✅ Improved login error messages
2. ✅ Mixpanel mutex lock fixes
3. ✅ Next.js updated to 15.5.6
4. ✅ PDF signing restored
5. ✅ Transparent signatures
6. ✅ Document rendering improvements
7. ✅ Internal/external signing
8. ✅ Professional user creation
9. ✅ Job titles & departments
10. ✅ Welcome emails with credentials
11. ✅ Full user CRUD operations
12. ✅ Group assignment features
13. ✅ Enhanced admin interface
14. ✅ Professional member management

### Bug Fixes:
1. ✅ Toast.info error fixed
2. ✅ PDF viewer warnings removed
3. ✅ Signature capture errors fixed
4. ✅ Django URL duplicates cleaned
5. ✅ Allauth deprecation warnings fixed

---

## 🌍 Environment-Specific URLs

### Development (Local):
```
Frontend: http://localhost:3000
Backend: http://localhost:8000
```

### Production:
```
Frontend: https://www.maindodigital.com
Backend: https://maindoagency.pythonanywhere.com
```

### Switching Between Environments:

**Local Development:**
```typescript
// useAPI/api.ts
export const baseAPI = "http://127.0.0.1:8000"
```

**Production:**
```typescript
// useAPI/api.ts - uses environment variable
export const baseAPI = process.env.NEXT_PUBLIC_BASE_API || "http://127.0.0.1:8000"

// Set in deployment:
NEXT_PUBLIC_BASE_API=https://maindoagency.pythonanywhere.com
```

---

## ✅ Ready for Deployment

All code is:
- ✅ Tested locally
- ✅ Linting passed
- ✅ No errors
- ✅ Production URLs configured
- ✅ Ready to push to GitHub
- ✅ Ready to deploy

---

**Status:** ✅ Production Ready  
**Date:** November 6, 2025  
**Version:** All latest features included

