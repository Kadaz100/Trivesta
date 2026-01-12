'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { walletAPI, authAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import dynamic from 'next/dynamic';

// Dynamically import QRCode to avoid SSR issues
const QRCodeSVG = dynamic(() => import('qrcode.react').then((mod) => mod.QRCodeSVG), {
  ssr: false,
});

export default function GasFeePayment() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any>({});
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [txHash, setTxHash] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [gasFee, setGasFee] = useState<number | null>(null);
  const [gasFeePaidAmount, setGasFeePaidAmount] = useState<number>(0);
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
      const [addressesData, userData] = await Promise.all([
        walletAPI.getAddresses(),
        authAPI.getMe(),
      ]);
      setAddresses(addressesData.addresses || {});
      setGasFee(userData.user?.gasFee || null);
      setGasFeePaidAmount(userData.user?.gasFeePaidAmount || 0);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please refresh the page.');
    }
  };

  const handleCryptoSelect = (crypto: string) => {
    setSelectedCrypto(crypto);
    setShowPayment(true);
    setTxHash('');
    setError('');
  };

  const handlePayment = async () => {
    if (!selectedCrypto || !txHash) {
      setError('Please select a cryptocurrency and enter transaction hash');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await walletAPI.payGasFee({
        crypto: selectedCrypto,
        txHash,
      });

      // Show success
      setShowSuccess(true);
      
      // Update paid amount immediately and refresh data
      setGasFeePaidAmount(response.totalPaid || 0);
      await fetchData();
      
      // Redirect after 3 seconds if fully paid, otherwise stay on page
      setTimeout(() => {
        setShowSuccess(false);
        if (response.fullyPaid) {
          router.push('/wallet');
        } else {
          // Reset form for next payment
          setShowPayment(false);
          setSelectedCrypto('');
          setTxHash('');
        }
      }, 3000);
    } catch (err: any) {
      console.error('Gas fee payment error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Payment failed';
      const details = err.response?.data?.details ? ` - ${err.response.data.details}` : '';
      setError(`${errorMessage}${details}`);
    } finally {
      setLoading(false);
    }
  };

  const remainingBalance = gasFee ? Math.max(0, gasFee - gasFeePaidAmount) : 0;
  const selectedAddress = selectedCrypto 
    ? (addresses[selectedCrypto] || addresses[selectedCrypto.toUpperCase()] || addresses[selectedCrypto.toLowerCase()] || '')
    : '';

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
              className="bg-white p-12 rounded-3xl shadow-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-8xl mb-6"
              >
                ✅
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold text-primary-800 mb-4"
              >
                Payment Successful!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xl text-gray-600"
              >
                Your gas fee payment has been processed
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="pt-24 px-4 md:px-8 lg:px-16 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Pay Gas Fee
          </h1>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Complete your gas fee payment to enable withdrawal
          </p>

          {/* Payment Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl border-2 border-primary-100 shadow-lg mb-8"
          >
            <h2 className="text-2xl font-bold text-primary-800 mb-6">Payment Status</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                <span className="font-semibold text-gray-700">Total Gas Fee:</span>
                <span className="text-2xl font-bold text-primary-800">${gasFee?.toLocaleString() || '0'}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                <span className="font-semibold text-gray-700">Amount Paid:</span>
                <span className="text-2xl font-bold text-green-700">${gasFeePaidAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
                <span className="font-semibold text-gray-700">Remaining Balance:</span>
                <span className="text-2xl font-bold text-orange-700">${remainingBalance.toLocaleString()}</span>
              </div>
            </div>

            {remainingBalance > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-800 font-semibold">
                  ⚠️ You can make partial payments. Pay any amount and we'll track your progress.
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  Remaining: ${remainingBalance.toLocaleString()} to complete payment
                </p>
              </div>
            )}

            {remainingBalance === 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-800 font-semibold">
                  ✅ Gas fee fully paid! You can now withdraw your TVS.
                </p>
              </div>
            )}
          </motion.div>

          {/* Payment Methods */}
          {remainingBalance > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-2xl border-2 border-primary-100 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-800">Select Payment Method</h2>
                {showPayment && (
                  <button
                    onClick={() => {
                      setShowPayment(false);
                      setSelectedCrypto('');
                      setTxHash('');
                    }}
                    className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-all"
                  >
                    ← Back to Payment Methods
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
                  {/* Payment Instructions */}
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4">
                    <h3 className="font-semibold text-blue-900 mb-2">📋 Payment Instructions:</h3>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Scan the QR code or copy the address below</li>
                      <li>Send <strong>any amount</strong> (partial payments allowed)</li>
                      <li>Copy the transaction hash from your wallet</li>
                      <li>Paste it below and click Submit Payment</li>
                    </ol>
                    <p className="text-sm text-blue-700 mt-2 font-semibold">
                      Remaining: ${remainingBalance.toLocaleString()}
                    </p>
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
                    {selectedAddress ? (
                      <p className="font-mono text-sm bg-primary-50 p-3 rounded-lg break-all">
                        {selectedAddress}
                      </p>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                        <p className="text-yellow-800 text-sm font-semibold">
                          ⚠️ Address not available
                        </p>
                      </div>
                    )}
                    <button
                      onClick={async () => {
                        if (!selectedAddress) {
                          alert('Address not available');
                          return;
                        }
                        
                        try {
                          if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
                            await navigator.clipboard.writeText(selectedAddress);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          } else {
                            const textArea = document.createElement('textarea');
                            textArea.value = selectedAddress;
                            textArea.style.position = 'fixed';
                            textArea.style.left = '-999999px';
                            document.body.appendChild(textArea);
                            textArea.focus();
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }
                        } catch (err) {
                          console.error('Failed to copy:', err);
                          prompt('Copy this address:', selectedAddress);
                        }
                      }}
                      className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        copied
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200 border-2 border-primary-200'
                      }`}
                    >
                      {copied ? '✓ Copied!' : '📋 Copy Address'}
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
                    onClick={handlePayment}
                    disabled={loading || !txHash}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-800 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Submit Payment'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Back to Wallet Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/wallet')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              ← Back to Wallet
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

