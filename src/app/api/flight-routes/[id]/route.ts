import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const flightRoute = await db.flightRoute.findUnique({
      where: { id },
      include: {
        departureCity: true,
        arrivalCity: true,
      },
    });

    if (!flightRoute) {
      return NextResponse.json(
        { error: 'Flight route not found' },
        { status: 404 }
      );
    }

    // Map totalPrice to price for frontend compatibility
    const mappedRoute = {
      ...flightRoute,
      price: flightRoute.totalPrice,
    };

    return NextResponse.json(mappedRoute);
  } catch (error) {
    console.error('Error fetching flight route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flight route' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {
      updatedAt: new Date(),
    };

    // Handle city relations with connect syntax
    if (body.departureCityId) {
      updateData.departureCity = { connect: { id: body.departureCityId } };
    }
    if (body.arrivalCityId) {
      updateData.arrivalCity = { connect: { id: body.arrivalCityId } };
    }
    
    // Parse dates safely without timezone issues
    if (body.departureDate) {
      const [year, month, day] = body.departureDate.split('-').map(Number);
      updateData.departureDate = new Date(Date.UTC(year, month - 1, day));
    }
    if (body.returnDate !== undefined) {
      if (body.returnDate) {
        const [year, month, day] = body.returnDate.split('-').map(Number);
        updateData.returnDate = new Date(Date.UTC(year, month - 1, day));
      } else {
        updateData.returnDate = null;
      }
    }
    if (body.airline) updateData.airline = body.airline;
    if (body.departureTime) updateData.departureTime = new Date(`1970-01-01T${body.departureTime}`);
    if (body.arrivalTime) updateData.arrivalTime = new Date(`1970-01-01T${body.arrivalTime}`);
    if (body.duration) updateData.duration = body.duration;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.availableSeats !== undefined) updateData.availableSeats = body.availableSeats;
    if (body.flightClass) updateData.flightClass = body.flightClass;
    if (body.baggageInfo !== undefined) updateData.baggageInfo = body.baggageInfo;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.baseFare !== undefined) updateData.baseFare = body.baseFare;
    if (body.tax !== undefined) updateData.tax = body.tax;
    if (body.serviceFee !== undefined) updateData.serviceFee = body.serviceFee;
    if (body.baggageFee !== undefined) updateData.baggageFee = body.baggageFee;
    if (body.wifiFee !== undefined) updateData.wifiFee = body.wifiFee;
    if (body.mealFee !== undefined) updateData.mealFee = body.mealFee;
    if (body.insuranceFee !== undefined) updateData.insuranceFee = body.insuranceFee;
    if (body.otherFees !== undefined) updateData.otherFees = body.otherFees;
    if (body.discount !== undefined) updateData.discount = body.discount;
    if (body.totalPrice !== undefined) updateData.totalPrice = body.totalPrice;

    const flightRoute = await db.flightRoute.update({
      where: { id },
      data: updateData,
      include: {
        departureCity: true,
        arrivalCity: true,
      },
    });

    // Map totalPrice to price for frontend compatibility
    const mappedRoute = {
      ...flightRoute,
      price: flightRoute.totalPrice,
    };

    return NextResponse.json(mappedRoute);
  } catch (error) {
    console.error('Error updating flight route:', error);
    return NextResponse.json(
      { error: 'Failed to update flight route' },
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
    await db.flightRoute.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Flight route deleted successfully' });
  } catch (error) {
    console.error('Error deleting flight route:', error);
    return NextResponse.json(
      { error: 'Failed to delete flight route' },
      { status: 500 }
    );
  }
}
