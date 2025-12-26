import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Problem from '@/models/Problem';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);
    await connectDB();

    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !slug || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug is taken by another category
    const existing = await Category.findOne({ slug, _id: { $ne: params.id } });
    if (existing) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndUpdate(
      params.id,
      { name, slug, description },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error: any) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists' },
        { status: 400 }
      );
    }
    console.error('Error updating category:', error);
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

    // Check if any problems are using this category
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Note: Since we're using category as a string field in Problem model,
    // we check by category name, not by reference
    const problemsWithCategory = await Problem.countDocuments({ category: category.name });
    if (problemsWithCategory > 0) {
      return NextResponse.json(
        { error: `Cannot delete category: ${problemsWithCategory} problem(s) are using it` },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

