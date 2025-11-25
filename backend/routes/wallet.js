const express = require('express');
const auth = require('../middleware/auth');
const Investment = require('../models/Investment');
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
        minAmount: 100,
        maxAmount: 1000,
        duration: 30,
        label: null,
      },
      {
        id: 'premium',
        name: 'Premium',
        minAmount: 1500,
        maxAmount: 5000,
        duration: 90,
        label: 'Most Popular',
      },
      {
        id: 'exclusive',
        name: 'Exclusive',
        minAmount: 10000,
        maxAmount: 35000,
        duration: 180,
        label: null,
      },
      {
        id: 'presale',
        name: 'Presale',
        minAmount: 3000,
        maxAmount: 100000,
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

module.exports = router;

