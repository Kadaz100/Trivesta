const express = require('express');
const User = require('../models/User');
const Investment = require('../models/Investment');
const router = express.Router();

// Simple admin authentication middleware
// IMPORTANT: Change this password in production!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Kadaz100%';

// Log the admin password on startup (for debugging - remove in production)
console.log('[Admin] Admin password configured:', ADMIN_PASSWORD ? '***SET***' : 'NOT SET (using default)');

const adminAuth = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (!password) {
    return res.status(401).json({ error: 'Unauthorized: No password provided' });
  }
  
  // Trim whitespace from both passwords to handle .env file issues
  const trimmedExpected = ADMIN_PASSWORD?.trim();
  const trimmedProvided = password?.trim();
  
  if (trimmedProvided !== trimmedExpected) {
    console.log('[Admin] Failed login attempt.');
    console.log('[Admin] Expected length:', trimmedExpected?.length || 0, 'Got length:', trimmedProvided?.length || 0);
    console.log('[Admin] Expected first 3 chars (hex):', trimmedExpected?.substring(0, 3).split('').map(c => c.charCodeAt(0).toString(16)).join(' '));
    console.log('[Admin] Got first 3 chars (hex):', trimmedProvided?.substring(0, 3).split('').map(c => c.charCodeAt(0).toString(16)).join(' '));
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid password',
      hint: `Password length should be ${trimmedExpected?.length || 0} characters. Check for hidden spaces or special characters.`
    });
  }
  next();
};

// Test endpoint to verify password (for debugging)
router.post('/test-password', (req, res) => {
  const providedPassword = req.body.password || req.headers['x-admin-password'];
  
  // Trim both passwords to handle .env file whitespace issues
  const trimmedExpected = ADMIN_PASSWORD?.trim();
  const trimmedProvided = providedPassword?.trim();
  const isMatch = trimmedProvided === trimmedExpected;
  
  // Show character codes for first 3 chars to debug encoding issues
  const expectedFirst3 = trimmedExpected?.substring(0, 3) || '';
  const providedFirst3 = trimmedProvided?.substring(0, 3) || '';
  
  // Show what password starts with (first 3 chars only for security)
  const expectedHint = trimmedExpected ? trimmedExpected.substring(0, 3) + '...' : 'NOT SET';
  
  res.json({
    match: isMatch,
    expectedLength: trimmedExpected?.length || 0,
    providedLength: trimmedProvided?.length || 0,
    originalExpectedLength: ADMIN_PASSWORD?.length || 0,
    originalProvidedLength: providedPassword?.length || 0,
    firstCharMatch: trimmedExpected?.[0] === trimmedProvided?.[0],
    first3CharsMatch: expectedFirst3 === providedFirst3,
    expectedFirst3Hex: expectedFirst3.split('').map(c => c.charCodeAt(0).toString(16)).join(' '),
    providedFirst3Hex: providedFirst3.split('').map(c => c.charCodeAt(0).toString(16)).join(' '),
    expectedStartsWith: expectedHint,
    hasWhitespaceIssue: ADMIN_PASSWORD?.length !== trimmedExpected?.length || providedPassword?.length !== trimmedProvided?.length,
    message: isMatch ? 'Password is correct!' : `Password does not match. Expected password is ${trimmedExpected?.length || 0} characters and starts with "${expectedHint}"`
  });
});

// Get all users with their basic info
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { db } = require('../firebase-config');
    const usersSnapshot = await db.collection('users').get();
    
    const users = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        email: userData.email,
        name: userData.name || 'N/A',
        referralCode: userData.referralCode || 'N/A',
        createdAt: userData.createdAt?.toDate ? userData.createdAt.toDate() : userData.createdAt,
        investmentCount: userData.investments?.length || 0
      });
    });
    
    res.json({ users, total: users.length });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific user details by email
