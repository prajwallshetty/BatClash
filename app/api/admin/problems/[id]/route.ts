import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import connectDB from '@/lib/mongodb';
import Problem from '@/models/Problem';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);
    await connectDB();

    const problem = await Problem.findById(params.id);
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ problem });
  } catch (error: any) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if slug is taken by another problem
    const existing = await Problem.findOne({ slug, _id: { $ne: params.id } });
    if (existing) {
      return NextResponse.json(
        { error: 'Problem with this slug already exists' },
        { status: 400 }
      );
    }

    const problem = await Problem.findByIdAndUpdate(
      params.id,
      {
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
      },
      { new: true, runValidators: true }
    );

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ problem });
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
    console.error('Error updating problem:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);
    await connectDB();

    const problem = await Problem.findByIdAndDelete(params.id);
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Problem deleted successfully' });
  } catch (error: any) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting problem:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

