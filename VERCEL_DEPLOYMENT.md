# Deploy Trivesta to Vercel

## Step 1: Sign Up/Login to Vercel

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

## Step 2: Import Your Repository

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find **"Kadaz100/Trivesta"** in the list
3. Click **"Import"**

## Step 3: Configure Project Settings

### Root Directory
- Set **Root Directory** to: `frontend`
- This tells Vercel your Next.js app is in the frontend folder

### Build Settings (should auto-detect)
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Environment Variables (IMPORTANT!)

Click **"Environment Variables"** and add these:

```
NEXT_PUBLIC_API_URL=https://trivesta-backend.railway.app/api
```

(We'll deploy backend to Railway next and update this URL)

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://trivesta-xyz123.vercel.app`

## Step 5: Deploy Backend to Railway

### Go to Railway
1. Visit https://railway.app/
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select **"Kadaz100/Trivesta"**

### Configure Backend
1. **Root Directory**: Set to `backend`
2. **Start Command**: `npm start`

### Add Environment Variables

Add ALL these to Railway:

```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
TVS_RATE=10

# Your Wallet Addresses
BTC_WALLET_ADDRESS=bc1q8wa0xp6vyq7e63y6tg4pam38muhtrhwmsv6n2r
ETH_WALLET_ADDRESS=0xfbB9c2C5D0BEc57780B15F8Da5C0185fB81f00Ab
SOL_WALLET_ADDRESS=AkD7drEtQTamvGcakXSvX7jTjsk7yVsuGrJR4TnNgqnR
USDT_WALLET_ADDRESS=0xfbB9c2C5D0BEc57780B15F8Da5C0185fB81f00Ab

# Blockchain Verification
ETH_RPC_URL=https://eth.llamarpc.com
USDT_CONTRACT_ADDRESS=0xdAC17F958D2ee523a2206206994597C13D831ec7
SKIP_TX_VERIFICATION=false

# Firebase (COPY FROM YOUR LOCAL backend/.env or firebase-credentials.json)
FIREBASE_PROJECT_ID=trivesta-6de08
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKey\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@trivesta-6de08.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
```

### Get Your Backend URL
After deployment, Railway gives you a URL like:
`https://trivesta-backend-production.up.railway.app`

### Update Vercel Environment Variable
1. Go back to Vercel project settings
2. Update `NEXT_PUBLIC_API_URL` to your Railway URL + `/api`
3. Example: `https://trivesta-backend-production.up.railway.app/api`
4. Redeploy the frontend

## Step 6: Custom Domain (Optional)

### On Vercel:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `trivesta.com`)
3. Follow DNS instructions

### On Railway:
1. Settings → Networking → Custom Domain
2. Add `api.trivesta.com` for backend

## Testing Your Live Site

1. **Visit your Vercel URL** (frontend)
2. **Sign up** for an account
3. **Go to Invest page**
4. **Make a test investment** (use a small amount)
5. **Check Wallet page** - you should see TVS growing!

## Troubleshooting

### "API Connection Failed"
- Check `NEXT_PUBLIC_API_URL` in Vercel settings
- Make sure Railway backend is running
- Check Railway logs for errors

### "Firebase Error"
- Make sure all Firebase env vars are set correctly in Railway
- Private key must include quotes and `\n` for newlines

### "Transaction Verification Failed"
- Set `SKIP_TX_VERIFICATION=true` in Railway for testing
- Or ensure `ETH_RPC_URL` is working

## URLs Summary

After deployment you'll have:

- **Frontend**: `https://trivesta-xyz.vercel.app` (public, no login needed to view)
- **Backend**: `https://trivesta-backend.up.railway.app`
- **GitHub**: `https://github.com/Kadaz100/Trivesta`

## Free Tier Limits

- **Vercel**: Unlimited bandwidth, 100GB/month
- **Railway**: $5 free credit/month (~500 hours)
- Both are plenty for testing and moderate traffic!

---

Your site is now LIVE and anyone can visit it! 🚀

