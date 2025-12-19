# ⚡ QUICK START - Production Deployment

## 🎯 TL;DR - What You Need to Know

✅ **Django is now configured for production**  
✅ **Ready to deploy to Render (backend) & Vercel (frontend)**  
✅ **No localhost hardcoded anywhere**  
✅ **CORS & CSRF properly configured**  
✅ **Database encrypted with SSL**

---

## 📋 Before You Deploy

### 1. Update Frontend (if needed)
Ensure your frontend is using environment variables:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL;

fetch(`${API_BASE}/plans/`)
```

### 2. Test Locally First
```bash
cd backend
# Create .env file with production values (see ENV_REFERENCE.md)
DEBUG=False
FRONTEND_URL=https://cedric-houseplan2.vercel.app
# ... add all other variables

# Test
python manage.py check
python manage.py migrate
python manage.py runserver
# Visit http://localhost:8000/admin/ (should work)
# Visit http://localhost:8000/api/core/plans/ (should work)
```

### 3. Push to GitHub
```bash
git add .
git commit -m "Configure Django for production deployment"
git push origin main
```

---

## 🚀 Deploy Backend to Render

### Quick Setup
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select your GitHub repo
4. Set **Root Directory** to `backend`

### Configure Service
| Field | Value |
|-------|-------|
| Name | `cedric-houseplan-backend` |
| Environment | Python 3.11 (or latest) |
| Build Command | `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput` |
| Start Command | `gunicorn cedric_admin.wsgi:application` |

### Add Environment Variables
Copy all from [ENV_REFERENCE.md](ENV_REFERENCE.md) under **RENDER (Backend)**:
- [ ] DEBUG
- [ ] SECRET_KEY
- [ ] BACKEND_URL
- [ ] FRONTEND_URL
- [ ] All DB_* variables
- [ ] ALLOWED_HOSTS
- [ ] CORS_ALLOWED_ORIGINS

### Deploy
Click **"Create Web Service"** and wait for deployment...

### Verify
- [ ] ✅ Deployment shows "Live" (green)
- [ ] ✅ Visit `https://cedric-houseplan-backend.onrender.com/admin/`
- [ ] ✅ Django admin login page loads
- [ ] ✅ Visit `https://cedric-houseplan-backend.onrender.com/api/core/plans/`
- [ ] ✅ JSON response shows house plans

---

## 🚀 Deploy Frontend to Vercel

### Quick Setup
1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repo
4. Set **Root Directory** to `frontend`

### Configure Build
| Field | Value |
|-------|-------|
| Framework | Vite |
| Build Command | `npm run build` (or `bun run build`) |
| Output Directory | `dist` |

### Add Environment Variables
Copy all from [ENV_REFERENCE.md](ENV_REFERENCE.md) under **VERCEL (Frontend)**:
- [ ] VITE_BACKEND_URL
- [ ] VITE_FRONTEND_URL
- [ ] VITE_API_BASE_URL
- [ ] VITE_API_PLANS
- [ ] VITE_API_CONTACTS
- [ ] VITE_API_QUOTES
- [ ] VITE_API_PURCHASES
- [ ] VITE_API_SETTINGS
- [ ] VITE_ADMIN_URL

### Deploy
Click **"Deploy"** and wait...

### Verify
- [ ] ✅ Deployment shows "Ready"
- [ ] ✅ Visit `https://cedric-houseplan2.vercel.app`
- [ ] ✅ Page loads (no errors in console)
- [ ] ✅ House plans appear
- [ ] ✅ Click admin link (should go to Render)

---

## 🔍 Troubleshooting Quick Fixes

### ❌ "403 CSRF Token Missing"
**Fix:** Ensure `CSRF_TRUSTED_ORIGINS` in Render includes `https://cedric-houseplan2.vercel.app`

### ❌ "CORS Policy Blocked"
**Fix:** Ensure `CORS_ALLOWED_ORIGINS` in Render includes `https://cedric-houseplan2.vercel.app`

