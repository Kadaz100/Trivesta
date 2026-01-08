# TVS Growth - How It Works

## The Problem You Had

The original code used `Math.floor()` which rounded down days to whole numbers:
- **0-23 hours old** → 0 days → **0% growth** ❌
- **24-47 hours old** → 1 day → **0.5% growth** ✓
- **48-71 hours old** → 2 days → **1.0% growth** ✓

This meant you couldn't see ANY growth until a full 24 hours passed!

## The Fix

Changed to calculate growth with **decimal days** (no rounding):
- **1 hour old** → 0.042 days → **0.021% growth** ✓
- **6 hours old** → 0.25 days → **0.125% growth** ✓
- **12 hours old** → 0.5 days → **0.25% growth** ✓
- **24 hours old** → 1 day → **0.5% growth** ✓

Now you see growth **immediately** and it updates continuously!

## Real-Time Growth Examples

### Your 100 TVS Investment

| Time Passed | Days Elapsed | Growth % | Current TVS | Increase |
|-------------|--------------|----------|-------------|----------|
| **Just created** | 0 | 0% | 100.0000 | +0.0000 |
| **1 hour** | 0.0417 | 0.0208% | 100.0208 | +0.0208 |
| **6 hours** | 0.25 | 0.125% | 100.1250 | +0.1250 |
| **12 hours** | 0.5 | 0.25% | 100.2500 | +0.2500 |
| **1 day** | 1 | 0.5% | 100.5000 | +0.5000 |
| **3 days** | 3 | 1.5% | 101.5000 | +1.5000 |
| **7 days** | 7 | 3.5% | 103.5000 | +3.5000 |
| **14 days** | 14 | 7.0% | 107.0000 | +7.0000 |
| **30 days** | 30 | 15.0% | 115.0000 | +15.0000 |
| **60 days** | 60 | 30.0% | 130.0000 | +30.0000 |
| **90 days** | 90 | 45.0% | 145.0000 | +45.0000 |

## How to See Growth NOW

### 1. Restart Backend
```bash
cd backend
npm run dev
```

Watch the console for growth calculations every time the wallet refreshes:
```
[Investment abc123] Growth calc: {
  startDate: '2025-11-20T08:00:00.000Z',
  now: '2025-11-20T09:00:00.000Z',
  daysElapsed: '0.0417',
  growthMultiplier: '1.000208',
  currentValue: '100.02',
  growthPercentage: '0.0208'
}
```

### 2. Open Your Wallet
The page now:
- Auto-refreshes **every 10 seconds**
- Shows growth with **4 decimal places** (0.0208%)
- Displays TVS with **2 decimal places** (100.02 TVS)
- Has a bouncing ↑ arrow showing active growth

### 3. Watch It Grow
Open your browser console (`F12`) and you'll see:
```
[Wallet] Auto-refreshing data...
```

Every 10 seconds, the values will update:
- **0:00** - 100.0000 TVS
- **0:10** - 100.0035 TVS (+0.0035)
- **0:20** - 100.0069 TVS (+0.0069)
- **0:30** - 100.0104 TVS (+0.0104)
- **1:00** - 100.0208 TVS (+0.0208)

## Growth Formula

```javascript
Growth Rate = 0.5% per day = 0.005 per day

Days Elapsed = (Current Time - Start Time) / 86400 seconds

Growth Multiplier = 1 + (0.005 × Days Elapsed)

Current TVS = Initial TVS × Growth Multiplier
```

### Example Calculation (1 hour = 0.0417 days)
```javascript
Initial TVS = 100
Days Elapsed = 0.0417
Growth Multiplier = 1 + (0.005 × 0.0417) = 1.0002083
Current TVS = 100 × 1.0002083 = 100.02083 TVS
Growth % = 0.02083%
```

## What You'll See on Wallet Page

### Dashboard Stats (Top)
```
Total Locked       Current Value       Total Growth
100.00 TVS         100.02 TVS          +0.0208%
                   +0.0200 TVS          0.5% daily
```

### Investment Card
```
Investment: 10 USDT ≈ $10
Locked TVS: 100.00 TVS
Current Value: 100.02 TVS ↑
Growth: +0.0208%
        0.5% per day
Time Remaining: 89d 23h 45m
```

### Progress Bars
- **Time Progress**: Shows how much of the 90-day period has passed
- **Growth Progress**: Shows the green growth bar filling up

## Backend Logs to Watch

When you refresh your wallet, the backend logs show:
```
[Investment xyz] Growth calc: {
  startDate: '2025-11-20T08:00:00.000Z',
  now: '2025-11-20T09:15:00.000Z',
  daysElapsed: '0.0521',       ← Decimal days
  daysElapsedRounded: 0,       ← Would have been 0 with old code
  daysRemaining: '89.95',
  tvsLocked: 100,
  growthRate: 0.5,
  growthMultiplier: '1.000260', ← 1 + (0.005 × 0.0521)
  currentValue: '100.03',       ← Growing!
  growthPercentage: '0.0260'    ← 0.026%
}
```

## Why It Might Look Slow

Growth **is happening**, but 0.5% per day is intentionally gradual:
- **Per hour**: 0.02% (very small)
- **Per minute**: 0.0003% (tiny)
- **Per 10 seconds**: 0.00006% (microscopic)

But over time it adds up:
- **1 week**: 3.5%
- **1 month**: 15%
- **3 months**: 45%

## Testing Growth Quickly

Want to see bigger numbers? Temporarily change the growth rate:

### In `backend/routes/investments.js` line 105:
```javascript
// Before
growthRate: 0.5, // 0.5% daily

// Test with 10% daily (grows 20x faster!)
growthRate: 10, // 10% daily - TESTING ONLY
```

After 1 hour with 10% daily:
- 0.0417 days × 10% = **0.417% growth**
- 100 TVS becomes **100.42 TVS**
- Much more visible!

**Remember to change it back to 0.5 for production!**

## Summary

✅ **Growth is working** - just very gradual at 0.5% daily  
✅ **You can see it now** - shows decimal places and refreshes every 10 sec  
✅ **Backend logs it** - watch console for real-time calculations  
✅ **Formula is correct** - 1 + (0.005 × days_elapsed)  

The growth is **real and accumulating**, just designed to be steady and long-term!


