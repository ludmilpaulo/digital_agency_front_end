# Setting Up Executive Group for Managers

## 🎯 Quick Start: Make Users Available as Managers

Managers in the system must be either **Superusers** or members of the **Executive** group.

---

## 🚀 Method 1: Create Executive Group & Add Users (Recommended)

### Step 1: Create Executive Group

**Option A - Via Django Shell:**
```bash
# On backend server
cd H:\GitHub\digital_agency
python manage.py shell
```

```python
from django.contrib.auth.models import Group

# Create Executive group
executive_group, created = Group.objects.get_or_create(name='Executive')

if created:
    print("✅ Executive group created!")
else:
    print("✅ Executive group already exists")
```

**Option B - Via Django Admin:**
1. Go to: `http://localhost:8000/admin/`
2. Login as superuser
3. Click "Groups"
4. Click "Add Group"
5. Name: `Executive`
6. Save

### Step 2: Add Users to Executive Group

**Option A - Via Django Shell:**
```python
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

User = get_user_model()

# Get Executive group
executive_group = Group.objects.get(name='Executive')

# Add specific users
user1 = User.objects.get(username='john_manager')
user1.groups.add(executive_group)
print(f"✅ Added {user1.username} to Executive group")

user2 = User.objects.get(username='jane_ceo')
user2.groups.add(executive_group)
print(f"✅ Added {user2.username} to Executive group")

# Verify
print(f"\nExecutive members: {executive_group.user_set.count()}")
for user in executive_group.user_set.all():
    print(f"  - {user.username} ({user.email})")
```

**Option B - Via Frontend Admin Panel:**
1. Login as admin
2. Go to Admin Panel → Members
3. Click "Edit" on a user
4. Scroll to "Group Assignment"
5. Check "Executive" checkbox
6. Click "Save Changes"
7. User is now a manager!

**Option C - Via Django Admin:**
1. Go to: `http://localhost:8000/admin/`
2. Click "Users"
3. Click on a user
4. Scroll to "Groups"
5. Move "Executive" from Available to Chosen
6. Save

---

## 🚀 Method 2: Create Superuser (Admin)

```bash
cd H:\GitHub\digital_agency
python manage.py createsuperuser
```

Follow prompts:
- Email: `admin@maindodigital.com`
- Username: `admin`
- Password: (your secure password)

**Superusers are automatically managers!**

---

## 🧪 Verify Setup

### Check via Django Shell:

```python
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

User = get_user_model()

# Check Executive group exists
try:
    exec_group = Group.objects.get(name='Executive')
    print(f"✅ Executive group exists with {exec_group.user_set.count()} members")
except Group.DoesNotExist:
    print("❌ Executive group does NOT exist - please create it!")

# Check superusers
superusers = User.objects.filter(is_superuser=True)
print(f"✅ Superusers: {superusers.count()}")

# Check all managers
managers = User.objects.filter(
    models.Q(is_superuser=True) | models.Q(groups__name='Executive')
).distinct()
print(f"✅ Total managers available: {managers.count()}")

for m in managers:
    is_super = m.is_superuser
    is_exec = m.groups.filter(name='Executive').exists()
    print(f"  - {m.username}: superuser={is_super}, executive={is_exec}")
```

### Check via Frontend:

1. Login as staff user
2. Go to devDashBoard → Documents
3. Click "Upload Document"
4. Check "Assign Line Manager" dropdown
5. Should show all managers

**Expected Console Output:**
```
Fetching managers from: http://127.0.0.1:8000/account/profile/line_managers/
Found 5 managers
✅ Managers loaded successfully: ["admin", "ceo", "vp_eng", "vp_sales", "director"]
```

---

## 📋 Quick Setup Commands

### Complete Setup Script:

```python
# Run in Django shell: python manage.py shell

from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

User = get_user_model()

# 1. Create Executive group
executive, created = Group.objects.get_or_create(name='Executive')
print(f"{'Created' if created else 'Found'} Executive group")

# 2. Add specific users (replace with your usernames)
usernames_to_add = ['john_manager', 'jane_ceo', 'bob_director']

for username in usernames_to_add:
    try:
        user = User.objects.get(username=username)
        user.groups.add(executive)
        print(f"✅ Added {username} to Executive group")
    except User.DoesNotExist:
        print(f"❌ User {username} not found - skipping")

# 3. Verify
print(f"\n📊 Summary:")
print(f"Executive members: {executive.user_set.count()}")
print(f"Superusers: {User.objects.filter(is_superuser=True).count()}")

total_managers = User.objects.filter(
    models.Q(is_superuser=True) | models.Q(groups__name='Executive')
).distinct().count()
print(f"Total managers available: {total_managers}")
```

---

## 🔄 Migration Script (If Needed)

If you currently have users with `is_staff=True` who should be managers:

```python
# Migrate is_staff users to Executive group

from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

User = get_user_model()

# Create Executive group
executive, _ = Group.objects.get_or_create(name='Executive')

# Get all staff who aren't superusers
staff_users = User.objects.filter(is_staff=True, is_superuser=False)

print(f"Migrating {staff_users.count()} staff users to Executive group...")

for user in staff_users:
    user.groups.add(executive)
    print(f"✅ {user.username} added to Executive group")

print(f"\n✅ Migration complete!")
print(f"Executive group now has {executive.user_set.count()} members")
```

---

## 📊 Recommended Structure

### Typical Organization:

```
👑 Superusers (1-2)
├── CEO
└── CTO

⭐ Executive Group (3-5)
├── VP Engineering
├── VP Sales
├── VP Operations
├── Finance Director
└── HR Director

👥 Staff Group (10-50)
├── Senior Developers
├── Developers
├── Designers
└── Other staff

👤 Freelancer/Client Groups
├── Contractors
└── Clients
```

### Manager Selection:
- **Superusers:** Always available as managers
- **Executive:** Senior leadership who approve documents
- **Staff:** Regular employees (NOT managers)

---

## ✅ Checklist

After setup, verify:

- [ ] Executive group exists
- [ ] Executive group has members
- [ ] OR have at least one superuser
- [ ] Managers appear in dropdown when uploading documents
- [ ] Console shows: "Found X managers"
- [ ] Can select and assign managers
- [ ] Documents upload successfully

---

## 🆘 If No Managers Show

### Quick Fix:

```python
# Run this in Django shell
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

User = get_user_model()

# Create Executive group
exec_group, _ = Group.objects.get_or_create(name='Executive')

# Add your admin user to Executive
admin = User.objects.get(username='admin')  # Change to your admin username
admin.groups.add(exec_group)

print(f"✅ Admin added to Executive. Total managers: {exec_group.user_set.count()}")
```

Then refresh the upload document modal!

---

**Status:** ✅ Manager criteria updated  
**Criteria:** Superusers OR Executive group  
**Ready:** Production deployment

