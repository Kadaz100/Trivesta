'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { investmentAPI, walletAPI, authAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';

export default function Wallet() {
  const router = useRouter();
  const [investments, setInvestments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth');
      return;
    }
    fetchData();
    const interval = setInterval(() => {
      console.log('[Wallet] Auto-refreshing data...');
      fetchData();
    }, 10000); // Update every 10 seconds to see growth in real-time
    return () => clearInterval(interval);
  }, [router]);

  const fetchData = async () => {
    try {
      const [investmentsData, statsData, userData] = await Promise.all([
        investmentAPI.getAll(),
        walletAPI.getStats(),
        authAPI.getMe(),
      ]);
      setInvestments(investmentsData.investments || []);
      setStats(statsData.stats);
      setReferralCode(userData.user?.referralCode || '');
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (days: number) => {
    if (days <= 0) return 'Completed';
    const d = Math.floor(days);
    const h = Math.floor((days - d) * 24);
    const m = Math.floor(((days - d) * 24 - h) * 60);
    return `${d}d ${h}h ${m}m`;
  };

  const handleDeleteInvestment = async (investmentId: string) => {
    if (!confirm('Are you sure you want to delete this investment?')) {
      return;
    }
    try {
      await investmentAPI.delete(investmentId);
      setInvestments(investments.filter(inv => inv._id !== investmentId));
      fetchData(); // Refresh stats
    } catch (err) {
      console.error('Error deleting investment:', err);
      alert('Failed to delete investment');
    }
  };

  const handleWithdraw = (investment: any) => {
    if (investment.daysRemaining > 0) {
      alert(
        `Cannot withdraw yet!\n\n` +
        `Your investment is still locked for ${Math.ceil(investment.daysRemaining)} more days.\n\n` +
        `Lock period: ${investment.duration} days\n` +
        `Time remaining: ${formatTime(investment.daysRemaining)}\n\n` +
        `You can withdraw after the lock period ends.`
      );
    } else {
      alert(
        `Withdrawal Available!\n\n` +
        `You can now withdraw:\n` +
        `• ${investment.currentValue?.toLocaleString()} TVS\n` +
        `• Initial: ${investment.tvsLocked?.toLocaleString()} TVS\n` +
        `• Growth: +${investment.growthPercentage?.toFixed(2)}%\n\n` +
        `Withdrawal feature coming soon!`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-primary-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <Navbar />
      
      <main className="pt-24 px-4 md:px-8 lg:px-16 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            My Wallet
          </h1>
          <p className="text-gray-600 mb-12 text-lg">
            View your investments and track your growth
          </p>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border-2 border-primary-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="text-gray-600 mb-2">Total Locked</div>
                <div className="text-3xl font-bold text-primary-800">
                  {(stats.totalLocked || 0).toFixed(2)} TVS
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl border-2 border-primary-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="text-gray-600 mb-2">Current Value</div>
                <div className="text-3xl font-bold text-green-600">
                  {(stats.totalCurrent || 0).toFixed(2)} TVS
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  +{((stats.totalCurrent || 0) - (stats.totalLocked || 0)).toFixed(4)} TVS
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl border-2 border-primary-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="text-gray-600 mb-2">Total Growth</div>
                <div className="text-3xl font-bold text-primary-600">
                  +{(stats.growthPercentage || 0).toFixed(4)}%
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  0.5% daily
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-2xl border-2 border-primary-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="text-gray-600 mb-2">Active Investments</div>
                <div className="text-3xl font-bold text-primary-800">
                  {stats.activeInvestments || 0}
                </div>
              </motion.div>
            </div>
          )}

          {/* Investments List */}
          <div className="space-y-6">
            {investments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-12 rounded-2xl border-2 border-primary-100 text-center"
              >
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Investments Yet</h3>
                <p className="text-gray-600 mb-6">Start investing to see your portfolio here</p>
                <a
                  href="/invest"
                  className="inline-block bg-gradient-to-r from-primary-600 to-primary-800 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Start Investing
                </a>
              </motion.div>
            ) : (
              investments.map((investment, index) => (
                <motion.div
                  key={investment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border-2 border-primary-100 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-primary-800 capitalize">
                          {investment.plan === 'custom' ? 'Custom' : investment.plan} Plan
                        </h3>
                        <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold hover:bg-primary-200 transition-colors duration-300">
                          {investment.crypto}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-300 ${
                            investment.status === 'locked'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {investment.status}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {investment.duration} Days
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Investment</div>
                          <div className="text-lg font-bold text-primary-800">
                            {(investment.cryptoAmount || investment.amount)?.toLocaleString()} {investment.crypto}
                          </div>
                          <div className="text-xs text-gray-500">
                            ≈ ${investment.amount?.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Locked TVS</div>
                          <div className="text-lg font-bold text-primary-800">
                            {investment.tvsLocked?.toLocaleString()} TVS
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Current Value</div>
                          <div className="text-lg font-bold text-green-600 flex items-center gap-2">
                            {investment.currentValue?.toFixed(2)} TVS
                            <motion.span
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="text-xs text-green-500"
                            >
                              ↑
                            </motion.span>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Growth</div>
                          <div className="text-lg font-bold text-primary-600">
                            +{investment.growthPercentage?.toFixed(4)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            0.5% per day
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Time Remaining</div>
                          <div className="text-lg font-bold text-primary-800">
                            {formatTime(investment.daysRemaining || 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Progress Bars */}
                  <div className="mt-4 space-y-3">
                    {/* Time Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Time Progress</span>
                        <span>
                          {investment.duration
                            ? Math.round(
                                ((investment.duration - (investment.daysRemaining || 0)) /
                                  investment.duration) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-primary-100 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              investment.duration
                                ? ((investment.duration - (investment.daysRemaining || 0)) /
                                    investment.duration) *
                                  100
                                : 0
                            }%`,
                          }}
                          transition={{ duration: 1 }}
                          className="bg-gradient-to-r from-primary-600 to-primary-800 h-3 rounded-full"
                        />
                      </div>
                    </div>
                    {/* Growth Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Growth Progress</span>
                        <span>+{(investment.growthPercentage || 0).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min((investment.growthPercentage || 0) * 2, 100)}%`,
                          }}
                          transition={{ duration: 1 }}
                          className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => handleWithdraw(investment)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        investment.daysRemaining > 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      {investment.daysRemaining > 0 ? '🔒 Locked' : '💰 Withdraw TVS'}
                    </button>
                    <button
                      onClick={() => handleDeleteInvestment(investment._id)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300 text-sm font-semibold"
                    >
                      Delete Investment
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl hover:border-yellow-300 transition-colors duration-300"
          >
            <p className="text-yellow-800 text-sm">
              <strong>Disclaimer:</strong> Funds are simulated; real tokens will be distributed upon
              launch.
            </p>
          </motion.div>

          {/* Referral/Invite Friends Section - Moved to Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-gradient-to-br from-primary-600 to-primary-800 p-8 rounded-2xl shadow-xl text-white"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-3">Invite Your Friends</h2>
                <p className="text-primary-100 text-lg mb-4">
                  Share your referral link and earn a <span className="font-bold text-yellow-300">10% bonus</span> on tokens when your friends invest!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-primary-200 text-sm mb-2">Your Referral Link</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={referralCode ? `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${referralCode}` : 'Loading...'}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <button
                        onClick={() => {
                          if (referralCode) {
                            const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${referralCode}`;
                            navigator.clipboard.writeText(link);
                            alert('Referral link copied to clipboard!');
                          }
                        }}
                        disabled={!referralCode}
                        className="px-4 py-2 bg-white text-primary-800 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Copy
                      </button>
                    </div>
                    {referralCode && (
                      <p className="text-primary-200 text-xs mt-2">
                        Your Referral Code: <span className="font-bold">{referralCode}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-4xl font-bold mb-2">10%</div>
                  <div className="text-primary-200">Token Bonus</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}


