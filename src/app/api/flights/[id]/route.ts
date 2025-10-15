import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedFlight = await prisma.flightPackage.update({
      where: { id },
      data: {
        airline: body.airline,
        flightNumber: body.flightNumber,
        origin: body.origin,
        destination: body.destination,
        departureTime: body.departureTime,
        arrivalTime: body.arrivalTime,
        price: body.price,
        class: body.class,
        availableSeats: body.availableSeats,
        duration: body.duration,
        baggage: body.baggage,
        isActive: body.isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedFlight);
  } catch (error) {
    console.error('Error updating flight:', error);
    return NextResponse.json(
      { error: 'Failed to update flight' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.flightPackage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting flight:', error);
    return NextResponse.json(
      { error: 'Failed to delete flight' },
      { status: 500 }
    );
  }
}
