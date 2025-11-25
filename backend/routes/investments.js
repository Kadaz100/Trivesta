const express = require('express');
const auth = require('../middleware/auth');
const Investment = require('../models/Investment');
const User = require('../models/User');
const { verifyTransaction } = require('../utils/cryptoUtils');
const router = express.Router();

// Get all investments for current user
router.get('/', auth, async (req, res) => {
  try {
    const investments = await Investment.findByUserId(req.userId);
    
    // Calculate current values for each investment
    const investmentsWithValues = investments.map(inv => {
      const investment = new Investment(inv);
      const currentValue = investment.getCurrentValue();
      return {
        ...inv,
        ...currentValue,
        startTime: inv.startTime.toDate ? inv.startTime.toDate() : inv.startTime,
        createdAt: inv.createdAt.toDate ? inv.createdAt.toDate() : inv.createdAt,
      };
    });

    res.json({ investments: investmentsWithValues });
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new investment
router.post('/', auth, async (req, res) => {
  try {
    const { plan, amount, crypto, txHash, duration } = req.body;

    // Validation
    if (!plan || !amount || !crypto || !txHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for duplicate transaction hash
    const existingInvestments = await Investment.findByUserId(req.userId);
    const duplicate = existingInvestments.find(inv => inv.txHash === txHash);
    if (duplicate) {
      return res.status(400).json({ 
        error: 'This transaction has already been used for an investment',
        details: 'Transaction hash already exists'
      });
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

    // Verify transaction (in production, you'd want to verify the amount too)
    const verification = await verifyTransaction(
      crypto,
      txHash,
      amount,
      recipientAddress
    );

    if (!verification.valid) {
      return res.status(400).json({ 
        error: 'Transaction verification failed',
        details: verification.error 
      });
    }

    // Calculate TVS locked (using conversion rate)
    const tvsRate = parseFloat(process.env.TVS_RATE || '10');
    const tvsLocked = amount * tvsRate;

    // Determine duration based on plan
    let investmentDuration = duration;
    if (!investmentDuration) {
      const planDurations = {
        basic: 30,
        premium: 90,
        exclusive: 180,
        presale: 365,
      };
      investmentDuration = planDurations[plan.toLowerCase()] || 30;
    }

    // Get actual crypto amount from verification (already verified above)
    const cryptoAmount = verification.amount || amount;

    // Create investment
    const investment = new Investment({
      userId: req.userId,
      plan,
      amount,
      cryptoAmount, // Store actual crypto amount
      crypto: crypto.toUpperCase(),
      txHash,
      tvsLocked,
      duration: investmentDuration,
      growthRate: 0.5, // 0.5% daily
      status: 'locked',
    });

    await investment.save();

    // Update user's investments array
    const user = await User.findById(req.userId);
    if (user) {
      user.investments.push(investment._id);
      await user.save();
    }

    res.status(201).json({
      message: 'Investment created successfully',
      investment: {
        ...investment,
        _id: investment._id,
      },
    });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get investment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    // Check if investment belongs to user
    if (investment.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const inv = new Investment(investment);
    const currentValue = inv.getCurrentValue();

    res.json({
      investment: {
        ...investment,
        ...currentValue,
        startTime: investment.startTime.toDate ? investment.startTime.toDate() : investment.startTime,
        createdAt: investment.createdAt.toDate ? investment.createdAt.toDate() : investment.createdAt,
      },
    });
  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete investment by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    // Check if investment belongs to user
    if (investment.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete from database
    await Investment.delete(req.params.id);

    // Remove from user's investments array
    const user = await User.findById(req.userId);
    if (user) {
      user.investments = user.investments.filter(invId => invId !== req.params.id);
      await user.save();
    }

    res.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Delete investment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

