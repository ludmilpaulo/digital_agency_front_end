# ✅ PythonAnywhere Deployment Checklist

## 🚀 Follow These Steps EXACTLY

---

## STEP 1: Login to PythonAnywhere
```
1. Open browser
2. Go to: https://www.pythonanywhere.com
3. Login with your credentials
```

---

## STEP 2: Open Bash Console
```
1. Click "Consoles" tab
2. Click "Bash" (or open existing console)
3. You should see terminal
```

---

## STEP 3: Navigate to Project
```bash
cd ~/digital_agency
```

**Verify:** You should see `(main)` in the path

---

## STEP 4: Pull Latest Code
```bash
git pull origin main
```

**Expected output:**
```
Updating files...
accounts/views.py changed
[other files]
```

**If "Already up to date":** That's fine, continue!

---

## STEP 5: Activate Virtual Environment
```bash
source myenv/bin/activate
```

**Verify:** You should see `(myenv)` at start of line

---

## STEP 6: Install Dependencies
```bash
pip install -r requirements.txt
```

**Wait for:** "Successfully installed..." messages

---

## STEP 7: Run Migrations
```bash
python manage.py migrate
```

**Expected:**
```
Operations to perform:
  Apply all migrations...
Running migrations:
  No migrations to apply.
```

---

## STEP 8: Create Test Users
```bash
python manage.py create_test_users
```

**Expected:**
```
✅ CREATED/UPDATED: admin_test
✅ CREATED/UPDATED: developer_test
✅ CREATED/UPDATED: normal_user
```

---

## STEP 9: Collect Static Files
```bash
python manage.py collectstatic --no-input
```

**Expected:**
```
X static files copied
```

---

## STEP 10: Check for Errors
```bash
python manage.py check
```

**Should show:**
```
System check identified no issues (0 silenced).
```

**If errors:** Stop and share the errors with me!

---

## STEP 11: RELOAD WEB APP (CRITICAL!)

**This is the most important step:**

1. Click **"Web"** tab (top of page)
2. Find: **maindoagency.pythonanywhere.com**
3. Scroll to top of page
4. Click big green button: **"Reload maindoagency.pythonanywhere.com"**
5. Wait for: ✅ "reloaded successfully" message

---

## STEP 12: Verify Deployment

**Open new browser tab and test:**

```
1. https://www.maindodigital.com/
   → Should load

2. https://www.maindodigital.com/services
   → Should show services

3. https://www.maindodigital.com/admin
   → Should load admin dashboard
```

---

## STEP 13: Run Production Test

**On your local computer:**

```powershell
cd H:\GitHub\digital_agency_front_end
.\full_production_test.ps1
```

**Should show:**
```
✅ Passed: 10/10
✅ Success Rate: 100%
```

---

## ✅ DEPLOYMENT COMPLETE!

**If all steps successful:**
- ✅ Backend deployed
- ✅ APIs working
- ✅ Frontend connected
- ✅ All features live
- ✅ Ready for users!

---

## 🎉 TEST YOUR LIVE PLATFORM

**Try the complete flow:**

1. Go to: https://www.maindodigital.com/services
2. Select a plan
3. Fill proposal form
4. Submit
5. Check your email
6. Login with credentials
7. Explore your dashboard

**Everything should work!**

---

## 🐛 If Something Goes Wrong

**Check Error Logs:**
```
PythonAnywhere → Web tab → Log files

Look for:
- Error log (Python errors)
- Server log (HTTP requests)
```

**Share the errors with me and I'll help fix!**

---

## 📞 Need Help?

If stuck at any step, let me know:
- Which step?
- What error message?
- What did you see?

I'll help you fix it immediately!

---

**Estimated Time: 10-15 minutes**

**Let's get your platform live! 🚀**