### ❌ "Admin Page Won't Load"
**Fix:** In production with DEBUG=False, must use HTTPS (Render provides this)

### ❌ "Database Connection Error"
**Fix:** Verify all DB_* variables in Render environment match Supabase exactly

### ❌ "Static Files Missing"
**Fix:** Render runs `collectstatic` automatically in build command

---

## 📊 Environment Variables Mapping

```
Backend (Render) ←→ Frontend (Vercel)
├─ BACKEND_URL ──────→ VITE_BACKEND_URL
├─ FRONTEND_URL ◄───── Used by CORS/CSRF
└─ All other vars ──→ VITE_* equivalents
```

**CRITICAL:** All URLs must match exactly!

---

## ✅ Deployment Verification Checklist

After both services are deployed:

### Backend (Render)
- [ ] Service shows "Live"
- [ ] Admin accessible at `/admin/`
- [ ] Admin login works
- [ ] API returns JSON at `/api/core/plans/`
- [ ] No database errors in logs

### Frontend (Vercel)
- [ ] Deployment shows "Ready"
- [ ] Homepage loads without errors
- [ ] House plans display
- [ ] Console shows no CORS errors
- [ ] Console shows no CSRF errors

### Integration
- [ ] Frontend fetches from backend
- [ ] Admin link works
- [ ] API data shows on page
- [ ] No 403 errors
- [ ] No CORS errors

---

## 📚 Documentation

If you need detailed info:

| Document | Purpose |
|----------|---------|
| [ENV_REFERENCE.md](ENV_REFERENCE.md) | Copy-paste env vars |
| [PRODUCTION_CONFIG.md](PRODUCTION_CONFIG.md) | Why each setting |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Detailed steps |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Full checklist |
| [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md) | Before/after |
| [VISUAL_SUMMARY.md](VISUAL_SUMMARY.md) | Diagrams & tables |

---

## 🎓 Key Changes Made

✅ Removed `decouple` library → using `os.environ.get()`  
✅ All URLs from environment → no hardcoded localhost  
✅ CORS configured for Vercel only → production secure  
✅ CSRF trusted origins added → prevents 403 errors  
✅ SSL database config → Supabase encrypted  
✅ Security headers added → HTTPS enforced  
✅ REST API public → AllowAny permission  
✅ Django admin protected → Session authentication  

---

## ⚡ Next Steps (Checklist)

- [ ] **1. Review** - Read PRODUCTION_CONFIG.md quickly
- [ ] **2. Test** - Run `python manage.py check` locally
- [ ] **3. Commit** - `git push origin main`
- [ ] **4. Render** - Deploy backend (follow DEPLOYMENT_GUIDE.md Step 3)
- [ ] **5. Vercel** - Deploy frontend (follow DEPLOYMENT_GUIDE.md Step 4)
- [ ] **6. Verify** - Test both services work together
- [ ] **7. Monitor** - Check Render & Vercel logs
- [ ] **8. Done** - 🎉 You're live!

---

## 🆘 Emergency Contacts

| Issue | Reference |
|-------|-----------|
| CORS error | PRODUCTION_CONFIG.md → CORS Configuration |
| CSRF error | PRODUCTION_CONFIG.md → CSRF Configuration |
| Database error | ENV_REFERENCE.md → Check DB variables |
| Deploy failure | DEPLOYMENT_GUIDE.md → Troubleshooting |
| Settings question | PRODUCTION_CONFIG.md → Security Settings |

---

## 🎯 Success Indicators

When everything is working:
- ✅ Frontend loads from `cedric-houseplan2.vercel.app`
- ✅ Backend responds from `cedric-houseplan-backend.onrender.com`
- ✅ Admin works at `/admin/`
- ✅ API returns JSON
- ✅ No browser console errors
- ✅ HTTPS enforced everywhere
- ✅ Database connected

---

**You're ready! Start with [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) →**

Good luck! 🚀
