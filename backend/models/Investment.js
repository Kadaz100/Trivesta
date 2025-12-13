const { db } = require('../firebase-config');

class Investment {
  constructor(data) {
    this.userId = data.userId;
    this.plan = data.plan; // 'basic', 'premium', 'exclusive', 'presale', 'custom'
    this.amount = data.amount; // USD amount
    this.cryptoAmount = data.cryptoAmount || data.amount; // Actual crypto amount sent
    this.crypto = data.crypto; // 'USDT', 'BTC', 'ETH', 'SOL'
    this.txHash = data.txHash;
    this.tvsLocked = data.tvsLocked;
    this.startTime = data.startTime || new Date();
    this.duration = data.duration; // in days
    this.growthRate = data.growthRate || 0.5; // daily percentage
    this.status = data.status || 'locked'; // 'locked', 'ready', 'distributed'
    this.createdAt = data.createdAt || new Date();
    this._id = data._id;
  }

  async save() {
    try {
      const investmentsRef = db.collection('investments');
      const investmentData = {
        userId: this.userId,
        plan: this.plan,
        amount: this.amount,
        cryptoAmount: this.cryptoAmount,
        crypto: this.crypto,
        txHash: this.txHash,
        tvsLocked: this.tvsLocked,
        startTime: this.startTime,
        duration: this.duration,
        growthRate: this.growthRate,
        status: this.status,
        createdAt: this.createdAt,
      };

      if (this._id) {
        await investmentsRef.doc(this._id).update(investmentData);
      } else {
        const docRef = await investmentsRef.add(investmentData);
        this._id = docRef.id;
      }
      return this;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const snapshot = await db.collection('investments')
        .where('userId', '==', userId)
        .get();
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        _id: doc.id,
      }));
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const doc = await db.collection('investments').doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { ...doc.data(), _id: doc.id };
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db.collection('investments').doc(id).delete();
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Calculate current value with growth
  getCurrentValue() {
    // Auto-upgrade existing investments: if amount > $200 and growthRate is 0.5, upgrade to 20%
    if (parseFloat(this.amount) > 200 && this.growthRate === 0.5) {
      this.growthRate = 20;
      // Save the updated growth rate to database (async, don't wait)
      if (this._id) {
        this.save().catch(err => console.error('Error updating investment growth rate:', err));
      }
    }

    // Handle Firestore Timestamp conversion
    let startDate = this.startTime;
    if (this.startTime && typeof this.startTime.toDate === 'function') {
      startDate = this.startTime.toDate();
    } else if (this.startTime && typeof this.startTime === 'object' && this.startTime._seconds) {
      startDate = new Date(this.startTime._seconds * 1000);
    } else {
      startDate = new Date(this.startTime);
    }

    const now = new Date();
    // Calculate with decimals to show growth even for partial days
    const daysElapsed = (now - startDate) / (1000 * 60 * 60 * 24);
    const daysRemaining = Math.max(0, this.duration - daysElapsed);
    const growthMultiplier = 1 + (this.growthRate / 100) * daysElapsed;
    const currentValue = this.tvsLocked * growthMultiplier;
    const growthPercentage = (growthMultiplier - 1) * 100;

    console.log(`[Investment ${this._id}] Growth calc:`, {
      startDate: startDate.toISOString(),
      now: now.toISOString(),
      daysElapsed: daysElapsed.toFixed(4),
      daysElapsedRounded: Math.floor(daysElapsed),
      daysRemaining: daysRemaining.toFixed(2),
      tvsLocked: this.tvsLocked,
      growthRate: this.growthRate,
      growthMultiplier: growthMultiplier.toFixed(6),
      currentValue: currentValue.toFixed(2),
      growthPercentage: growthPercentage.toFixed(4),
    });

    return {
      currentValue,
      daysElapsed,
      daysRemaining,
      growthPercentage,
    };
  }
}

module.exports = Investment;

