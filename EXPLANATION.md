# System Explanation

## 1. Actual Crypto Amounts (Not Dummy Data)

### What Changed
The system now stores and displays **real crypto amounts** from blockchain verification:

- When you invest 10 USDT, the system verifies the transaction on-chain
- It reads the actual amount from the blockchain (10 USDT in your case)
- Stores both:
  - `amount`: USD value for calculations
  - `cryptoAmount`: Actual crypto sent (e.g., 10 USDT, 0.0003 BTC, etc.)
- Displays: **"10 USDT" ≈ $10**

### In Your Wallet
You'll now see:
```
Investment: 10 USDT
           ≈ $10
```

Instead of just "$10". This shows the **real blockchain amount**, not dummy/estimated data.

---

## 2. TVS Growth - Is It Really Growing?

### YES! Here's How It Works:

#### Growth Formula
```javascript
Daily Growth Rate: 0.5%
Days Elapsed = (Current Time - Start Time) / 24 hours
Growth Multiplier = 1 + (0.5% × Days Elapsed)
Current TVS Value = Locked TVS × Growth Multiplier
```

#### Real Example (Your $10 Investment):
- **Initial**: 100 TVS (10 USD × 10 TVS rate)
- **After 1 day**: 100.5 TVS (+0.5%)
- **After 7 days**: 103.5 TVS (+3.5%)
- **After 30 days**: 115 TVS (+15%)
- **After 90 days**: 145 TVS (+45%)

#### Why You See Growth
1. **Auto-refresh**: Page updates every 30 seconds
2. **Backend calculation**: Uses real timestamps from Firestore
3. **Console logging**: Backend shows growth math in real-time

Check your backend console for lines like:
```
[Investment abc123] Growth calc: {
  daysElapsed: 0.5,
  growthMultiplier: 1.0025,
  currentValue: 100.25,
  growthPercentage: 0.25
}
```

### Visual Indicators
- **Green ↑ arrow**: Animates to show active growth
- **Growth progress bar**: Shows percentage increase
- **Current Value updates**: Changes every refresh

---

## 3. Withdraw Button

### How It Works

#### When Locked (Days Remaining > 0):
```
Button shows: 🔒 Locked (gray, disabled)
Click shows alert:
  "Cannot withdraw yet!
   Your investment is still locked for X days.
   Lock period: 90 days
   Time remaining: 89d 23h 45m"
```

#### When Unlocked (Days Remaining = 0):
```
Button shows: 💰 Withdraw TVS (green, active)
Click shows:
  "Withdrawal Available!
   You can now withdraw:
   • 145 TVS
   • Initial: 100 TVS
   • Growth: +45%"
```

### Currently
- Shows proper locked/unlocked state
- Displays days remaining
- Prevents withdrawal during lock period
- Ready for actual withdrawal implementation later

---

## 4. USDT Contract Address - What's It For?

### Purpose
`USDT_CONTRACT_ADDRESS` in `.env` is used for **ERC-20 token verification** on Ethereum.

### Why You Need It

#### USDT is a Token, Not Native Crypto
- ETH transactions go directly: `wallet A → wallet B`
- USDT transactions go through a contract: `wallet A → USDT Contract → wallet B`

#### The Verification Process
When you submit a USDT transaction hash:

1. Backend calls Ethereum RPC: "Get transaction receipt for hash X"
2. Receipt contains logs from the USDT contract
3. Backend searches logs for:
   ```javascript
   log.address === USDT_CONTRACT_ADDRESS  // Must be USDT contract
   log.topics[0] === Transfer event signature
   log.topics[2] === Your wallet address (recipient)
   log.data === Amount sent
   ```

#### If Wrong/Missing
- System can't find USDT transfer logs
- Verification fails with "USDT transfer event not found"
- Your investment gets rejected

### Default Value
```env
USDT_CONTRACT_ADDRESS=0xdAC17F958D2ee523a2206206994597C13D831ec7
```
This is USDT's official Ethereum mainnet contract.

### Should You Delete It?
**NO!** Keep it. Without it:
- USDT verification breaks
- Only native crypto (ETH, BTC, SOL) would work
- Any USDT investment would fail

