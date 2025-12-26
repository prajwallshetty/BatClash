import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import UserBadge from '@/models/UserBadge';

/**
 * Get user's earned badges
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const badges = await UserBadge.find({ userId: session.user.id })
      .populate('badgeId')
      .sort({ earnedAt: -1 });

    return NextResponse.json({ badges });
  } catch (error: any) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}



