import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { sellerId, productId, rating, comment } = await req.json();

    if (!sellerId || !rating) {
      return NextResponse.json({ error: 'Seller ID and Rating are required' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        buyerId: session.user.id,
        sellerId,
        productId,
        rating: parseInt(rating),
        comment,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) return NextResponse.json({ error: 'Seller ID required' }, { status: 400 });

    const reviews = await prisma.review.findMany({
        where: { sellerId },
        include: {
            buyer: { select: { name: true, image: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reviews);
}
