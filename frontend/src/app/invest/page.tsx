'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { walletAPI, investmentAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import dynamic from 'next/dynamic';

// Dynamically import QRCode to avoid SSR issues
const QRCodeSVG = dynamic(() => import('qrcode.react').then((mod) => mod.QRCodeSVG), {
  ssr: false,
});

export default function Invest() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any>({});
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [customAmount, setCustomAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [plansData, addressesData] = await Promise.all([
        walletAPI.getPlans(),
        walletAPI.getAddresses(),
      ]);
      setPlans(plansData.plans);
      setAddresses(addressesData.addresses);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPayment(false);
    setSelectedCrypto('');
    setTxHash('');
    setCustomAmount(''); // Clear custom amount when selecting a plan
  };

  const handleCryptoSelect = (crypto: string) => {
    setSelectedCrypto(crypto);
    setShowPayment(true);
  };

  const handleInvest = async () => {
    if (!selectedPlan || !selectedCrypto || !txHash) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const plan = plans.find((p) => p.id === selectedPlan);
      const amount = customAmount ? parseFloat(customAmount) : plan?.minAmount || 100;
      // Custom plans default to 90 days (3 months), otherwise use plan duration
      const duration = selectedPlan === 'custom' ? 90 : plan?.duration || 30;

      await investmentAPI.create({
        plan: selectedPlan,
        amount,
        crypto: selectedCrypto,
        txHash,
        duration,
      });

      // Show success animation
      setShowSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/wallet');
      }, 3000);
    } catch (err: any) {
      console.error('Investment error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Investment failed';
      const details = err.response?.data?.details ? ` - ${err.response.data.details}` : '';
      setError(`${errorMessage}${details}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedAddress = addresses[selectedCrypto] || '';
  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  const faqData = [
    {
      question: "How do I make a payment?",
      answer: "1. Select an investment plan\n2. Choose your preferred cryptocurrency (USDT, BTC, ETH, or SOL)\n3. Scan the QR code or copy the wallet address\n4. Send the payment from your crypto wallet\n5. Copy the transaction hash from your wallet\n6. Paste it in the form and click \"Complete Investment\""
    },
    {
      question: "What is a transaction hash?",
      answer: "A transaction hash (TX hash) is a unique identifier for your blockchain transaction. You can find it in your wallet app after sending payment. It usually starts with \"0x\" and looks like: 0x1a2b3c4d5e6f7890abcdef..."
    },
    {
      question: "How long does verification take?",
      answer: "Transactions are typically verified within 24-48 hours. You'll see your investment in the Wallet page once confirmed. TVS tokens start accruing immediately after verification."
    },
    {
      question: "Can I invest with multiple cryptocurrencies?",
      answer: "Yes! You can make separate investments using different cryptocurrencies. Each investment is tracked independently in your wallet."
    },
    {
      question: "What happens after my investment is verified?",
      answer: "After verification, your investment will appear in your Wallet page. Your TVS balance will grow daily based on your plan's rate. You can unlock your investment after the lock period ends."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <Navbar />
      
      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="bg-white p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden"
            >
              {/* Confetti Effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      top: "50%", 
                      left: "50%",
                      opacity: 1 
                    }}
                    animate={{ 
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: 0,
                      rotate: Math.random() * 360
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 0.02,
                      ease: "easeOut"
                    }}
                    className="absolute w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]
                    }}
                  />
                ))}
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-8xl mb-6"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold text-primary-800 mb-4"
              >
                Congratulations!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xl text-gray-600"
              >
                Your investment has been submitted successfully!
              </motion.p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6 inline-block"
              >
                <div className="flex items-center gap-2 text-primary-600">
                  <span className="animate-spin">⏳</span>
                  <span>Redirecting to your wallet...</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="pt-24 px-4 md:px-8 lg:px-16 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Choose Your Investment Plan
          </h1>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Select a plan or create a custom investment
          </p>

          {/* Investment Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => handlePlanSelect(plan.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? 'border-primary-600 bg-primary-50 shadow-xl'
                    : 'border-primary-100 bg-white hover:shadow-lg'
                }`}
              >
                {plan.label && (
                  <span className="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    {plan.label}
                  </span>
                )}
                <h3 className="text-2xl font-bold text-primary-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">
                  ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                </p>
                <p className="text-primary-600 font-semibold">{plan.duration} Days</p>
              </motion.div>
            ))}
          </div>

          {/* Custom Investment */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-8 rounded-2xl border-2 border-primary-100 shadow-lg mb-8"
          >
            <h2 className="text-2xl font-bold text-primary-800 mb-6">
              {selectedPlan && selectedPlan !== 'custom' 
                ? `${selectedPlanData?.name} Investment` 
                : 'Custom Investment'}
            </h2>
            
            {selectedPlan && selectedPlan !== 'custom' && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-4">
                <p className="text-green-800 font-semibold">
                  ✓ You selected: {selectedPlanData?.name}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Duration: {selectedPlanData?.duration} days | 
                  Range: ${selectedPlanData?.minAmount.toLocaleString()} - ${selectedPlanData?.maxAmount.toLocaleString()}
                </p>
              </div>
            )}
            
            <p className="text-gray-600 mb-4">
              {selectedPlan && selectedPlan !== 'custom'
                ? `Enter your ${selectedPlanData?.name} investment amount`
                : 'Enter your investment amount (Duration: 3 months)'}
            </p>
            
            <div className="max-w-md">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Amount ($)</label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={selectedPlan && selectedPlan !== 'custom' 
                    ? `Min: $${selectedPlanData?.minAmount.toLocaleString()}`
                    : 'Enter amount'}
                  className="w-full px-4 py-3 border-2 border-primary-100 rounded-xl focus:outline-none focus:border-primary-600 transition-all"
                />
              </div>
            </div>
            
            {selectedPlan && selectedPlan !== 'custom' && (
              <button
                onClick={() => {
                  setSelectedPlan(null);
                  setCustomAmount('');
                }}
                className="mt-4 text-gray-600 hover:text-primary-600 font-medium"
              >
                ← Choose Different Plan
              </button>
            )}
            
            {(!selectedPlan || selectedPlan === 'custom') && (
              <button
                onClick={() => {
                  setSelectedPlan('custom');
                  setShowPayment(false);
                }}
                className="mt-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Invest Custom Amount (3 Months)
              </button>
            )}
          </motion.div>

          {/* Payment Section */}
          <AnimatePresence>
            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-8 rounded-2xl border-2 border-primary-100 shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-primary-800">Select Payment Method</h2>
                  {!showPayment && (
                    <button
                      onClick={() => {
                        setSelectedPlan(null);
                        setSelectedCrypto('');
                        setTxHash('');
                      }}
                      className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-all"
                    >
                      ← Back to Plans
                    </button>
                  )}
                </div>
                
                {!showPayment ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['USDT', 'BTC', 'ETH', 'SOL'].map((crypto) => (
                      <button
                        key={crypto}
                        onClick={() => handleCryptoSelect(crypto)}
                        className="p-6 border-2 border-primary-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-300 hover:scale-105"
                      >
                        <div className="text-3xl mb-2">{crypto === 'USDT' ? '💵' : crypto === 'BTC' ? '₿' : crypto === 'ETH' ? 'Ξ' : '◎'}</div>
                        <div className="font-semibold text-primary-800">{crypto}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <button
                      onClick={() => {
                        setShowPayment(false);
                        setSelectedCrypto('');
                        setTxHash('');
                      }}
                      className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-all mb-4"
                    >
                      ← Back to Payment Methods
                    </button>
                    
                    {/* Payment Instructions */}
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4">
                      <h3 className="font-semibold text-blue-900 mb-2">📋 Payment Instructions:</h3>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Scan the QR code or copy the address below</li>
                        <li>Send the exact amount from your wallet</li>
                        <li>Copy the transaction hash from your wallet</li>
                        <li>Paste it below and click Complete Investment</li>
                      </ol>
                    </div>

                    {selectedAddress && (
                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-xl border-2 border-primary-200">
                          <QRCodeSVG value={selectedAddress} size={200} />
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-gray-600 mb-2 font-semibold">Send {selectedCrypto} payment to:</p>
                      <p className="font-mono text-sm bg-primary-50 p-3 rounded-lg break-all">
                        {selectedAddress || 'Address not available'}
                      </p>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedAddress)}
                        className="mt-2 text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        📋 Copy Address
                      </button>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Transaction Hash *
                      </label>
                      <input
                        type="text"
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        placeholder="Paste your transaction hash here (e.g., 0x...)"
                        className="w-full px-4 py-3 border-2 border-primary-100 rounded-xl focus:outline-none focus:border-primary-600 transition-all font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Find this in your wallet after sending the payment
                      </p>
                    </div>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        {error}
                      </div>
                    )}
                    <button
                      onClick={handleInvest}
                      disabled={loading || !txHash}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-800 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Complete Investment'}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* FAQ Section - Accordion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-white p-8 rounded-2xl border-2 border-primary-100 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-primary-800 mb-6 text-center">
              ❓ Frequently Asked Questions
            </h2>
            
            <div className="space-y-3">
              {faqData.map((faq, index) => (
                <div key={index} className="border-2 border-primary-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full p-4 flex items-center justify-between hover:bg-primary-50 transition-all"
                  >
                    <h3 className="font-bold text-primary-800 text-left">{faq.question}</h3>
                    <motion.span
                      animate={{ rotate: openFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl text-primary-600"
                    >
                      ⌄
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 text-gray-600 text-sm whitespace-pre-line">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gradient-to-r from-primary-600 to-primary-800 p-8 rounded-2xl shadow-lg text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="mb-6 text-primary-50">
              Our support team is here to assist you with any questions or issues.
            </p>
            <a
              href="mailto:blockinvestorteam.xyz@gmail.com"
              className="inline-flex items-center gap-2 bg-white text-primary-800 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>📧</span>
              <span>blockinvestorteam.xyz@gmail.com</span>
            </a>
            <p className="mt-4 text-sm text-primary-100">
              Average response time: 24 hours
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
