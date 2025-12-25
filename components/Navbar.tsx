'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export function Navbar() {
  const { data: session } = useSession();

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
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold hover:scale-105 transition-transform">
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="inline-block"
          >
            🦇 Batman
          </motion.span>
        </Link>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/problems">
                <Button variant="ghost" className="hover:bg-blue-50">
                  💻 Problems
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="ghost" className="hover:bg-purple-50">
                  📊 Leaderboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="hover:bg-pink-50">
                  👤 Profile
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-purple-50">
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getRankEmoji(session.user.rank)} {session.user.rank}
                </Badge>
                <span className="text-sm font-semibold text-blue-600">
                  {session.user.xp} XP
                </span>
                {session.user.streak > 0 && (
                  <span className="text-sm font-semibold text-orange-600 flex items-center gap-1">
                    🔥 {session.user.streak}
                  </span>
                )}
              </div>
              <Button onClick={() => signOut()} variant="outline" className="hover:bg-red-50">
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Sign In 🚀
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
