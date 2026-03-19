import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, amount, deliveryMethod, address, phone } = body;

    if (!productId || !amount || !deliveryMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a pending order
    const order = await prisma.order.create({
      data: {
        productId,
        buyerId: session.user.id,
        amount: parseFloat(amount),
        status: 'PENDING',
        // Note: You might want to add delivery details to the Order model in schema.prisma if needed
        // For now, these can be stored in a metadata JSON field if available, 
        // or just rely on the existing schema.
      },
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
