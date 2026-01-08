# 🚀 How to Update Your Render Deployment

## Quick Fix: Manual Redeploy

Since you pushed to GitHub but don't see updates on Render, you need to trigger a redeploy:

### Step 1: Go to Render Dashboard
1. Visit: https://dashboard.render.com
2. Log in to your account
3. Find your backend service: **trivesta-backend**

### Step 2: Trigger Manual Redeploy
1. Click on your **trivesta-backend** service
2. Look for the **"Manual Deploy"** button (usually at the top)
3. Click **"Deploy latest commit"** or **"Redeploy"**
4. Wait 2-3 minutes for the deployment to complete

### Step 3: Verify Updates
After deployment completes, check:
- Admin panel: `https://trivesta-backend.onrender.com/admin-panel.html`
- Test the new features:
  - Consolidated investments
  - 50% growth rate for $200+ investments
  - Duration update feature

---

## What Was Updated

✅ **Growth Rate:** 50% daily for investments over $200  
✅ **Consolidated View:** All investments combined into one  
✅ **Duration Update:** Easy admin panel feature to change investment duration  

---

## Troubleshooting

### If redeploy doesn't work:
1. Check the **Logs** tab in Render dashboard for errors
2. Make sure your GitHub repo is connected correctly
3. Verify the branch is set to `main`

### If you see errors:
- Check that all environment variables are set
- Make sure `ADMIN_PASSWORD` is configured
- Check the deployment logs for specific errors

---

## Auto-Deploy Setup (If Not Already Enabled)

1. Go to your service settings
2. Check **"Auto-Deploy"** is enabled
3. Make sure it's connected to the correct GitHub repo and branch (`main`)

After this, future pushes to GitHub will automatically deploy!



