'use client';

import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

// Mock leaderboard data for preview
const mockLeaderboard = [
  { rank: 1, name: 'Alex Chen', xp: 12500, rankBadge: 'Diamond' },
  { rank: 2, name: 'Sarah Kim', xp: 11200, rankBadge: 'Diamond' },
  { rank: 3, name: 'Jordan Lee', xp: 9800, rankBadge: 'Gold' },
  { rank: 4, name: 'Taylor Swift', xp: 8750, rankBadge: 'Gold' },
  { rank: 5, name: 'Morgan Park', xp: 7200, rankBadge: 'Silver' },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export default function Home() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);

  // Fetch real leaderboard data if available
  useEffect(() => {
    fetch('/api/leaderboard?limit=5')
      .then(res => res.json())
      .then(data => {
        if (data.leaderboard && data.leaderboard.length > 0) {
          setLeaderboard(data.leaderboard.slice(0, 5).map((user: any, idx: number) => ({
            rank: idx + 1,
            name: user.name,
            xp: user.xp,
            rankBadge: user.userRank,
          })));
        }
      })
      .catch(() => {
        // Use mock data if API fails
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-[#E5E7EB]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.2, delayChildren: 0.1 },
              },
            }}
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-semibold mb-6 leading-tight"
            >
              Sharpen Your Skills.
              <br />
              <span className="text-[#38BDF8]">Climb the Leaderboard.</span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Master Data Structures & Algorithms and Web Development challenges. 
              Build daily streaks, earn XP, unlock badges, and compete on the global leaderboard.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {!session ? (
                <>
                  <Button
                    onClick={() => signIn()}
                    className="bg-[#38BDF8] text-[#020617] hover:bg-[#38BDF8]/90 px-8 py-6 text-base font-semibold rounded-md"
                  >
                    Start Coding
                  </Button>
                  <Link href="/leaderboard">
                    <Button
                      variant="outline"
                      className="border-[#1E293B] text-[#E5E7EB] hover:bg-[#1E293B] px-8 py-6 text-base font-semibold rounded-md"
                    >
                      View Leaderboard
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/problems">
                  <Button className="bg-[#38BDF8] text-[#020617] hover:bg-[#38BDF8]/90 px-8 py-6 text-base font-semibold rounded-md">
                    Continue Coding
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Abstract bat-clash animation */}
            <motion.div
              variants={scaleIn}
              className="mt-20 flex items-center justify-center gap-8 opacity-20"
            >
              <motion.div
                animate={{
                  x: [0, -4, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="text-6xl"
              >
                ⚔
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="text-4xl font-bold text-[#38BDF8]"
              >
                CLASH
              </motion.div>
              <motion.div
                animate={{
                  x: [0, 4, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="text-6xl"
              >
                ⚔
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 border-t border-[#1E293B]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-semibold text-center mb-16"
            >
              How It Works
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Solve Problems',
                  description: 'Tackle DSA and Web Dev challenges across Easy, Medium, and Hard difficulties.',
                },
                {
                  step: '02',
                  title: 'Build Streaks',
                  description: 'Solve problems daily to maintain your streak and earn bonus XP rewards.',
                },
                {
                  step: '03',
                  title: 'Rise on Leaderboard',
                  description: 'Climb the ranks from Bronze to Diamond as you accumulate XP and solve more problems.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="border border-[#1E293B] rounded-md p-8 bg-[#020617]"
                >
                  <div className="text-[#38BDF8] text-sm font-semibold mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-[#94A3B8] leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 border-t border-[#1E293B]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-semibold text-center mb-16"
            >
              Features
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Daily Streaks',
                  description: 'Maintain your momentum with daily problem-solving streaks.',
                },
                {
                  title: 'Badges & XP',
                  description: 'Earn XP for each solved problem and unlock achievement badges.',
                },
                {
                  title: 'Certificates',
                  description: 'Download professional certificates for your milestones and achievements.',
                },
                {
                  title: 'Global Leaderboard',
                  description: 'Compete with developers worldwide and track your ranking.',
                },
                {
                  title: 'DSA & Web Dev',
                  description: 'Practice both Data Structures & Algorithms and Web Development challenges.',
                },
                {
                  title: 'Progress Tracking',
                  description: 'Monitor your XP, rank, solved problems, and streak progress.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="border border-[#1E293B] rounded-md p-6 bg-[#020617]"
                >
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leaderboard Preview Section */}
      <section className="py-24 px-4 border-t border-[#1E293B]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-semibold text-center mb-4"
            >
              Top Performers
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-[#94A3B8] text-center mb-12"
            >
              See who's leading the competition
            </motion.p>

            <motion.div
              variants={scaleIn}
              className="border border-[#1E293B] rounded-md overflow-hidden bg-[#020617]"
            >
              <div className="divide-y divide-[#1E293B]">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="flex items-center justify-between p-6 hover:bg-[#1E293B]/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-[#38BDF8] font-semibold w-8">#{user.rank}</div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-[#94A3B8]">{user.rankBadge}</div>
                      </div>
                    </div>
                    <div className="text-[#38BDF8] font-semibold">
                      {user.xp.toLocaleString()} XP
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="text-center mt-8"
            >
              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  className="border-[#1E293B] text-[#E5E7EB] hover:bg-[#1E293B]"
                >
                  View Full Leaderboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 border-t border-[#1E293B]">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-semibold mb-6"
            >
              Start your first streak today
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-[#94A3B8] mb-12 max-w-2xl mx-auto"
            >
              Join thousands of developers sharpening their skills and competing on the leaderboard.
            </motion.p>
            {!session && (
              <motion.div variants={fadeInUp}>
                <Button
                  onClick={() => signIn()}
                  className="bg-[#38BDF8] text-[#020617] hover:bg-[#38BDF8]/90 px-10 py-6 text-base font-semibold rounded-md"
                >
                  Sign in with Google
                </Button>
              </motion.div>
            )}
            {session && (
              <motion.div variants={fadeInUp}>
                <Link href="/problems">
                  <Button className="bg-[#38BDF8] text-[#020617] hover:bg-[#38BDF8]/90 px-10 py-6 text-base font-semibold rounded-md">
                    Browse Problems
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