router.get('/user/:email', adminAuth, async (req, res) => {
  try {
    const user = await User.findByEmail(req.params.email);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's investments
    const investments = await Investment.findByUserId(user._id);
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
      },
      investments: investments.map(inv => ({
        id: inv._id,
        plan: inv.plan,
        amount: inv.amount,
        crypto: inv.crypto,
        txHash: inv.txHash,
        tvsLocked: inv.tvsLocked,
        status: inv.status,
        duration: inv.duration,
        startTime: inv.startTime?.toDate ? inv.startTime.toDate() : inv.startTime,
        createdAt: inv.createdAt?.toDate ? inv.createdAt.toDate() : inv.createdAt,
      }))
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Manually create investment for a user (skip transaction verification)
router.post('/investment/create', adminAuth, async (req, res) => {
  try {
    const { email, plan, amount, crypto, txHash, duration } = req.body;
    
    if (!email || !plan || !amount || !crypto || !txHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check for duplicate transaction hash
    const existingInvestments = await Investment.findByUserId(user._id);
    const duplicate = existingInvestments.find(inv => inv.txHash === txHash);
    if (duplicate) {
      return res.status(400).json({ 
        error: 'This transaction has already been used for an investment'
      });
    }
    
    // Calculate TVS locked
    const tvsRate = parseFloat(process.env.TVS_RATE || '10');
    const tvsLocked = amount * tvsRate;
    
    // Determine growth rate based on investment amount
    // If investment is more than $200, use 50% daily, otherwise 0.5% daily
    const growthRate = parseFloat(amount) > 200 ? 50 : 0.5;
    
    // Create investment (WITHOUT verification)
    const investment = new Investment({
      userId: user._id,
      plan,
      amount,
      cryptoAmount: amount,
      crypto: crypto.toUpperCase(),
      txHash,
      tvsLocked,
      duration: duration || 30,
      growthRate: growthRate,
      status: 'locked',
    });
    
    await investment.save();
    
    // Update user's investments array
    user.investments.push(investment._id);
    await user.save();
    
    res.status(201).json({
      message: 'Investment created successfully (manual)',
      investment: {
        id: investment._id,
        plan: investment.plan,
        amount: investment.amount,
        crypto: investment.crypto,
        txHash: investment.txHash,
        tvsLocked: investment.tvsLocked,
        status: investment.status,
      }
    });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update investment (transaction hash, status, duration, etc.)
router.put('/investment/:investmentId', adminAuth, async (req, res) => {
  try {
    const { txHash, status, duration } = req.body;
    const investment = await Investment.findById(req.params.investmentId);
    
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    if (txHash) investment.txHash = txHash;
    if (status) investment.status = status;
    if (duration !== undefined) {
      investment.duration = parseFloat(duration);
    }
    
    await investment.save();
    
    res.json({
      message: 'Investment updated successfully',
      investment: {
        id: investment._id,
        txHash: investment.txHash,
        status: investment.status,
        duration: investment.duration,
      }
    });
  } catch (error) {
    console.error('Update investment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update investment duration for a user by email
router.put('/user/:email/investment/duration', adminAuth, async (req, res) => {
  try {
    const { duration, investmentId } = req.body;
    
    if (!duration) {
      return res.status(400).json({ error: 'Duration is required' });
    }
    
    const user = await User.findByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const investments = await Investment.findByUserId(user._id);
    
    if (investmentId) {
      // Update specific investment
      const investment = investments.find(inv => inv._id === investmentId);
      if (!investment) {
        return res.status(404).json({ error: 'Investment not found for this user' });
      }
      
      const inv = new Investment(investment);
      inv.duration = parseFloat(duration);
      await inv.save();
      
      return res.json({
        message: 'Investment duration updated successfully',
        investment: {
          id: inv._id,
          duration: inv.duration,
        }
      });
    } else {
      // Update all investments for the user
      const updatedInvestments = [];
      for (const invData of investments) {
        const inv = new Investment(invData);
        inv.duration = parseFloat(duration);
        await inv.save();
        updatedInvestments.push({
          id: inv._id,
          duration: inv.duration,
        });
      }
      
      return res.json({
        message: `Updated ${updatedInvestments.length} investment(s) duration successfully`,
        investments: updatedInvestments,
      });
    }
  } catch (error) {
    console.error('Update investment duration error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update user gas fee
router.put('/user/:email/gas-fee', adminAuth, async (req, res) => {
  try {
    const { gasFee } = req.body;
    
    if (gasFee === undefined || gasFee === null) {
      return res.status(400).json({ error: 'Gas fee amount is required' });
    }
    
    const user = await User.findByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.gasFee = parseFloat(gasFee);
    await user.save();
    
    res.json({
      message: 'Gas fee updated successfully',
      user: {
        email: user.email,
        gasFee: user.gasFee,
      }
    });
  } catch (error) {
    console.error('Update gas fee error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Manually update gas fee paid amount (admin override)
router.put('/user/:email/gas-fee-paid', adminAuth, async (req, res) => {
  try {
    const { paidAmount } = req.body;
    
    if (paidAmount === undefined || paidAmount === null || paidAmount <= 0) {
      return res.status(400).json({ error: 'Valid paid amount is required' });
    }
    
    const user = await User.findByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.gasFee || user.gasFee <= 0) {
      return res.status(400).json({ error: 'User does not have a gas fee set' });
    }
    
    // Add the paid amount to existing amount (accumulate)
    const currentPaid = user.gasFeePaidAmount || 0;
    const newPaidAmount = currentPaid + parseFloat(paidAmount);
    
    // Cap at total gas fee
    user.gasFeePaidAmount = Math.min(newPaidAmount, user.gasFee);
    
    // Mark as fully paid if reached the total
    if (user.gasFeePaidAmount >= user.gasFee) {
      user.gasFeePaid = true;
    }
    
    await user.save();
    
    res.json({
      message: 'Gas fee paid amount updated successfully',
      user: {
        email: user.email,
        gasFee: user.gasFee,
        gasFeePaidAmount: user.gasFeePaidAmount,
        gasFeePaid: user.gasFeePaid,
      }
    });
  } catch (error) {
    console.error('Update gas fee paid error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Delete an investment
router.delete('/investment/:investmentId', adminAuth, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.investmentId);
    
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    const userId = investment.userId;
    
    // Delete from database
    await Investment.delete(req.params.investmentId);
    
    // Remove from user's investments array
    const user = await User.findById(userId);
    if (user) {
      user.investments = user.investments.filter(invId => invId !== req.params.investmentId);
      await user.save();
    }
    
    res.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Delete investment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

