'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Emoji } from 'react-apple-emojis';

export function Navbar() {
  const { data: session } = useSession();

  const getRankEmoji = (rank: string) => {
    switch (rank) {
      case 'Diamond':
        return <Emoji name="sparkles" width={16} height={16} />;
      case 'Gold':
        return <Emoji name="1st-place-medal" width={16} height={16} />;
      case 'Silver':
        return <Emoji name="2nd-place-medal" width={16} height={16} />;
      case 'Bronze':
        return <Emoji name="3rd-place-medal" width={16} height={16} />;
      default:
        return <Emoji name="star" width={16} height={16} />;
    }
  };

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold hover:opacity-70 transition-opacity flex items-center gap-2">
          <Emoji name="bat" width={24} height={24} />
          <span>Batclash</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/problems">
                <Button variant="ghost" className="hover:bg-accent">
                  <Emoji name="laptop" width={16} height={16} className="mr-2" />
                  Problems
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="ghost" className="hover:bg-accent">
                  <Emoji name="bar-chart" width={16} height={16} className="mr-2" />
                  Leaderboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="hover:bg-accent">
                  <Emoji name="bust-in-silhouette" width={16} height={16} className="mr-2" />
                  Profile
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1 rounded border border-border bg-muted">
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getRankEmoji(session.user.rank)} {session.user.rank}
                </Badge>
                <span className="text-sm font-semibold">
                  {session.user.xp} XP
                </span>
                {session.user.streak > 0 && (
                  <span className="text-sm font-semibold flex items-center gap-1">
                    <Emoji name="fire" width={16} height={16} /> {session.user.streak}
                  </span>
                )}
              </div>
              <Button onClick={() => signOut()} variant="outline">
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn()} className="bg-foreground text-background hover:opacity-90">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
