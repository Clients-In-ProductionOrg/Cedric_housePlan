# QUICK REFERENCE - Production Environment Variables

## For RENDER (Backend)

Add these to Render Environment Variables:

```
DEBUG=False
SECRET_KEY=django-insecure-cedric-production-key-CHANGE-THIS

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

## For VERCEL (Frontend)

Add these to Vercel Environment Variables:

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

## For LOCAL .env (Development)

```
DEBUG=True
SECRET_KEY=django-insecure-local-development-key

BACKEND_URL=http://localhost:8000
BACKEND_HOST=localhost
BACKEND_PORT=8000

FRONTEND_URL=http://localhost:5173

USE_SQLITE=True

ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## Render Build Command

```
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

## Render Start Command

```
gunicorn cedric_admin.wsgi:application
```

---

## Key Changes Made

✅ Removed `decouple` library - using `os.environ.get()` directly  
✅ All URLs from environment variables (no hardcoded localhost)  
✅ CORS configured for Vercel frontend only  
✅ CSRF trusted origins configured for cross-domain requests  
✅ Secure cookies enabled in production (IS_PRODUCTION flag)  
✅ SECURE_PROXY_SSL_HEADER for Render's proxy  
✅ PostgreSQL with SSL for Supabase  
✅ Django Admin protected with session auth  
✅ REST API accessible (AllowAny permission)  

---

See PRODUCTION_CONFIG.md for detailed explanations.
