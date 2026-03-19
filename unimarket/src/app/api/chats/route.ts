import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const chats = await prisma.chatRoom.findMany({
      where: {
        OR: [
          { buyerId: session.user.id },
          { sellerId: session.user.id }
        ]
      },
      include: {
        product: true,
        buyer: { select: { name: true, image: true } },
        seller: { select: { name: true, image: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(chats);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (product.sellerId === session.user.id) {
        return NextResponse.json({ error: 'You cannot chat with yourself' }, { status: 400 });
    }

    // Find or create chat room
    const chatRoom = await prisma.chatRoom.upsert({
      where: {
        productId_buyerId_sellerId: {
          productId,
          buyerId: session.user.id,
          sellerId: product.sellerId
        }
      },
      update: {},
      create: {
        productId,
        buyerId: session.user.id,
        sellerId: product.sellerId
      }
    });

    return NextResponse.json(chatRoom);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
