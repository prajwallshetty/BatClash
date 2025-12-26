import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import connectDB from '@/lib/mongodb';
import Problem from '@/models/Problem';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    const query: any = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const problems = await Problem.find(query)
      .select('-visibleTestCases -hiddenTestCases -starterCode -description')
      .sort({ createdAt: -1 });

    return NextResponse.json({ problems });
  } catch (error: any) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectDB();

    const body = await request.json();
    const {
      slug,
      title,
      category,
      topic,
      difficulty,
      description,
      starterCode,
      visibleTestCases,
      hiddenTestCases,
      xpReward,
    } = body;

    // Validation
    if (!slug || !title || !category || !topic || !difficulty || !description || !starterCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!visibleTestCases || visibleTestCases.length === 0) {
      return NextResponse.json(
        { error: 'At least one visible test case is required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await Problem.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: 'Problem with this slug already exists' },
        { status: 400 }
      );
    }

    const problem = await Problem.create({
      slug,
      title,
      category,
      topic,
      difficulty,
      description,
      starterCode,
      visibleTestCases,
      hiddenTestCases: hiddenTestCases || [],
      xpReward: xpReward || 50,
      solvedCount: 0,
    });

    return NextResponse.json({ problem }, { status: 201 });
  } catch (error: any) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Problem with this slug already exists' },
        { status: 400 }
      );
    }
    console.error('Error creating problem:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

