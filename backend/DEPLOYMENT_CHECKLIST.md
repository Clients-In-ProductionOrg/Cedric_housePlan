# ✅ PRODUCTION DEPLOYMENT CHECKLIST

## Phase 1: Local Testing (Before GitHub)

### Environment Setup
- [ ] Create `.env` file in `backend/` directory
- [ ] Copy all values from `ENV_REFERENCE.md`
- [ ] Set `DEBUG=False` in `.env`
- [ ] Add `.env` to `.gitignore`

### Code Verification
- [ ] Run `python manage.py check` (no errors)
- [ ] Run `python manage.py migrate` (database migrations work)
- [ ] Run `python manage.py collectstatic --noinput` (static files collected)
- [ ] Start server: `python manage.py runserver`
- [ ] Test Django admin: Visit `http://localhost:8000/admin/`
- [ ] Create superuser if needed: `python manage.py createsuperuser`
- [ ] Login to admin (verify authentication works)

### API Testing
- [ ] Test API endpoint: `http://localhost:8000/api/core/plans/`
- [ ] Verify JSON response loads
- [ ] Check browser console for errors

---

## Phase 2: GitHub Preparation

### Repository Setup
- [ ] Run `git status` (check unstaged changes)
- [ ] Run `git add .` (stage all changes)
- [ ] Verify `.env` is in `.gitignore` (not staging secrets!)
- [ ] Verify `.env.example` is staged (for documentation)
- [ ] Run `git commit -m "Configure Django for production deployment"`
- [ ] Run `git push origin main` (push to GitHub)

### GitHub Verification
- [ ] Visit GitHub repo
- [ ] Verify no `.env` file present (only `.env.example`)
- [ ] Verify latest commit includes settings changes
- [ ] Verify backend files visible and accessible

---

## Phase 3: Render Backend Deployment

### Create Render Service
- [ ] Visit https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select branch: `main`
- [ ] Select root directory: `backend`
- [ ] Name: `cedric-houseplan-backend`
- [ ] Environment: Select appropriate runtime
- [ ] Plan: Start with Free/Pro as needed

### Configure Build & Start
- [ ] Build Command:
  ```
  pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
  ```
- [ ] Start Command:
  ```
  gunicorn cedric_admin.wsgi:application
  ```

### Add Environment Variables (Render Dashboard)
- [ ] `DEBUG=False`
- [ ] `SECRET_KEY=django-insecure-cedric-production-key-CHANGE-THIS`
- [ ] `BACKEND_URL=https://cedric-houseplan-backend.onrender.com`
- [ ] `BACKEND_HOST=cedric-houseplan-backend.onrender.com`
- [ ] `BACKEND_PORT=443`
- [ ] `FRONTEND_URL=https://cedric-houseplan2.vercel.app`
- [ ] `USE_SQLITE=False`
- [ ] `DB_ENGINE=django.db.backends.postgresql`
- [ ] `DB_NAME=postgres`
- [ ] `DB_USER=postgres.yulpvfabkynqspiroghb`
- [ ] `DB_PASSWORD=Defence02@cedric.`
- [ ] `DB_HOST=aws-1-eu-west-1.pooler.supabase.com`
- [ ] `DB_PORT=5432`
- [ ] `DB_SSLMODE=require`
- [ ] `ALLOWED_HOSTS=cedric-houseplan-backend.onrender.com`
- [ ] `CORS_ALLOWED_ORIGINS=https://cedric-houseplan2.vercel.app`

### Deploy & Monitor
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to start
- [ ] Monitor build logs (watch for errors)
- [ ] Check "Events" tab for deployment status
- [ ] Wait for "Live" status (green)
- [ ] Note the backend URL

### Verify Render Deployment
- [ ] Visit `https://cedric-houseplan-backend.onrender.com/admin/`
- [ ] See Django admin login page (not 500 error)
- [ ] Try login with superuser credentials
- [ ] Visit `https://cedric-houseplan-backend.onrender.com/api/core/plans/`
- [ ] See JSON response (not error)
- [ ] Check browser console (no CORS errors)

---

## Phase 4: Vercel Frontend Deployment

### Prepare Frontend Code
- [ ] Update API endpoints to use environment variables
- [ ] Ensure all URLs use `import.meta.env.VITE_*`
- [ ] Test locally with Render backend URL (if possible)
- [ ] Commit changes: `git push origin main`

### Create Vercel Project
- [ ] Visit https://vercel.com
- [ ] Click "Add New" → "Project"
- [ ] Import GitHub repository
- [ ] Select `cedric-houseplan` repo
- [ ] Select `frontend` directory as root
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build` (or `bun run build`)
- [ ] Output directory: `dist`

### Add Environment Variables (Vercel Dashboard)
- [ ] `VITE_BACKEND_URL=https://cedric-houseplan-backend.onrender.com`
- [ ] `VITE_FRONTEND_URL=https://cedric-houseplan2.vercel.app`
- [ ] `VITE_API_BASE_URL=https://cedric-houseplan-backend.onrender.com/api/core`
- [ ] `VITE_API_PLANS=https://cedric-houseplan-backend.onrender.com/api/core/plans/`
- [ ] `VITE_API_CONTACTS=https://cedric-houseplan-backend.onrender.com/api/core/contacts/`
- [ ] `VITE_API_QUOTES=https://cedric-houseplan-backend.onrender.com/api/core/quotes/`
- [ ] `VITE_API_PURCHASES=https://cedric-houseplan-backend.onrender.com/api/core/purchases/`
- [ ] `VITE_API_SETTINGS=https://cedric-houseplan-backend.onrender.com/api/core/settings/`
- [ ] `VITE_ADMIN_URL=https://cedric-houseplan-backend.onrender.com/admin/`

