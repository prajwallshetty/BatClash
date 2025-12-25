'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  solvedCount: number;
}

export default function ProblemsPage() {
  const { data: session } = useSession();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    fetchProblems();
  }, [session, filter]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const url = filter !== 'all' 
        ? `/api/problems?difficulty=${filter}`
        : '/api/problems';
      const res = await fetch(url);
      const data = await res.json();
      setProblems(data.problems || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '🟢';
      case 'Medium':
        return '🟡';
      case 'Hard':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500 hover:bg-green-600';
      case 'Medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Hard':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Please sign in to view problems</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
            💻 Coding Problems
          </h1>
          <div className="flex gap-2 flex-wrap">
            {['all', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
              <Button
                key={difficulty}
                variant={filter === difficulty ? 'default' : 'outline'}
                onClick={() => setFilter(difficulty)}
                className="transition-all"
              >
                {difficulty === 'all' ? '📋 All' : `${getDifficultyEmoji(difficulty)} ${difficulty}`}
              </Button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg">Loading problems... ⏳</p>
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
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid gap-4"
          >
            {problems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-lg text-muted-foreground">
                    No problems found. Check back later! 📝
                  </p>
                </CardContent>
              </Card>
            ) : (
              problems.map((problem, index) => (
                <motion.div
                  key={problem._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{problem.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${getDifficultyColor(problem.difficulty)} text-white`}
                          >
                            {getDifficultyEmoji(problem.difficulty)} {problem.difficulty}
                          </Badge>
                          <span className="text-sm font-semibold text-blue-600">
                            ⭐ {problem.xpReward} XP
                          </span>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <span>✅ {problem.solvedCount} solved</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/problems/${problem._id}`}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          Solve Problem 🚀
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
