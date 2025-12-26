import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Reset weekly XP for all users
 * This should be called weekly (e.g., via a cron job)
 */
export async function POST() {
  try {
    await connectDB();

    const result = await User.updateMany(
      {},
      { $set: { weeklyXp: 0 } }
    );

    return NextResponse.json({
      message: 'Weekly XP reset successfully',
      usersUpdated: result.modifiedCount,
    });
  } catch (error: any) {
    console.error('Error resetting weekly XP:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}



