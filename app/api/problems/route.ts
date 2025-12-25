import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Problem from '@/models/Problem';

/**
 * Get all problems with optional filtering by difficulty
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const difficulty = searchParams.get('difficulty');

    const query = difficulty ? { difficulty } : {};
    const problems = await Problem.find(query)
      .select('-testCases -starterCode')
      .sort({ createdAt: -1 });

    return NextResponse.json({ problems });
  } catch (error: any) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


