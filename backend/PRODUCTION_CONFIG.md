# Production Configuration Guide - Cedric House Plan

## ✅ Updated Settings Configuration

Your `settings.py` has been updated for production deployment. Here's what was changed:

---

## 🔐 Security Settings Explained

### 1. **DEBUG = False**
- **What:** `DEBUG=False` disables Django debug mode in production
- **Why:** Debug mode exposes sensitive information about your application, database queries, and file paths
- **Set via:** `os.environ.get('DEBUG', 'False').lower() == 'true'`

### 2. **SECRET_KEY from Environment**
- **What:** Moved from hardcoded to environment variable
- **Why:** Never hardcode secrets in code pushed to GitHub
- **Usage:** Set `SECRET_KEY` on Render dashboard

### 3. **SECURE_SSL_REDIRECT = True** (in production)
- **What:** Automatically redirects HTTP → HTTPS
- **Why:** Ensures all traffic is encrypted
- **Implementation:** `IS_PRODUCTION = not DEBUG`

### 4. **SECURE_PROXY_SSL_HEADER**
- **What:** `('HTTP_X_FORWARDED_PROTO', 'https')`
- **Why:** Render uses a proxy in front of your app. This tells Django that SSL termination happens at the proxy
- **Requirement:** Essential for Render deployment

### 5. **SECURE_HSTS_SECONDS**
- **What:** HTTP Strict Transport Security for 1 year (31536000 seconds)
- **Why:** Tells browsers to always use HTTPS for your domain
- **Production Only:** Set to 0 in development

### 6. **SESSION_COOKIE_SECURE = True** (in production)
- **What:** Session cookies only sent over HTTPS
- **Why:** Prevents cookie theft over unsecured connections
- **Impact:** Cookies won't work over HTTP

### 7. **CSRF_COOKIE_SECURE = True** (in production)
- **What:** CSRF tokens only sent over HTTPS
- **Why:** CSRF protection is only effective over encrypted connections

---

## 🌐 CORS & CSRF Configuration

### CORS_ALLOWED_ORIGINS
```python
CORS_ALLOWED_ORIGINS = [
    os.environ.get('FRONTEND_URL', 'http://localhost:5173'),
]
```
- **What:** Only Vercel frontend can make cross-origin requests to your API
- **Value:** `https://cedric-houseplan2.vercel.app`
- **Why:** Prevents other websites from accessing your API

### CSRF_TRUSTED_ORIGINS
```python
CSRF_TRUSTED_ORIGINS = [
    os.environ.get('FRONTEND_URL', 'http://localhost:5173'),
]
```
- **What:** Allows POST/PUT/DELETE requests from your Vercel frontend
- **Why:** Django CSRF protection requires explicit trust of frontend origin
- **Critical:** Without this, you'll get 403 Forbidden errors on form submissions

### CORS_ALLOW_CREDENTIALS = True
- **What:** Allows session cookies to be sent with cross-origin requests
- **Why:** Needed for authentication and CSRF tokens to work across domains

---

## 📊 Database Configuration

### PostgreSQL with Supabase
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'postgres'),
        'USER': os.environ.get('DB_USER', 'postgres.yulpvfabkynqspiroghb'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'aws-1-eu-west-1.pooler.supabase.com'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': os.environ.get('DB_SSLMODE', 'require'),
        },
    }
}
```

**Why SSL is required (`sslmode=require`):**
- Supabase requires encrypted database connections
- Prevents credentials from being transmitted in plaintext

---

## 📝 Middleware Order (CRITICAL!)

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # ← SSL redirect
    'corsheaders.middleware.CorsMiddleware',          # ← CORS first
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',      # ← CSRF after CORS
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

**Why order matters:**
1. CorsMiddleware MUST come before CsrfViewMiddleware
2. Both must come after SecurityMiddleware
3. This ensures CORS headers are set before CSRF checks

---

## 🔌 REST Framework Settings

### Changed: AllowAny Permission (for API)
```python
'DEFAULT_PERMISSION_CLASSES': [
    'rest_framework.permissions.AllowAny',
]
```

**Why:** Your API should be publicly accessible
- Users don't need to be authenticated to view house plans
- Admin interface requires separate authentication

---

## 🚀 Deployment Checklist for Render

### On Render Dashboard:
1. **Build Command:** `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
2. **Start Command:** `gunicorn cedric_admin.wsgi:application`
3. **Environment Variables** - Add these:

