import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // In a real app, check for ADMIN role: if (session?.user.role !== 'ADMIN') ...
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const requests = await prisma.verificationRequest.findMany({
      include: {
        user: { select: { name: true, email: true, image: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, status, adminNote } = await req.json();

    const request = await prisma.verificationRequest.update({
      where: { id },
      data: { status, adminNote }
    });

    // If approved, update the user's isVerified status
    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: request.userId },
        data: { 
          isVerified: true,
          studentId: request.studentId
        }
      });
    } else if (status === 'REJECTED') {
      await prisma.user.update({
        where: { id: request.userId },
        data: { isVerified: false }
      });
    }

    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
