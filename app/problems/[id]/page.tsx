'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Loading } from '@/components/Loading';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

interface Problem {
  _id: string;
  slug?: string;
  title: string;
  description: string;
  category?: 'Web Dev' | 'DSA';
  topic?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starterCode: string;
  testCases?: any[]; // For backward compatibility (visible test cases)
  visibleTestCases?: any[];
  xpReward: number;
}

export default function ProblemPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!session) {
      router.push('/');
      return;
    }
    fetchProblem();
  }, [session, params.id]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/problems/${params.id}`);
      const data = await res.json();
      setProblem(data.problem);
      setCode(data.problem.starterCode || '');
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: problem._id,
          code,
        }),
      });

      const data = await res.json();
      setResult(data);

      if (data.isAccepted) {
        // Refresh session to update XP and stats
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      setResult({ error: 'Failed to submit code' });
    } finally {
      setSubmitting(false);
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
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!session) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  if (!problem) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-lg">Problem not found 😕</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{problem.title}</CardTitle>
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
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: problem.description }}
                />
              </CardContent>
            </Card>

            {/* Submission Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className={`${result.isAccepted ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {result.isAccepted ? '✅ Accepted!' : '❌ Submission Failed'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.error ? (
                        <p className="text-destructive">{result.error}</p>
                      ) : (
                        <div>
                          <p
                            className={
                              result.isAccepted
                                ? 'text-green-600 font-semibold text-lg'
                                : 'text-red-600 font-semibold text-lg'
                            }
                          >
                            {result.submission.status}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            ✅ Passed {result.submission.passedTests} / {result.submission.totalTests} tests
                          </p>
                          {result.submission.errorMessage && (
                            <p className="text-sm text-destructive mt-2">
                              {result.submission.errorMessage}
                            </p>
                          )}
                          {result.isAccepted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-4 p-4 bg-green-100 rounded-lg"
                            >
                              <p className="text-green-800 font-semibold">
                                🎉 Great job! You earned {problem.xpReward} XP!
                              </p>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💻 Code Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <MonacoEditor
                    height="500px"
                    language="javascript"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                    }}
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    {submitting ? '⏳ Submitting...' : '🚀 Submit Solution'}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
