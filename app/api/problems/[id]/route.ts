import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Problem from '@/models/Problem';

/**
 * Get a single problem by ID with all details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const problem = await Problem.findById(params.id);
    
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Return problem with visible test cases only (hide hidden test cases from client)
    const problemResponse = {
      ...problem.toObject(),
      testCases: problem.visibleTestCases, // For backward compatibility
      hiddenTestCases: undefined, // Don't expose hidden test cases
    };

    return NextResponse.json({ problem: problemResponse });
  } catch (error: any) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}



