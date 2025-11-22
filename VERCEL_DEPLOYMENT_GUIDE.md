# Deploying GGTL LMS Frontend to Vercel

## ✅ Prerequisites

- ✅ Laravel API deployed to Railway: `https://ggtllmsapi-production.up.railway.app`
- ✅ Frontend configured to use Railway API
- ✅ GitHub repository: `gifamzict/ggtl_lms`

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Login or Sign up

2. **Import Project**
   - Click "Add New" → "Project"
   - Select "Import Git Repository"
   - Authorize Vercel to access your GitHub
   - Select `gifamzict/ggtl_lms` repository

3. **Configure Project**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Environment Variables**
   Add these environment variables:
   ```
   VITE_API_URL=https://ggtllmsapi-production.up.railway.app/api
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_a88eed026b20662ed411de5ab2351008f35417d9
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - You'll get a URL like: `ggtl-lms.vercel.app`

---

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project
cd /Users/quovatech/Documents/ggtl_lms

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# ? Set up and deploy? Yes
# ? Which scope? Your account
# ? Link to existing project? No
# ? What's your project's name? ggtl-lms
# ? In which directory is your code located? ./
# ? Want to override settings? No

# Deploy to production
vercel --prod
```

---

## 🔧 Post-Deployment Configuration

### 1. Update Laravel API CORS Settings

Once you have your Vercel domain (e.g., `ggtl-lms.vercel.app`), update the Railway API environment variables:

**In Railway Dashboard → ggtl-lms-api service → Variables:**

```
FRONTEND_URL=https://ggtl-lms.vercel.app
CORS_ALLOWED_ORIGINS=https://ggtl-lms.vercel.app,https://ggtl-lms.vercel.app/*
SANCTUM_STATEFUL_DOMAINS=ggtl-lms.vercel.app
```

### 2. Custom Domain (Optional)

If you want to use a custom domain (e.g., `ggtl.tech`):

**In Vercel:**
1. Go to Project Settings → Domains
2. Add your domain
3. Update your DNS records at Namecheap:
   ```
   Type: CNAME
   Host: @
   Value: cname.vercel-dns.com
   ```

**In Railway:**
Update CORS settings with your custom domain:
```
FRONTEND_URL=https://ggtl.tech
CORS_ALLOWED_ORIGINS=https://ggtl.tech,https://www.ggtl.tech
```

---

## ✅ Testing Your Deployment

### 1. Test Frontend
Visit your Vercel URL: `https://ggtl-lms.vercel.app`

### 2. Test API Connection
Open browser console and check:
- Network tab should show API calls to `ggtllmsapi-production.up.railway.app`
- No CORS errors
- API responses are successful

### 3. Test Features
- ✅ User registration
- ✅ User login
- ✅ Browse courses
- ✅ Course details
- ✅ Admin login (if applicable)

---

## 🐛 Troubleshooting

### CORS Errors
**Problem:** Requests blocked by CORS policy

**Solution:**
1. Check Railway API environment variables
2. Ensure `CORS_ALLOWED_ORIGINS` includes your Vercel domain
3. Redeploy Railway API if you made changes

### API Connection Failed
**Problem:** Cannot connect to API

**Solution:**
1. Verify `VITE_API_URL` in Vercel environment variables
2. Test API directly: `https://ggtllmsapi-production.up.railway.app/up`
3. Check Railway API logs for errors

### Build Failed on Vercel
**Problem:** Deployment fails during build

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Run `npm run build` locally to test

---

## 📊 Monitoring

- **Frontend:** Vercel Dashboard → Analytics
- **Backend:** Railway Dashboard → Metrics & Logs
- **Errors:** Check browser console for frontend errors

---

## 🎉 Success!

Your GGTL LMS is now live:
- **Frontend:** https://ggtl-lms.vercel.app (or your custom domain)
- **Backend API:** https://ggtllmsapi-production.up.railway.app

Happy teaching! 🎓
