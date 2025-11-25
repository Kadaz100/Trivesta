'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Event type
type EventType = {
  id: number;
  title: string;
  image: string;
  fallbackIcon: string;
};

// Event Card Component with Image Fallback
function EventCard({ event }: { event: EventType }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white rounded-2xl border-2 border-primary-100 shadow-lg overflow-hidden h-full"
    >
      <div className="relative w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
        {!imageError ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-6xl opacity-70">{event.fallbackIcon}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary-800 text-center">
          {event.title}
        </h3>
      </div>
    </motion.div>
  );
}

// Team Image Component with Fallback
function TeamImage({ src, alt, fallbackIcon, delay }: { src: string; alt: string; fallbackIcon: string; delay: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-6 shadow-xl overflow-hidden relative ring-4 ring-primary-100"
    >
      {!imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover rounded-full"
          sizes="(max-width: 768px) 160px, 192px"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-6xl text-white">{fallbackIcon}</span>
      )}
    </motion.div>
  );
}

// Partner Logo Component with Fallback
function PartnerLogo({ src, alt, fallbackIcon }: { src: string; alt: string; fallbackIcon: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-4 flex items-center justify-center bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow duration-300">
      {!imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 96px, 112px"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-4xl">{fallbackIcon}</span>
      )}
    </div>
  );
}

