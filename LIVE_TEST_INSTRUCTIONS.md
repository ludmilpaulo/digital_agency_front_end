# 🧪 Live Testing Instructions - Board Status Update Feature

## 📋 Prerequisites

### ✅ Servers Running
- **Backend**: http://127.0.0.1:8000 ✅ Running
- **Frontend**: http://localhost:3000 ✅ Running

### ✅ Code Changes Deployed
- [x] Backend: Removed `budget_used` database field
- [x] Backend: Added debug logging
- [x] Frontend: Removed `budget_used` from API calls
- [x] Frontend: Added console logging
- [x] Frontend: Fixed TypeScript types

---

## 🎯 Test Scenarios

### Test 1: Backend API Direct Test (Already Passed ✅)

**Test Board Status Update via API**
```powershell
# Get current board data
Invoke-WebRequest -Uri "http://127.0.0.1:8000/task/boards/13/" -Method GET

# Update board status
$body = @{
    name="rebuild  - test"
    description="Test description"
    status="In Progress"
    managers_ids=@(1,2,3,6)
    users_ids=@(8)
    budget=6000
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:8000/task/boards/13/" -Method PUT -Body $body -ContentType "application/json"
```

**Expected Result**: ✅ Status updated successfully from "Started" to "In Progress"

---

### Test 2: Admin Dashboard - Quick Status Update

#### Steps:
1. **Open Browser**
   - Navigate to: http://localhost:3000/admin
   - Open DevTools Console (F12)

2. **Login** (if not already logged in)
   - Username: `admin`
   - Password: `Maitland@2025`

3. **Locate Test Board**
   - Find board: "rebuild - test" (ID: 13)
   - Current status should be: "In Progress" (from Test 1)

4. **Change Status via Dropdown**
   - Locate the status dropdown on the board card
   - Click the dropdown
   - Select "Concluded"

5. **Monitor Console Logs**
   ```
   Expected logs:
   [handleUpdateBoardStatus] Sending data: {
     id: 13,
     name: "rebuild  - test",
     description: "...",
     status: "Concluded",
     managers_ids: [1, 2, 3, 6],
     users_ids: [8],
     budget: 6000,
     deadline: "2025-10-31",
     ...
   }
   ```

6. **Verify Update**
   - ✅ No error alert appears
   - ✅ Board status changes to "Concluded" on UI
   - ✅ No console errors
   - ✅ Backend logs show successful update

#### Expected Django Console Output:
```
[BoardViewSet.update] Received data: {
  'name': 'rebuild  - test',
  'description': '...',
  'status': 'Concluded',
  'managers_ids': [1, 2, 3, 6],
  'users_ids': [8],
  'budget': 6000,
  ...
}
[21/Oct/2025 XX:XX:XX] "PUT /task/boards/13/ HTTP/1.1" 200 XXXX
```

---

### Test 3: Admin Dashboard - Full Edit Modal

#### Steps:
1. **Open Edit Modal**
   - Click "Edit" button on any board
   - Modal should open with board details

2. **Change Board Status**
   - Locate status dropdown in modal
   - Change status to different value
   - Fill in any other required fields if needed

3. **Save Changes**
   - Click "Save" or "Update Board" button
   - Monitor console for logs

4. **Verify**
   - ✅ Modal closes
   - ✅ Board list refreshes
   - ✅ Status is updated on board card
   - ✅ No error messages

---

### Test 4: User Dashboard - Progress Tracking

#### Steps:
1. **Navigate to User Dashboard**
   - Go to: http://localhost:3000/userDashboard
   - Login as user: `test` (if needed)

2. **View Project Progress**
   - Find project "rebuild - test"
   - Check if status is displayed
   - Verify progress bar reflects admin updates

3. **Expected Display**
   - ✅ Project shows current status
   - ✅ Progress tracking visible
   - ✅ Budget information displayed
   - ✅ Milestones/timeline shown

---

## 🔍 What to Check

### Browser Console (Frontend)
✅ No error messages  
✅ Logs show `[handleUpdateBoardStatus]` with correct data  
✅ No `budget_used` in request payload  
✅ Status updates reflected in UI  

### Django Console (Backend)
✅ Logs show `[BoardViewSet.update]` with received data  
✅ HTTP 200 response (not 400)  
✅ No serializer validation errors  
✅ No exceptions or tracebacks  

### UI/UX
✅ Status dropdown works smoothly  
✅ Board updates without page refresh  
✅ Edit modal saves correctly  
✅ No alert popups with errors  

---

## 🚨 Troubleshooting

### If you see 400 Bad Request:

1. **Check Browser Console**
   ```javascript
   // Look for this log
   [handleUpdateBoardStatus] Sending data: { ... }
   
   // Check if any field has invalid value
   - Empty name? ❌
   - Missing managers_ids? ❌
   - Invalid date format? ❌
   - budget_used present? ❌ (should not be there)
   ```

2. **Check Django Console**
   ```
   [BoardViewSet.update] Error: ...
   # Will show exact validation error
   ```

3. **Check Network Tab**
   - Open DevTools → Network tab
   - Filter: "boards"
   - Click failed PUT request
   - Check:
     - Request Payload
     - Response body (shows error details)

### Common Issues & Fixes:

| Issue | Fix |
|-------|-----|
| "budget_used: This field is read-only" | Clear browser cache, refresh |
| "managers_ids: This field is required" | Check managers array not empty |
| "Invalid date format" | Dates should be "YYYY-MM-DD" or "" |
| Status not updating on UI | Wait 300ms for refetch, or refresh page |

---

## ✅ Success Criteria

- [x] Backend API accepts PUT requests with status updates
- [x] Frontend sends correct data structure (no budget_used)
- [ ] Admin can update status via dropdown
- [ ] Admin can update status via edit modal
- [ ] User can see updated status on dashboard
- [ ] No errors in browser console
- [ ] No 400 errors in Django console

---

## 📝 Test Report Template

**Tester Name**: _______________  
**Test Date**: October 21, 2025  
**Environment**: Local Development  

### Test Results:

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Backend API Direct | ✅ PASS | Status updated successfully |
| 2 | Quick Status Update | ⬜ PENDING | |
| 3 | Full Edit Modal | ⬜ PENDING | |
| 4 | User Progress Tracking | ⬜ PENDING | |

**Overall Status**: ⬜ PASS / ⬜ FAIL  

**Issues Found**:
- [ ] None
- [ ] Minor issues: _____________
- [ ] Critical issues: _____________

**Screenshots**: (attach if applicable)

---

## 🎉 Next Steps After Testing

If all tests pass:
1. ✅ Commit changes to git
2. ✅ Push to repository
3. ✅ Deploy to production
4. ✅ Test on live environment
5. ✅ Monitor for any issues

If tests fail:
1. Document exact error
2. Check browser & Django console
3. Review troubleshooting section
4. Contact developer if needed

---

**Need Help?** Check the console logs and review `BOARD_STATUS_UPDATE_TEST.md` for technical details.

