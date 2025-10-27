import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const popularRoute = await db.popularFlightRoute.update({
      where: { id },
      data: {
        displayOrder: body.displayOrder,
        isActive: body.isActive,
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

    return NextResponse.json(popularRoute);
  } catch (error) {
    console.error('Error updating popular flight route:', error);
    return NextResponse.json(
      { error: 'Failed to update popular flight route' },
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

    await db.popularFlightRoute.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Popular flight route deleted successfully' });
  } catch (error) {
    console.error('Error deleting popular flight route:', error);
    return NextResponse.json(
      { error: 'Failed to delete popular flight route' },
      { status: 500 }
    );
  }
}
