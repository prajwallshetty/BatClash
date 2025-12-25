'use client';

import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Emoji } from 'react-apple-emojis';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 flex items-center justify-center gap-3">
            <Emoji name="bat" width={48} height={48} />
            Welcome to Batclash
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A solo coding platform to sharpen your problem-solving skills
          </p>
          {!session && (
            <Link href="/auth/signin">
              <Button size="lg" className="text-lg px-8 bg-foreground text-background hover:opacity-90">
                Get Started
              </Button>
            </Link>
          )}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={item}>
            <Card className="hover:shadow-lg transition-shadow duration-300 border border-border">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Emoji name="laptop" width={24} height={24} />
                  Solve Problems
                </CardTitle>
                <CardDescription>
                  Practice coding with JavaScript challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/problems">
                  <Button className="w-full bg-foreground text-background hover:opacity-90">Browse Problems →</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="hover:shadow-lg transition-shadow duration-300 border border-border">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Emoji name="sparkles" width={24} height={24} />
                  Earn XP & Ranks
                </CardTitle>
                <CardDescription>
                  Level up from Bronze to Diamond
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-semibold">
                    Easy: 50 XP
                  </p>
                  <p className="text-sm font-semibold">
                    Medium: 100 XP
                  </p>
                  <p className="text-sm font-semibold">
                    Hard: 200 XP
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="hover:shadow-lg transition-shadow duration-300 border border-border">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Emoji name="trophy" width={24} height={24} />
                  Track Progress
                </CardTitle>
                <CardDescription>
                  Build streaks and unlock achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><Emoji name="fire" width={16} height={16} /> Daily streaks</p>
                  <p>Badges & achievements</p>
                  <p>Certificates</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {session && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Welcome back, {session.user.name}! <Emoji name="waving-hand" width={24} height={24} />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {session.user.xp}
                  </div>
                  <div className="text-sm text-muted-foreground">XP</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {session.user.streak}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Emoji name="fire" width={16} height={16} /> Streak
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {session.user.solvedCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Solved</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
