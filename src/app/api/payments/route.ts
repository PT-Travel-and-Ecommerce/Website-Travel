import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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
