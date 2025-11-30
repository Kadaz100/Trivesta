const { db } = require('../firebase-config');
const bcrypt = require('bcryptjs');
const { Timestamp } = require('firebase-admin/firestore');
const crypto = require('crypto');

// Generate unique referral code
async function generateUniqueReferralCode() {
  let code;
  let isUnique = false;
  const maxAttempts = 10;
  let attempts = 0;

  while (!isUnique && attempts < maxAttempts) {
    // Generate a random 8-character alphanumeric code
    code = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Check if code already exists
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('referralCode', '==', code).get();
    
    if (snapshot.empty) {
      isUnique = true;
    }
    attempts++;
  }

  // If we couldn't find a unique code after max attempts, append timestamp
  if (!isUnique) {
    code = crypto.randomBytes(3).toString('hex').toUpperCase() + Date.now().toString(36).substring(7).toUpperCase();
  }

  return code;
}

class User {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name || '';
    this.walletAddress = data.walletAddress || '';
    this.referralCode = data.referralCode || '';
    this.createdAt = data.createdAt || new Date();
    this.investments = data.investments || [];
    this._id = data._id;
  }

  static async findOne(query) {
    try {
      const usersRef = db.collection('users');
      let q = usersRef;

      if (query.email) {
        q = q.where('email', '==', query.email);
      }

      const snapshot = await q.get();
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return new User({ ...doc.data(), _id: doc.id });
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const userDoc = await db.collection('users').doc(id).get();
      if (!userDoc.exists) {
        return null;
      }
      return new User({ ...userDoc.data(), _id: userDoc.id });
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return new User({ ...doc.data(), _id: doc.id });
    } catch (error) {
      throw error;
    }
  }

  static async findByReferralCode(code) {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('referralCode', '==', code).get();
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return new User({ ...doc.data(), _id: doc.id });
    } catch (error) {
      throw error;
    }
  }

  async save() {
    try {
      // Hash password if it's a new user
      if (this.password && !this.password.startsWith('$2a$')) {
        this.password = await bcrypt.hash(this.password, 10);
      }

      const usersRef = db.collection('users');
      
      // Convert Date to Firestore Timestamp if needed
      let createdAtValue = this.createdAt;
      if (this.createdAt instanceof Date) {
        createdAtValue = Timestamp.fromDate(this.createdAt);
      } else if (!this.createdAt) {
        createdAtValue = Timestamp.now();
      }

      // Generate referral code if it doesn't exist (for new users)
      let referralCodeValue = this.referralCode;
      if (!this._id && !referralCodeValue) {
        // This is a new user, generate unique referral code
        referralCodeValue = await generateUniqueReferralCode();
        this.referralCode = referralCodeValue;
      } else if (!referralCodeValue) {
        // Existing user without referral code, generate one
        referralCodeValue = await generateUniqueReferralCode();
        this.referralCode = referralCodeValue;
      }

      const userData = {
        email: this.email,
        password: this.password,
        name: this.name || '',
        walletAddress: this.walletAddress || '',
        referralCode: referralCodeValue,
        createdAt: createdAtValue,
        investments: this.investments || [],
      };

      if (this._id) {
        // Update existing user
        await usersRef.doc(this._id).update(userData);
      } else {
        // Create new user
        const docRef = await usersRef.add(userData);
        this._id = docRef.id;
      }
      return this;
    } catch (error) {
      console.error('User save error:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      if (error.stack) {
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;

