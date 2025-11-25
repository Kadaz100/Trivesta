'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { isAuthenticated } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth');
    }
  }, [router]);

  const stats = [
    { label: 'Active Investors', value: '10,000+', icon: '👥' },
    { label: 'Funds Managed', value: '$200M+', icon: '💰' },
    { label: 'Trust Score', value: '98%', icon: '⭐' },
    { label: 'Security & Support', value: '100%', icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 px-4 md:px-8 lg:px-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
          >
            Welcome to Trivesta
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Launch Your Presale, Secure Investments. Join 10,000+ investors in our token presale.
            Earn passive returns with transparency and security.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/invest"
              className="inline-block bg-gradient-to-r from-primary-600 to-primary-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Investing
            </Link>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-2xl border border-primary-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-primary-800 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Participate in Our Token Presale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Secure Investments',
                description: 'Blockchain-verified transactions with complete transparency',
                icon: '🛡️',
              },
              {
                title: 'Passive Returns',
                description: 'Earn daily growth on your locked investments',
                icon: '📈',
              },
              {
                title: 'Multiple Cryptos',
                description: 'Invest using USDT, BTC, ETH, or SOL',
                icon: '💎',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl border-2 border-primary-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-primary-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-primary-200">
            © 2025 Trivesta. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

