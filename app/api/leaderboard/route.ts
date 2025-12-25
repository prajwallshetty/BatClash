import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Get leaderboard data (global or weekly)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'global'; // 'global' or 'weekly'
    const limit = parseInt(searchParams.get('limit') || '100');

    const sortField = type === 'weekly' ? 'weeklyXp' : 'xp';
    
    const users = await User.find()
      .select('name email xp weeklyXp rank streak solvedCount image')
      .sort({ [sortField]: -1 })
      .limit(limit);

    return NextResponse.json({
      leaderboard: users.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        email: user.email,
        image: user.image,
        xp: user.xp,
        weeklyXp: user.weeklyXp,
        userRank: user.rank,
        streak: user.streak,
        solvedCount: user.solvedCount,
      })),
      type,
    });
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

