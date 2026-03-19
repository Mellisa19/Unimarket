import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { schoolName, studentId, idImage } = body;

    // Create a new verification request for admin review
    const verificationRequest = await prisma.verificationRequest.create({
      data: {
        userId: session.user.id,
        schoolName,
        studentId,
        idImage,
        status: 'PENDING',
      },
    });

    // We keep the user's current verification status as is (likely false)
    // until an admin approves the request.

    console.log(`New Verification Request created for ${session.user.email}`);

    return NextResponse.json({ success: true, request: verificationRequest });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
