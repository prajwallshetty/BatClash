'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Emoji } from 'react-apple-emojis';

interface Problem {
  _id: string;
  title: string;
  description: string;
  category: 'Web Dev' | 'DSA';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  solvedCount: number;
}

export default function ProblemsPage() {
  const { data: session } = useSession();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    fetchProblems();
  }, [session, filter, category]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (filter !== 'all') params.append('difficulty', filter);
      const url = params.toString() ? `/api/problems?${params.toString()}` : '/api/problems';
      const res = await fetch(url);
      const data = await res.json();
      setProblems(data.problems || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-foreground text-background';
      case 'Medium':
        return 'bg-muted text-foreground';
      case 'Hard':
        return 'bg-foreground text-background';
      default:
        return 'bg-muted';
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
            <Emoji name="laptop" width={32} height={32} />
            Coding Problems
          </h1>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-semibold text-muted-foreground self-center">Category:</span>
              {['all', 'Web Dev', 'DSA'].map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'}
                  onClick={() => setCategory(cat)}
                  className={category === cat ? 'bg-foreground text-background hover:opacity-90' : ''}
                >
                  {cat === 'all' ? 'All' : cat === 'Web Dev' ? (
                    <>
                      <Emoji name="globe-showing-americas" width={16} height={16} className="mr-2" />
                      Web Dev
                    </>
                  ) : (
                    <>
                      <Emoji name="bar-chart" width={16} height={16} className="mr-2" />
                      DSA
                    </>
                  )}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-semibold text-muted-foreground self-center">Difficulty:</span>
              {['all', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={filter === difficulty ? 'default' : 'outline'}
                  onClick={() => setFilter(difficulty)}
                  className={filter === difficulty ? 'bg-foreground text-background hover:opacity-90' : ''}
                >
                  {difficulty === 'all' ? 'All' : difficulty}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg">Loading problems...</p>
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
              <Card className="border border-border">
                <CardContent className="py-12 text-center">
                  <p className="text-lg text-muted-foreground">
                    No problems found. Check back later!
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
                  <Card className="hover:shadow-lg transition-all duration-300 border border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{problem.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {problem.category === 'Web Dev' ? (
                              <><Emoji name="globe-showing-americas" width={12} height={12} className="mr-1" /> Web Dev</>
                            ) : (
                              <><Emoji name="bar-chart" width={12} height={12} className="mr-1" /> DSA</>
                            )}
                          </Badge>
                          <Badge
                            className={getDifficultyColor(problem.difficulty)}
                          >
                            {problem.difficulty}
                          </Badge>
                          <span className="text-sm font-semibold">
                            {problem.xpReward} XP
                          </span>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Emoji name="white-check-mark" width={16} height={16} />
                        <span>{problem.solvedCount} solved</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/problems/${problem._id}`}>
                        <Button className="w-full bg-foreground text-background hover:opacity-90">
                          Solve Problem
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
