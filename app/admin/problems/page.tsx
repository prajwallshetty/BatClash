'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Emoji } from 'react-apple-emojis';

interface Problem {
  _id: string;
  slug: string;
  title: string;
  category: 'Web Dev' | 'DSA';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  solvedCount: number;
}

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  useEffect(() => {
    fetchProblems();
  }, [categoryFilter, difficultyFilter]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (difficultyFilter !== 'all') params.append('difficulty', difficultyFilter);
      const url = `/api/admin/problems${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch problems');
      const data = await res.json();
      setProblems(data.problems || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete problem "${slug}"?`)) return;

    try {
      const res = await fetch(`/api/admin/problems/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete problem');
      fetchProblems();
    } catch (error) {
      console.error('Error deleting problem:', error);
      alert('Failed to delete problem');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'Hard':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-foreground/10 text-foreground border-foreground/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-foreground/70">Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Problem Management</h1>
          <p className="text-foreground/70">Manage all coding problems</p>
        </div>
        <Link href="/admin/problems/new">
          <Button className="bg-foreground text-background hover:opacity-90">
            <Emoji name="plus" className="w-4 h-4 mr-2" />
            Create Problem
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-2 border-foreground/10">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg bg-background text-foreground"
              >
                <option value="all">All Categories</option>
                <option value="DSA">DSA</option>
                <option value="Web Dev">Web Dev</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg bg-background text-foreground"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problems List */}
      <Card className="border-2 border-foreground/10">
        <CardHeader>
          <CardTitle>Problems ({problems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {problems.length === 0 ? (
            <p className="text-center py-8 text-foreground/70">No problems found</p>
          ) : (
            <div className="space-y-2">
              {problems.map((problem) => (
                <div
                  key={problem._id}
                  className="flex items-center justify-between p-4 border-2 border-foreground/10 rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{problem.title}</h3>
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <Badge variant="outline">{problem.category}</Badge>
                      <span className="text-sm text-foreground/70">({problem.topic})</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-foreground/70">
                      <span>Slug: {problem.slug}</span>
                      <span>XP: {problem.xpReward}</span>
                      <span>Solved: {problem.solvedCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/problems/${problem._id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Emoji name="pencil" className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(problem._id, problem.slug)}
                      className="text-red-600 hover:text-red-700 hover:border-red-600"
                    >
                      <Emoji name="wastebasket" className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