export default function About() {
  const events = [
    { 
      id: 1, 
      title: '2025 Crypto Summit', 
      image: '/crypto-summit.jpg',
      fallbackIcon: '🏆'
    },
    { 
      id: 2, 
      title: 'Blockchain Conference', 
      image: '/blockchain-conference.jpg',
      fallbackIcon: '🌐'
    },
    { 
      id: 3, 
      title: 'DeFi Innovation Forum', 
      image: '/defi-forum.jpg',
      fallbackIcon: '💡'
    },
    { 
      id: 4, 
      title: 'Token Launch Event', 
      image: '/token-launch.jpg',
      fallbackIcon: '🚀'
    },
    { 
      id: 5, 
      title: 'Investment Workshop', 
      image: '/investment-workshop.jpg',
      fallbackIcon: '📚'
    },
  ];

  const investmentPoints = [
    'Current stage: Trivesta is in a presale phase for early adopters.',
    'Token treatment: Funds raised during presale are subject to vesting and lockup schedules to promote stability and fairness.',
    'Distribution: Tokens allocated to early investors will be unlocked according to the published vesting timeline after launch.',
    'Transparency: All presale mechanics, vesting schedules, and smart-contract addresses will be publicly auditable.',
  ];

  const techPoints = [
    'Audit-ready smart contracts and formal verification where feasible.',
    'Multi-layer infrastructure security and secure key management.',
    'Continuous code review, third-party audits, and community bug-bounty programs.',
    'Clear governance and on-chain transparency so holders can verify how funds and code are managed.',
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
            >
              About Us
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-1 bg-gradient-to-r from-primary-600 to-primary-800 mx-auto rounded-full"
            />
          </motion.div>

          {/* What We Stand For */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 md:p-12 rounded-3xl border-2 border-primary-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl md:text-4xl font-bold text-primary-800 mb-6"
                >
                  What We Stand For — Explain Trivesta
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4 text-lg text-gray-700 leading-relaxed"
                >
                  <p>
                    Trivesta is a community-led blockchain ecosystem built to bridge digital markets and real-world infrastructure. We believe finance should be transparent, decentralized, and accountable to the people who use it.
                  </p>
                  <p>
                    By combining proven tokenomics with real-world asset strategies and open governance, Trivesta gives communities the tools to capture long-term value and participate in building the future of finance.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Our Aim */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <div className="bg-white p-8 md:p-12 rounded-3xl border-2 border-primary-100 shadow-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-start gap-6"
              >
                <div className="text-6xl">🎯</div>
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
                    Our Aim
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To build an inclusive, resilient financial infrastructure that empowers users and communities. We&apos;re creating a platform and native blockchain designed for security, scalability, and real-world integration — enabling everything from DeFi primitives to infrastructure funding and asset tokenization.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Why Now */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 md:p-12 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mt-32"></div>
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start gap-6 mb-6"
                >
                  <div className="text-6xl">⏰</div>
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Why Now — The Opportunity
                    </h2>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="space-y-4 text-lg text-primary-50 leading-relaxed"
                >
                  <p>
                    Market cycles separate noise from substance. The projects with real communities, strong fundamentals, and long-term vision survive and thrive — especially when markets recover. Strategic investment in a genuine community during downturns can create generational upside. That&apos;s why Trivesta exists: to turn community trust and sound engineering into lasting value beyond current market sentiment.
                  </p>
                  <p>
                    We&apos;re also using startup-style fundraising to finance tangible infrastructure: real estate, infrastructure projects, and regulated market positions. This hybrid strategy helps Trivesta stand out and adds diversified, real-world backing to our digital token economy.
                  </p>
                  <p className="font-semibold text-white">
                    We have been developing Trivesta for over two years, iterating on the tech, token design, and community governance to ensure sustainability and real utility.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Our Goal */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 md:p-12 rounded-3xl border-2 border-primary-100 shadow-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-start gap-6"
              >
                <div className="text-6xl">🚀</div>
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
                    Our Goal
                  </h2>
                  <p className="text-xl text-gray-800 leading-relaxed font-medium">
                    Create meaningful financial freedom for all by building the next generation of financial infrastructure — a transparent, community-driven ecosystem that supports real-world value creation and long-term wealth building.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* How Investment Works */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mb-16"
          >
            <div className="bg-white p-8 md:p-12 rounded-3xl border-2 border-primary-100 shadow-lg">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="text-3xl md:text-4xl font-bold text-primary-800 mb-8 flex items-center gap-4"
              >
                <span className="text-5xl">💼</span>
                <span>How Investment Works</span>
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="space-y-4"
              >
                {investmentPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors duration-300"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-lg text-gray-700 leading-relaxed">{point}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* Technology & Security */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 md:p-12 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mb-48"></div>
              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.9 }}
                  className="text-3xl md:text-4xl font-bold mb-6 flex items-center gap-4"
                >
                  <span className="text-5xl">🔐</span>
                  <span>Technology & Security (Securities)</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="text-lg text-primary-50 mb-6 leading-relaxed"
                >
                  We combine best-in-class engineering practices with external expertise to design and secure the platform:
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.1 }}
                  className="space-y-4"
                >
                  {techPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.2 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-300"
                    >
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-lg text-primary-50 leading-relaxed">{point}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Our Team */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-white to-primary-50 p-8 md:p-12 rounded-3xl border-2 border-primary-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.3 }}
                  className="text-3xl md:text-4xl font-bold text-primary-800 mb-12 text-center"
                >
                  Our Team
                </motion.h2>
                
                {/* Team Members */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.4 }}
                    whileHover={{ scale: 1.03, y: -8 }}
                    className="bg-white p-8 md:p-10 rounded-3xl border-2 border-primary-100 shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center">
                      <TeamImage 
                        src="/team/jack-dorsey.jpg"
                        alt="Jack Dorsey"
                        fallbackIcon="👨‍💼"
                        delay={2.5}
                      />
                      <h3 className="text-2xl md:text-3xl font-bold text-primary-800 mb-2">
                        Jack Dorsey
                      </h3>
                      <p className="text-lg md:text-xl text-primary-600 font-semibold">
                        Chief Executive Officer
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.5 }}
                    whileHover={{ scale: 1.03, y: -8 }}
                    className="bg-white p-8 md:p-10 rounded-3xl border-2 border-primary-100 shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center">
                      <TeamImage 
                        src="/team/nez-june.jpg"
                        alt="Nez June"
                        fallbackIcon="👤"
                        delay={2.6}
                      />
                      <h3 className="text-2xl md:text-3xl font-bold text-primary-800 mb-2">
                        Nez June
                      </h3>
                      <p className="text-lg md:text-xl text-primary-600 font-semibold">
                        Team Member
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Backed By Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.7 }}
                  className="mt-12 pt-12 border-t-2 border-primary-100"
                >
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                    className="text-2xl md:text-3xl font-bold text-primary-800 mb-8 text-center"
                  >
                    Backed By
                  </motion.h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {[
                      { name: 'Coinband', location: 'Germany', image: '/partners/coinband.png', fallbackIcon: '🇩🇪' },
                      { name: 'Centrifuge', location: '', image: '/partners/centrifuge.png', fallbackIcon: '🌐' },
                      { name: 'MEXC', location: 'Exchange', image: '/partners/mexc.png', fallbackIcon: '💱' },
                      { name: 'Blofin', location: 'Exchange', image: '/partners/blofin.png', fallbackIcon: '📊' },
                    ].map((partner, index) => (
                      <motion.div
                        key={partner.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.9 + index * 0.1, type: "spring" }}
                        whileHover={{ scale: 1.08, y: -5 }}
                        className="bg-white p-6 md:p-8 rounded-2xl border-2 border-primary-100 shadow-md hover:shadow-xl transition-all duration-300 text-center"
                      >
                        <PartnerLogo 
                          src={partner.image}
                          alt={partner.name}
                          fallbackIcon={partner.fallbackIcon}
                        />
                        <h4 className="text-lg md:text-xl font-bold text-primary-800 mb-1">
                          {partner.name}
                        </h4>
                        {partner.location && (
                          <p className="text-sm md:text-base text-gray-600">{partner.location}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Events Carousel */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2 }}
            className="mb-16"
          >
            <div className="bg-white p-8 md:p-12 rounded-3xl border-2 border-primary-100 shadow-lg">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3.3 }}
                className="text-3xl md:text-4xl font-bold text-primary-800 mb-8 text-center"
              >
                Our Events
              </motion.h2>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                className="pb-12"
              >
                {events.map((event) => (
                  <SwiperSlide key={event.id}>
                    <EventCard event={event} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.section>

          {/* Built by Community */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.4 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-primary-50 via-white to-primary-50 p-8 md:p-12 rounded-3xl border-2 border-primary-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl -ml-32 -mt-32"></div>
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3.5 }}
                  className="mb-6"
                >
                  <div className="text-7xl mb-4">🤝</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-6">
                    Built by Community, for Community
                  </h2>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.6 }}
                  className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto"
                >
                  Trivesta is a movement as much as a product. Our roadmap is guided by the community, and our success depends on real people working together — through market cycles — to build something durable and valuable. If you&apos;re interested in participating, learning about the presale, or contributing to the roadmap, join our community channels and help shape the future we&apos;re building.
                </motion.p>
              </div>
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.7 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.8 }}
              className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 md:p-12 rounded-3xl shadow-xl text-white"
            >
              <h3 className="text-3xl font-bold mb-4">Ready to Join Us?</h3>
              <p className="text-xl text-primary-50 mb-6">
                Be part of the future of finance and infrastructure
              </p>
              <motion.a
                href="/invest"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-white text-primary-800 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Investing
              </motion.a>
            </motion.div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
