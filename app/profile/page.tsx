'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loading } from '@/components/Loading';

interface UserBadge {
  _id: string;
  badgeId: {
    name: string;
    description: string;
    icon: string;
  };
  earnedAt: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (session) {
      fetchBadges();
    }
  }, [session]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/profile/badges');
      const data = await res.json();
      setBadges(data.badges || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (type: string, title: string, description: string) => {
    try {
      setGenerating(true);
      const res = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, title, description }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate certificate');
      }

      // Get the PDF blob and download it
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  const getRankEmoji = (rank: string) => {
    switch (rank) {
      case 'Diamond':
        return '💎';
      case 'Gold':
        return '🥇';
      case 'Silver':
        return '🥈';
      case 'Bronze':
        return '🥉';
      default:
        return '⭐';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* User Stats */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                👤 Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {session.user.image && (
                  <motion.img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-20 h-20 rounded-full border-4 border-blue-200"
                    whileHover={{ scale: 1.1 }}
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{session.user.name}</h2>
                  <p className="text-muted-foreground">{session.user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-lg bg-blue-50 text-center"
                >
                  <div className="text-3xl font-bold text-blue-600">{session.user.xp}</div>
                  <div className="text-sm text-muted-foreground">⭐ Total XP</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-lg bg-green-50 text-center"
                >
                  <div className="text-3xl font-bold text-green-600">{session.user.solvedCount}</div>
                  <div className="text-sm text-muted-foreground">✅ Problems Solved</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-lg bg-orange-50 text-center"
                >
                  <div className="text-3xl font-bold text-orange-600">{session.user.streak}</div>
                  <div className="text-sm text-muted-foreground">🔥 Day Streak</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-lg bg-purple-50 text-center"
                >
                  <Badge className={`text-lg ${getRankEmoji(session.user.rank) ? '' : ''}`}>
                    {getRankEmoji(session.user.rank)} {session.user.rank}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">Rank</div>
                </motion.div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() =>
                    handleGenerateCertificate(
                      'milestone',
                      'Achievement Certificate',
                      `This certificate recognizes ${session.user.name} for solving ${session.user.solvedCount} problems and achieving ${session.user.rank} rank.`
                    )
                  }
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {generating ? '⏳ Generating...' : '📜 Download Certificate'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                🏆 Badges & Achievements
              </CardTitle>
              <CardDescription>Your earned achievements</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loading />
                </div>
              ) : badges.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No badges earned yet. Keep solving problems! 💪
                </p>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  {badges.map((userBadge) => (
                    <motion.div
                      key={userBadge._id}
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        show: { opacity: 1, scale: 1 },
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="p-4 border rounded-lg text-center bg-gradient-to-br from-yellow-50 to-orange-50"
                    >
                      <div className="text-5xl mb-2">{userBadge.badgeId.icon}</div>
                      <div className="font-semibold">{userBadge.badgeId.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {userBadge.badgeId.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Earned {new Date(userBadge.earnedAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
