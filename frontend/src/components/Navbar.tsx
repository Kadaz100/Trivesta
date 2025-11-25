'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { removeToken, isAuthenticated } from '@/lib/auth';
import { authAPI } from '@/lib/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    if (isAuthenticated()) {
      fetchUserEmail();
    }
  }, []);

  const fetchUserEmail = async () => {
    try {
      const response = await authAPI.getMe();
      setUserEmail(response.user?.email || '');
    } catch (err) {
      console.error('Error fetching user email:', err);
    }
  };

  const handleLogout = () => {
    removeToken();
    setAuthenticated(false);
    setIsOpen(false);
    router.push('/auth');
  };

  const menuItems = [
    { name: 'Home', path: '/home' },
    { name: 'Invest', path: '/invest' },
    { name: 'My Wallet', path: '/wallet' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 p-3 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
          <motion.span
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-full bg-white rounded"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block h-0.5 w-full bg-white rounded"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-full bg-white rounded"
          />
        </div>
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />

            {/* Sidebar Menu */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full p-8">
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                    Trivesta
                  </h1>
                  <p className="text-primary-300 text-sm mt-1">The future of finance and infrastructure</p>
                </motion.div>

                {/* User Email */}
                {authenticated && userEmail && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 px-6 py-3 bg-white/10 rounded-xl text-primary-100 text-sm font-medium truncate"
                  >
                    {userEmail}
                  </motion.div>
                )}

                {/* Menu Items */}
                <nav className="flex-1 space-y-4">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-6 py-4 rounded-xl transition-all duration-300 ${
                          pathname === item.path
                            ? 'bg-white text-primary-800 shadow-lg scale-105'
                            : 'hover:bg-white/10 hover:translate-x-2'
                        }`}
                      >
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Logout Button */}
                {authenticated && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleLogout}
                    className="mt-8 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <span className="font-medium">Logout</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