### When to Change It
- Using a different blockchain (e.g., BSC, Polygon)
- Using testnet USDT
- Using a different stablecoin

Otherwise, **leave the default value**.

---

## 5. Environment Variables Summary

### Required Variables
```env
# Server basics
PORT=5000
JWT_SECRET=your_secret_key
TVS_RATE=10  # 1 USD = 10 TVS

# Your wallet addresses (where users send funds)
USDT_WALLET_ADDRESS=0xYourAddress
BTC_WALLET_ADDRESS=bc1qYourAddress
ETH_WALLET_ADDRESS=0xYourAddress
SOL_WALLET_ADDRESS=YourSolAddress

# Blockchain verification
ETH_RPC_URL=https://eth.llamarpc.com  # Free Ethereum RPC
USDT_CONTRACT_ADDRESS=0xdAC17F958D2ee523a2206206994597C13D831ec7

# Development bypass (set to false for production)
SKIP_TX_VERIFICATION=false
```

### Optional Variables
```env
# If you have an Etherscan API key (for rate limits)
ETHERSCAN_API_KEY=your_key

# If using custom USDT contract (different chain)
USDT_CONTRACT_ADDRESS=0xCustomContract
```

---

## 6. Complete Investment Flow

### Step 1: User Invests
- Selects plan or custom amount
- Chooses crypto (USDT/BTC/ETH/SOL)
- Sends from external wallet → your configured wallet
- Pastes transaction hash

### Step 2: Backend Verification
```javascript
if (SKIP_TX_VERIFICATION === 'false') {
  // Real verification
  1. Fetch transaction receipt from blockchain
  2. Check recipient matches your wallet
  3. For USDT: Find Transfer log from USDT contract
  4. For ETH/BTC/SOL: Check transaction 'to' address
  5. Extract actual amount sent
  6. Compare with requested amount
}
```

### Step 3: Create Investment
```javascript
const investment = {
  amount: 10,  // USD value
  cryptoAmount: 10,  // Actual USDT from blockchain
  crypto: 'USDT',
  txHash: '0x3854...',
  tvsLocked: 100,  // 10 USD × 10 rate
  duration: 90,  // days
  startTime: now,
  growthRate: 0.5,  // % per day
  status: 'locked'
}
```

### Step 4: Real-Time Growth
Every backend call recalculates:
```javascript
daysElapsed = (now - startTime) / 86400
growthMultiplier = 1 + (0.5% × daysElapsed)
currentValue = 100 TVS × growthMultiplier
```

Frontend auto-refreshes every 30 seconds to show updates.

### Step 5: Withdrawal (After Lock Period)
- Button becomes active
- User clicks "Withdraw TVS"
- (Future: Actually transfer TVS tokens to their wallet)

---

## Testing Checklist

✅ **Crypto amounts**: Should show "10 USDT ≈ $10", not just "$10"  
✅ **TVS growth**: Check backend console for growth logs, values should increase over time  
✅ **Withdraw button**: Shows locked if days remaining > 0, unlocked if = 0  
✅ **No duplicates**: Same transaction hash can't be used twice  
✅ **USDT verification**: Uses contract address to find Transfer events  

---

## Quick Start After Changes

1. **Backend** (restart to load changes):
   ```bash
   cd backend
   npm run dev
   ```

2. **Check console** for growth calculations:
   ```
   [Investment xyz] Growth calc: { daysElapsed: 1, currentValue: 100.5 }
   ```

3. **Frontend** (should hot-reload automatically):
   - See actual crypto amounts
   - Watch TVS grow every 30 seconds
   - Test withdraw button (should say locked for new investments)

4. **Make a new investment**:
   - Use a different transaction hash
   - Backend prevents duplicates now
   - You'll see real crypto amount displayed

---

## Need Help?

- Backend not showing growth? Check Firestore timestamps
- USDT verification failing? Verify `USDT_CONTRACT_ADDRESS` and `ETH_RPC_URL`
- Withdraw not working? Check `daysRemaining` calculation in backend logs




