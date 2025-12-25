import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Certificate from '@/models/Certificate';
import { generateCertificate } from '@/lib/certificate';

/**
 * Generate a certificate for a user milestone and return as download
 */
export async function POST(request: NextRequest) {
  try {
    // Get session - in Next.js 14, we need to pass headers
    const session = await getServerSession(authOptions);
    
    // Debug logging
    console.log('Certificate generation request:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      userId: session?.user?.id,
    });
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Unauthorized. Please sign in to generate certificates.',
        debug: 'No session or user found'
      }, { status: 401 });
    }
    
    if (!session.user.id) {
      return NextResponse.json({ 
        error: 'User ID not found in session. Please try signing out and signing back in.',
        debug: 'Session exists but user.id is missing'
      }, { status: 401 });
    }

    const { type, title, description } = await request.json();

    if (!type || !title || !description) {
      return NextResponse.json(
        { error: 'Type, title, and description are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Try to find user by ID first, then by email as fallback
    let user = null;
    if (session.user.id) {
      user = await User.findById(session.user.id);
    }
    
    // Fallback: find by email if ID lookup failed
    if (!user && session.user.email) {
      user = await User.findOne({ email: session.user.email });
      console.log('Found user by email fallback:', !!user);
    }
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found. Please try signing out and signing back in.',
        debug: {
          userId: session.user.id,
          userEmail: session.user.email
        }
      }, { status: 404 });
    }

    // Generate unique certificate ID
    const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Generate PDF
    const pdfBuffer = await generateCertificate(user, type, title, description, certificateId);

    // Save certificate record to database
    const certificate = await Certificate.create({
      userId: user._id,
      certificateId,
      type,
      title,
      description,
      pdfUrl: `/certificates/${certificateId}`, // Link to view page
      issuedAt: new Date(),
    });

    // Return PDF as download response with certificate ID in headers
    const filename = `certificate-${certificateId}.pdf`;
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'X-Certificate-Id': certificateId,
      },
    });
  } catch (error: any) {
    console.error('Certificate generation error:', error);
    const errorMessage = error?.message || 'Internal server error';
    console.error('Full error details:', {
      message: errorMessage,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

