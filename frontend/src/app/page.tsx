'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
  { label: 'Transactions Secured', value: '48,000+', icon: '🔐' },
  { label: 'Infrastructure Projects', value: '120+', icon: '🏗️' },
  { label: 'Live Networks', value: '36', icon: '🌐' },
  { label: 'Communities Empowered', value: '75+', icon: '🤝' },
];

const pillars = [
  {
    title: 'Real Utility',
    description:
      'Token flows are tied to real-world infrastructure, energy-efficient facilities, and regulated markets.',
    accent: 'from-primary-500 to-primary-700',
  },
  {
    title: 'Transparent Governance',
    description:
      'On-chain proposals, treasury analytics, and auditable smart contracts keep the community in control.',
    accent: 'from-amber-400 to-rose-500',
  },
  {
    title: 'Institutional Security',
    description:
      'Multi-layer custody, third-party audits, and formal verification guarantee institutional-grade protection.',
    accent: 'from-emerald-400 to-teal-600',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(116,47,255,0.4),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,132,0,0.25),_transparent_60%)]" />
        <main className="relative z-10 px-4 md:px-12 lg:px-20 py-16 md:py-24 space-y-24">
          <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm uppercase tracking-[0.4em] text-primary-200 mb-6"
              >
                Trivesta — The Future of Finance
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-slate-50 mb-6"
              >
                Infrastructure-grade finance built for real communities.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8"
              >
                Trivesta bridges decentralized markets with tangible infrastructure. Launch,
                fund, and scale community-owned assets with institutional security,
                accountable governance, and transparent tokenomics.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/auth"
                  className="px-8 py-4 rounded-2xl font-semibold text-lg bg-white text-primary-900 shadow-xl shadow-primary-500/30 hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth"
                  className="px-8 py-4 rounded-2xl font-semibold text-lg border border-white/40 text-white hover:bg-white/5 transition-all"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-amber-400/20 blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-white/70 uppercase text-xs tracking-[0.4em]">Live Pulse</p>
                  <span className="text-emerald-300 text-sm">Synchronized</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-slate-900">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-4 shadow">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-slate-500 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          <section className="space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm uppercase tracking-[0.4em] text-primary-200"
            >
              Why Trivesta
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-white"
            >
              Engineered for durability, governed by the community.
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 hover:bg-white/10 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.accent} flex items-center justify-center text-2xl`}>
                    {index === 0 && '🏗️'}
                    {index === 1 && '🧭'}
                    {index === 2 && '🛡️'}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
                  <p className="text-slate-300">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 md:p-12 space-y-8 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <p className="text-sm uppercase tracking-[0.4em] text-primary-200">
                  Multi-layered launch flow
                </p>
                <h3 className="text-3xl font-bold text-white">
                  Designed for founders, auditors, and regulated partners.
                </h3>
                <p className="text-slate-300">
                  Trivesta combines permissioned rails with decentralized autonomy. Deploy audited
                  smart contracts, stream vested tokens, and fund infrastructure in a single
                  orchestration layer.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Launchpad orchestration', 'Regulated liquidity', 'Transparent auditing', 'Infrastructure vaults'].map((item) => (
                  <div key={item} className="border border-white/15 rounded-2xl px-4 py-3 text-slate-200 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth"
                className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Explore Presale Plans
              </Link>
              <Link
                href="/auth"
                className="px-6 py-3 rounded-xl font-semibold border border-white/30 text-white hover:bg-white/10 transition-all"
              >
                Get Started
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

