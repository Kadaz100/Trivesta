const express = require('express');
const auth = require('../middleware/auth');
const Investment = require('../models/Investment');
const User = require('../models/User');
const { verifyTransaction } = require('../utils/cryptoUtils');
const router = express.Router();

// Get wallet addresses for payment
router.get('/addresses', (req, res) => {
  res.json({
    addresses: {
      USDT: process.env.USDT_WALLET_ADDRESS || '',
      BTC: process.env.BTC_WALLET_ADDRESS || '',
      ETH: process.env.ETH_WALLET_ADDRESS || '',
      SOL: process.env.SOL_WALLET_ADDRESS || '',
    },
  });
});

// Get investment plans
router.get('/plans', (req, res) => {
  res.json({
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        minAmount: 500,
        maxAmount: 5000,
        duration: 30,
        label: null,
      },
      {
        id: 'premium',
        name: 'Premium',
        minAmount: 5000,
        maxAmount: 20000,
        duration: 90,
        label: 'Most Popular',
      },
      {
        id: 'exclusive',
        name: 'Exclusive',
        minAmount: 20000,
        maxAmount: 50000,
        duration: 180,
        label: null,
      },
      {
        id: 'presale',
        name: 'Presale',
        minAmount: 50000,
        maxAmount: 500000,
        duration: 365,
        label: 'Best Value',
      },
    ],
  });
});

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const investments = await Investment.findByUserId(req.userId);
    
    let totalLocked = 0;
    let totalCurrent = 0;
    let activeInvestments = 0;

    investments.forEach(inv => {
      const investment = new Investment(inv);
      const currentValue = investment.getCurrentValue();
      totalLocked += inv.tvsLocked;
      totalCurrent += currentValue.currentValue;
      if (currentValue.daysRemaining > 0) {
        activeInvestments++;
      }
    });

    res.json({
      stats: {
        totalLocked,
        totalCurrent,
        totalGrowth: totalCurrent - totalLocked,
        growthPercentage: totalLocked > 0 ? ((totalCurrent - totalLocked) / totalLocked) * 100 : 0,
        activeInvestments,
        totalInvestments: investments.length,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pay gas fee (supports partial payments)
router.post('/pay-gas-fee', auth, async (req, res) => {
  try {
    const { crypto, txHash, amount } = req.body;

    // Validation
    if (!crypto || !txHash) {
      return res.status(400).json({ error: 'Missing required fields: crypto and txHash' });
    }

    // Get user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if gas fee is set
    if (!user.gasFee || user.gasFee <= 0) {
      return res.status(400).json({ error: 'Gas fee not set for this user' });
    }

    // Check if already fully paid
    if (user.gasFeePaid || (user.gasFeePaidAmount || 0) >= user.gasFee) {
      return res.status(400).json({ error: 'Gas fee has already been fully paid' });
    }

    // Verify transaction
    const walletAddresses = {
      USDT: process.env.USDT_WALLET_ADDRESS,
      BTC: process.env.BTC_WALLET_ADDRESS,
      ETH: process.env.ETH_WALLET_ADDRESS,
      SOL: process.env.SOL_WALLET_ADDRESS,
    };

    const recipientAddress = walletAddresses[crypto.toUpperCase()];
    if (!recipientAddress) {
      return res.status(400).json({ error: 'Invalid cryptocurrency' });
    }

    // For partial payments, don't pass expected amount - accept whatever was sent
    const remainingBalance = user.gasFee - (user.gasFeePaidAmount || 0);

    // Verify transaction WITHOUT amount check (to allow partial payments)
    const verification = await verifyTransaction(
      crypto,
      txHash,
      null, // Don't check amount - accept any partial payment
      recipientAddress
    );

    if (!verification.valid) {
      return res.status(400).json({ 
        error: 'Transaction verification failed',
        details: verification.error 
      });
    }

    // Get the actual amount paid from verification
    const paidAmount = verification.amount;
    
    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid payment amount',
        details: 'Transaction amount must be greater than 0'
      });
    }
    
    // Ensure payment doesn't exceed remaining balance
    if (paidAmount > remainingBalance) {
      return res.status(400).json({ 
        error: 'Payment exceeds remaining balance',
        details: `You sent $${paidAmount.toFixed(2)} but only $${remainingBalance.toFixed(2)} is needed`
      });
    }

    // Update paid amount (accumulate)
    const currentPaidAmount = user.gasFeePaidAmount || 0;
    const newPaidAmount = currentPaidAmount + paidAmount;
    
    console.log('[Gas Fee Payment] Current paid:', currentPaidAmount);
    console.log('[Gas Fee Payment] Paid amount:', paidAmount);
    console.log('[Gas Fee Payment] New total:', newPaidAmount);
    console.log('[Gas Fee Payment] Total gas fee:', user.gasFee);
    
    user.gasFeePaidAmount = newPaidAmount;
    
    // Check if fully paid
    if (newPaidAmount >= user.gasFee) {
      user.gasFeePaid = true;
      user.gasFeePaidAmount = user.gasFee; // Cap at full amount
    }

    await user.save();

    const remaining = Math.max(0, user.gasFee - user.gasFeePaidAmount);

    console.log('[Gas Fee Payment] After save - totalPaid:', user.gasFeePaidAmount);
    console.log('[Gas Fee Payment] After save - remaining:', remaining);
    console.log('[Gas Fee Payment] After save - fullyPaid:', user.gasFeePaid);

    res.json({
      message: 'Gas fee payment successful',
      paidAmount: paidAmount,
      totalPaid: user.gasFeePaidAmount,
      remaining: remaining,
      fullyPaid: user.gasFeePaid,
    });
  } catch (error) {
    console.error('Pay gas fee error:', error);
    res.status(500).json({ error: 'Server error during gas fee payment' });
  }
});

module.exports = router;

