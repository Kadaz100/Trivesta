# Quick Setup Guide

## Step 1: Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Firebase credentials are already copied** to `backend/firebase-credentials.json`

4. **Create `.env` file** in the backend folder:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   TVS_RATE=10

   # Replace with your actual wallet addresses
   USDT_WALLET_ADDRESS=0x0000000000000000000000000000000000000000
   BTC_WALLET_ADDRESS=bc1q000000000000000000000000000000000000
   ETH_WALLET_ADDRESS=0x0000000000000000000000000000000000000000
   SOL_WALLET_ADDRESS=0000000000000000000000000000000000000000000

   # Optional explorer configuration
   ETH_RPC_URL=https://rpc.ankr.com/eth
   USDT_CONTRACT_ADDRESS=0xdAC17F958D2ee523a2206206994597C13D831ec7

   # Set to true during development to bypass blockchain verification
   SKIP_TX_VERIFICATION=true
   ```

5. **Start the backend:**
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

## Step 2: Frontend Setup

1. **Open a new terminal and navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file** in the frontend folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## Step 3: Access the Application

1. Open your browser and go to `http://localhost:3000`
2. You'll see the Login/Signup page
3. Create an account or login
4. Start exploring the platform!

## Important Notes

- Make sure both backend and frontend are running simultaneously
- The backend must be running before the frontend can make API calls
- Firebase credentials are already set up, so authentication should work immediately
- Replace the wallet addresses in `.env` with your actual addresses for production

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify Firebase credentials file exists
- Check `.env` file is properly formatted

### Frontend won't start
- Check if port 3000 is already in use
- Verify `.env.local` file exists
- Make sure backend is running first

### API calls failing
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check browser console for errors

## Next Steps

1. Replace wallet addresses with real addresses
2. Set up blockchain explorer API keys for transaction verification
3. Configure production environment variables
4. Deploy to your preferred hosting platform

