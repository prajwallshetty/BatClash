'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  image?: string;
  xp: number;
  weeklyXp: number;
  userRank: string;
  streak: number;
  solvedCount: number;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [type, setType] = useState<'global' | 'weekly'>('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [type]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leaderboard?type=${type}`);
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Diamond':
        return 'text-blue-600';
      case 'Gold':
        return 'text-yellow-600';
      case 'Silver':
        return 'text-gray-600';
      case 'Bronze':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTopThreeEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                📊 Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={type} onValueChange={(v) => setType(v as 'global' | 'weekly')}>
                <TabsList>
                  <TabsTrigger value="global">🌍 Global</TabsTrigger>
                  <TabsTrigger value="weekly">📅 Weekly</TabsTrigger>
                </TabsList>
                <TabsContent value={type}>
                  {loading ? (
                    <div className="text-center py-12">
                      <p className="text-lg">Loading leaderboard... ⏳</p>
                    </div>
                  ) : (
                    <motion.div
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.05,
                          },
                        },
                      }}
                      className="space-y-2 mt-4"
                    >
                      {leaderboard.map((entry, index) => {
                        const isCurrentUser = session?.user?.email === entry.email;
                        const topThree = getTopThreeEmoji(entry.rank);
                        
                        return (
                          <motion.div
                            key={entry.email}
                            variants={{
                              hidden: { opacity: 0, x: -20 },
                              show: { opacity: 1, x: 0 },
                            }}
                            className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                              isCurrentUser
                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md'
                                : 'hover:bg-gray-50'
                            } ${topThree ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' : ''}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-2xl font-bold w-12 text-center">
                                {topThree || `#${entry.rank}`}
                              </div>
                              {entry.image && (
                                <motion.img
                                  src={entry.image}
                                  alt={entry.name}
                                  className="w-12 h-12 rounded-full border-2 border-blue-200"
                                  whileHover={{ scale: 1.1 }}
                                />
                              )}
                              <div>
                                <div className="font-semibold flex items-center gap-2">
                                  {entry.name}
                                  {isCurrentUser && <span className="text-blue-600">(You)</span>}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {entry.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-semibold text-lg">
                                  {type === 'weekly' ? entry.weeklyXp : entry.xp} ⭐
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  ✅ {entry.solvedCount} solved
                                </div>
                              </div>
                              <Badge className={`${getRankColor(entry.userRank)} text-base`}>
                                {getRankEmoji(entry.userRank)} {entry.userRank}
                              </Badge>
                              {entry.streak > 0 && (
                                <div className="text-sm font-semibold text-orange-600 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50">
                                  🔥 {entry.streak}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
