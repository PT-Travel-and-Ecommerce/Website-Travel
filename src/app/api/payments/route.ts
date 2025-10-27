import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get('session_role')?.value;

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      include: {
        flightRoute: {
          include: {
            departureCity: true,
            arrivalCity: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newPayment = await prisma.payment.create({
      data: {
        flightRouteId: body.flightRouteId,
        userId: body.userId || null,
        userEmail: body.userEmail,
        userName: body.userName,
        status: body.status || 'pending',
        amount: body.amount,
      },
      include: {
        flightRoute: {
          include: {
            departureCity: true,
            arrivalCity: true,
          },
        },
      },
    });

    return NextResponse.json(newPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