### Deploy to Vercel
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Check build logs (no errors)
- [ ] Wait for deployment to complete
- [ ] Note the Vercel URL (should be `cedric-houseplan2.vercel.app`)

### Verify Vercel Deployment
- [ ] Visit https://cedric-houseplan2.vercel.app
- [ ] Page loads without errors
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Reload page
- [ ] Check API calls to backend:
  - [ ] No 403 errors
  - [ ] No CORS errors
  - [ ] Status 200 OK
- [ ] Verify house plans load
- [ ] Test contact form (if available)
- [ ] Check Console tab (no errors)

---

## Phase 5: Testing & Validation

### Test User Flows
- [ ] Browse house plans on frontend
- [ ] View plan details
- [ ] Load images
- [ ] Test contact form (if applicable)
- [ ] Test quote request (if applicable)
- [ ] Access admin at `/admin/` link from frontend

### Test Admin Interface
- [ ] Login at `https://cedric-houseplan-backend.onrender.com/admin/`
- [ ] View house plans in admin
- [ ] Create new house plan
- [ ] Edit existing house plan
- [ ] Upload images
- [ ] View contacts/quotes/purchases
- [ ] Logout successfully

### API Testing (Postman/Insomnia)
- [ ] GET `/api/core/plans/` → 200 OK, JSON response
- [ ] GET `/api/core/settings/` → 200 OK or 404
- [ ] POST `/api/core/contacts/` → 201 or 400 (with validation)
- [ ] Check no CORS errors in responses

### Security Verification
- [ ] Visit `http://cedric-houseplan2.vercel.app` (HTTP)
  - Should redirect to HTTPS
- [ ] Visit `http://cedric-houseplan-backend.onrender.com`
  - Should redirect to HTTPS
- [ ] Check Security headers (in browser DevTools):
  - [ ] `Strict-Transport-Security` present
  - [ ] `X-Frame-Options` present
  - [ ] `X-Content-Type-Options` present

### CORS & CSRF Testing
- [ ] Frontend makes requests to backend ✅
- [ ] No 403 errors in console ✅
- [ ] No CORS errors in console ✅
- [ ] Form submissions work ✅
- [ ] Admin login works ✅

---

## Phase 6: Monitoring & Maintenance

### Render Monitoring
- [ ] Check Render dashboard daily for errors
- [ ] Monitor logs in Render Events tab
- [ ] Set up email alerts for deployment failures
- [ ] Monitor database connections
- [ ] Check disk usage

### Vercel Monitoring
- [ ] Check Vercel dashboard for build issues
- [ ] Set up email alerts for failed deployments
- [ ] Monitor analytics (if available)
- [ ] Check error tracking

### Database Monitoring
- [ ] Check Supabase dashboard
- [ ] Monitor database connections
- [ ] Check storage usage
- [ ] Monitor backups

### Error Tracking
- [ ] Check browser console for client errors
- [ ] Check Render logs for server errors
- [ ] Monitor API response times
- [ ] Track failed requests

---

## Phase 7: Post-Deployment

### Documentation Updates
- [ ] Update README with production URLs
- [ ] Document deployment process for future reference
- [ ] Keep DEPLOYMENT_GUIDE.md updated
- [ ] Document any custom configurations

### Security Review
- [ ] Rotate database password if needed
- [ ] Update SECRET_KEY if exposed
- [ ] Enable additional security features if available
- [ ] Review user permissions

### Backup Strategy
- [ ] Enable automatic database backups
- [ ] Test restore procedure
- [ ] Document backup locations
- [ ] Schedule backup verification

### Team Communication
- [ ] Notify team of deployment
- [ ] Share production URLs
- [ ] Document any new processes
- [ ] Schedule post-deployment review

---

## 🚨 Troubleshooting Reference

### If Backend Won't Deploy
1. Check Render build logs for errors
2. Verify environment variables in Render dashboard
3. Check database connection (use provided credentials)
4. Verify Python version and dependencies in `requirements.txt`
5. Check disk space on Render

### If Frontend Won't Load
1. Check Vercel build logs
2. Verify environment variables in Vercel dashboard
3. Check that backend is running and accessible
4. Verify CORS settings on backend

### If Getting CORS Errors
1. Verify `FRONTEND_URL` environment variable on Render
2. Ensure it exactly matches Vercel domain
3. Check `CORS_ALLOWED_ORIGINS` in settings.py
4. Refresh browser and try again

### If Getting 403 CSRF Errors
1. Verify `CSRF_TRUSTED_ORIGINS` includes frontend domain
2. Check that `CSRF_COOKIE_SECURE` is enabled
3. Verify cookies are being sent with requests
4. Check browser DevTools Network tab for cookie headers

### If Admin Won't Login
1. Verify `DEBUG=False` works (it should with HTTPS)
2. Check database is properly connected
3. Verify user credentials are correct
4. Check session settings in Django admin logs

---

## ✨ Sign-Off

- [ ] All tests passed
- [ ] Production working as expected
- [ ] Team notified
- [ ] Documentation complete
- [ ] Backups configured
- [ ] Monitoring in place

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Reviewed By:** _______________  

---

**Keep this checklist for future deployments and updates!**
