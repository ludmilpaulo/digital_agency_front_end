# Quick Restart Instructions

## 🚀 Option 1: Automated Restart (Recommended)

Run the restart script in PowerShell:

```powershell
cd H:\GitHub\digital_agency_front_end
.\restart_servers.ps1
```

This will:
- Stop both backend and frontend servers
- Restart them in new terminal windows
- Apply all the Mixpanel and Next.js fixes

---

## 🔧 Option 2: Manual Restart

### Stop Current Servers
1. Find the terminal windows running the servers
2. Press `Ctrl+C` in each window to stop them

### Start Backend (Django)
```powershell
cd H:\GitHub\digital_agency
python manage.py runserver 8000
```

### Start Frontend (Next.js)
Open a NEW terminal window:
```powershell
cd H:\GitHub\digital_agency_front_end
npm run dev
```

---

## ✅ Verify Everything Works

After restarting:

1. **Check Backend**: http://localhost:8000/admin/
2. **Check Frontend**: http://localhost:3000
3. **Check Console**: Open DevTools (F12) and look for:
   - ✅ `✅ Mixpanel initialized successfully`
   - ❌ NO mutex lock errors

---

## 🧹 Optional: Clear Browser Cache

For a fresh start:

1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

OR

1. DevTools → Application → Storage
2. Click "Clear site data"
3. Refresh page

---

## 📊 What Was Fixed

- ✅ Mixpanel mutex lock timeout errors
- ✅ Next.js updated from 15.3.2 → 15.5.6
- ✅ Better error handling for analytics
- ✅ Prevented double initialization
- ✅ Added automatic lock cleanup

---

Need help? Check `FIXES_APPLIED.md` for detailed information.

