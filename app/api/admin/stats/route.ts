import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import connectDB from '@/lib/mongodb';
import Problem from '@/models/Problem';
import User from '@/models/User';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectDB();

    const [totalProblems, totalUsers, totalCategories, problems] = await Promise.all([
      Problem.countDocuments(),
      User.countDocuments(),
      Category.countDocuments(),
      Problem.find({}, 'category difficulty'),
    ]);

    const problemsByCategory = problems.reduce((acc: any, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    const problemsByDifficulty = problems.reduce((acc: any, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      totalProblems,
      totalUsers,
      totalCategories,
      problemsByCategory: Object.entries(problemsByCategory).map(([category, count]) => ({
        category,
        count,
      })),
      problemsByDifficulty: Object.entries(problemsByDifficulty).map(([difficulty, count]) => ({
        difficulty,
        count,
      })),
    });
  } catch (error: any) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

