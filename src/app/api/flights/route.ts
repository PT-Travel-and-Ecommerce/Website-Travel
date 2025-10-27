import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');

    const where: any = {
      isActive: true,
    };

    if (origin) {
      where.origin = {
        contains: origin,
        mode: 'insensitive',
      };
    }

    if (destination) {
      where.destination = {
        contains: destination,
        mode: 'insensitive',
      };
    }

    const flights = await prisma.flightPackage.findMany({
      where,
      orderBy: {
        price: 'asc',
      },
    });

    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flights' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newFlight = await prisma.flightPackage.create({
      data: {
        airline: body.airline,
        flightNumber: body.flightNumber,
        origin: body.origin,
        destination: body.destination,
        departureTime: body.departureTime,
        arrivalTime: body.arrivalTime,
        price: body.price,
        class: body.class || 'economy',
        availableSeats: body.availableSeats || 0,
        duration: body.duration || '0h 0m',
        baggage: body.baggage || '20kg',
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(newFlight);
  } catch (error) {
    console.error('Error creating flight:', error);
    return NextResponse.json(
      { error: 'Failed to create flight' },
      { status: 500 }
    );
  }
}