```
DEBUG=False
SECRET_KEY=<generate-strong-random-key>
BACKEND_URL=https://cedric-houseplan-backend.onrender.com
BACKEND_HOST=cedric-houseplan-backend.onrender.com
BACKEND_PORT=443
FRONTEND_URL=https://cedric-houseplan2.vercel.app
USE_SQLITE=False
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres.yulpvfabkynqspiroghb
DB_PASSWORD=Defence02@cedric.
DB_HOST=aws-1-eu-west-1.pooler.supabase.com
DB_PORT=5432
DB_SSLMODE=require
ALLOWED_HOSTS=cedric-houseplan-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://cedric-houseplan2.vercel.app
```

---

## 🚀 Deployment Checklist for Vercel (Frontend)

### Environment Variables in Vercel:
```
VITE_BACKEND_URL=https://cedric-houseplan-backend.onrender.com
VITE_FRONTEND_URL=https://cedric-houseplan2.vercel.app
VITE_API_BASE_URL=https://cedric-houseplan-backend.onrender.com/api/core
VITE_API_PLANS=https://cedric-houseplan-backend.onrender.com/api/core/plans/
VITE_API_CONTACTS=https://cedric-houseplan-backend.onrender.com/api/core/contacts/
VITE_API_QUOTES=https://cedric-houseplan-backend.onrender.com/api/core/quotes/
VITE_API_PURCHASES=https://cedric-houseplan-backend.onrender.com/api/core/purchases/
VITE_API_SETTINGS=https://cedric-houseplan-backend.onrender.com/api/core/settings/
VITE_ADMIN_URL=https://cedric-houseplan-backend.onrender.com/admin/
```

---

## 🐛 Common Issues & Fixes

### Issue: 403 CSRF Token Error
**Cause:** `CSRF_TRUSTED_ORIGINS` not set correctly
**Fix:** Ensure `FRONTEND_URL` env variable matches your Vercel domain exactly

### Issue: CORS errors when API calls fail
**Cause:** `CORS_ALLOWED_ORIGINS` mismatch
**Fix:** Check that `FRONTEND_URL` is exactly `https://cedric-houseplan2.vercel.app`

### Issue: Django admin won't load
**Cause:** Session cookies not secure
**Fix:** In production with DEBUG=False, must use HTTPS (Render handles this)

### Issue: Database connection fails
**Cause:** SSL mode or credentials wrong
**Fix:** Verify `DB_SSLMODE=require` and all DB credentials match Supabase

---

## 🔍 Verification Commands

### Test locally (before pushing to GitHub):
```bash
# 1. Create .env file with production values
DEBUG=False
FRONTEND_URL=https://cedric-houseplan2.vercel.app
# ... other vars

# 2. Run migrations
python manage.py migrate

# 3. Test the application
python manage.py runserver
```

### Check settings loaded correctly:
```python
from django.conf import settings
print(settings.ALLOWED_HOSTS)
print(settings.CORS_ALLOWED_ORIGINS)
print(settings.CSRF_TRUSTED_ORIGINS)
```

---

## ✨ What This Setup Provides

✅ Django Admin works on Render  
✅ Frontend on Vercel can make API calls without CORS errors  
✅ All POST/PUT/DELETE requests work (no CSRF 403 errors)  
✅ Session cookies secure over HTTPS  
✅ Database encrypted with Supabase SSL  
✅ No hardcoded secrets in GitHub  
✅ Production-safe security headers  
✅ Automatic HTTP → HTTPS redirect  

---

## 📌 Important Notes

- **Never commit `.env` file** - Add to `.gitignore`
- **Keep `.env.example`** - For documentation
- **Regenerate SECRET_KEY** - Don't use the example value
- **Use strong passwords** - For DB_PASSWORD (already provided by Supabase)
- **Test locally first** - Before deploying to Render

---

**Configuration updated:** December 19, 2025  
**Status:** ✅ Production Ready
