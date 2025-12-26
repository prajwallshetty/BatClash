'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Emoji } from 'react-apple-emojis';

interface DashboardStats {
  totalProblems: number;
  totalUsers: number;
  totalCategories: number;
  problemsByCategory: { category: string; count: number }[];
  problemsByDifficulty: { difficulty: string; count: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-foreground/70">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-foreground/70">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-foreground/70">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-foreground/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Emoji name="laptop" className="w-5 h-5" />
              Total Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalProblems}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-foreground/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Emoji name="bust-in-silhouette" className="w-5 h-5" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-foreground/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Emoji name="folder" className="w-5 h-5" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalCategories}</p>
          </CardContent>
        </Card>
      </div>

      {/* Problems by Category */}
      <Card className="border-2 border-foreground/10">
        <CardHeader>
          <CardTitle>Problems by Category</CardTitle>
          <CardDescription>Distribution of problems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.problemsByCategory.map((item) => (
              <div key={item.category} className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0">
                <span className="font-medium">{item.category}</span>
                <span className="text-foreground/70">{item.count} problems</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Problems by Difficulty */}
      <Card className="border-2 border-foreground/10">
        <CardHeader>
          <CardTitle>Problems by Difficulty</CardTitle>
          <CardDescription>Distribution by difficulty level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.problemsByDifficulty.map((item) => (
              <div key={item.difficulty} className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0">
                <span className="font-medium">{item.difficulty}</span>
                <span className="text-foreground/70">{item.count} problems</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

