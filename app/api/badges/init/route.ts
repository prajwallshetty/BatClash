import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Badge from '@/models/Badge';

/**
 * Initialize default badges in the database
 * Call this once to seed the badges
 */
export async function POST() {
  try {
    await connectDB();

    const defaultBadges = [
      {
        name: 'First Problem',
        description: 'Solved your first problem',
        icon: '🎯',
        condition: 'first_problem',
      },
      {
        name: '7-Day Streak',
        description: 'Maintained a 7-day solving streak',
        icon: '🔥',
        condition: 'streak_7',
      },
      {
        name: 'Problem Solver',
        description: 'Solved 50 problems',
        icon: '🏆',
        condition: 'solved_50',
      },
      {
        name: 'Top 10',
        description: 'Ranked in the top 10 leaderboard',
        icon: '⭐',
        condition: 'top_10',
      },
    ];

    for (const badgeData of defaultBadges) {
      await Badge.findOneAndUpdate(
        { condition: badgeData.condition },
        badgeData,
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ message: 'Badges initialized successfully' });
  } catch (error: any) {
    console.error('Error initializing badges:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}



