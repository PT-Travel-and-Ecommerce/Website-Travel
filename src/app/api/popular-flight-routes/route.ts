import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET() {
  try {
    const popularRoutes = await db.popularFlightRoute.findMany({
      where: {
        isActive: true,
      },
      include: {
        flightRoute: {
          include: {
            departureCity: true,
            arrivalCity: true,
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    // Map totalPrice to price for frontend compatibility
    const mappedRoutes = popularRoutes.map(route => ({
      ...route,
      flightRoute: {
        ...route.flightRoute,
        price: route.flightRoute.totalPrice,
      },
    }));

    return NextResponse.json(mappedRoutes);
  } catch (error) {
    console.error('Error fetching popular flight routes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular flight routes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const existingPopular = await db.popularFlightRoute.findUnique({
      where: {
        flightRouteId: body.flightRouteId,
      },
    });

    if (existingPopular) {
      return NextResponse.json(
        { error: 'This flight route is already marked as popular' },
        { status: 400 }
      );
    }

    const popularRoute = await db.popularFlightRoute.create({
      data: {
        flightRouteId: body.flightRouteId,
        displayOrder: body.displayOrder || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
        imageUrl: body.imageUrl || null,
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

    // Map totalPrice to price for frontend compatibility
    const mappedRoute = {
      ...popularRoute,
      flightRoute: {
        ...popularRoute.flightRoute,
        price: popularRoute.flightRoute.totalPrice,
      },
    };

    return NextResponse.json(mappedRoute, { status: 201 });
  } catch (error) {
    console.error('Error creating popular flight route:', error);
    return NextResponse.json(
      { error: 'Failed to create popular flight route' },
      { status: 500 }
    );
  }
}
