import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const departureCityId = searchParams.get('departureCityId');
    const arrivalCityId = searchParams.get('arrivalCityId');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const airline = searchParams.get('airline');
    const minRating = searchParams.get('minRating');

    const where: any = {};

    if (departureCityId) {
      where.departureCityId = departureCityId;
    }

    if (arrivalCityId) {
      where.arrivalCityId = arrivalCityId;
    }

    // Fix: Use date range instead of exact match to handle timezone issues
    if (departureDate) {
      const searchDate = new Date(departureDate);
      // Strip time component for date-only comparison
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      where.departureDate = {
        gte: searchDate,
        lt: nextDay
      };
    }

    // For round trip, optionally filter by return date
    if (returnDate) {
      const searchReturnDate = new Date(returnDate);
      searchReturnDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchReturnDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      where.returnDate = {
        gte: searchReturnDate,
        lt: nextDay
      };
    }

    if (minPrice || maxPrice) {
      where.totalPrice = {};
      if (minPrice) where.totalPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.totalPrice.lte = parseFloat(maxPrice);
    }

    if (airline) {
      where.airline = airline;
    }

    if (minRating) {
      where.rating = {
        gte: parseInt(minRating)
      };
    }

    const flightRoutes = await db.flightRoute.findMany({
      where,
      include: {
        departureCity: true,
        arrivalCity: true,
      },
      orderBy: {
        departureDate: 'asc',
      },
    });

    // Map totalPrice to price for frontend compatibility
    const mappedRoutes = flightRoutes.map(route => ({
      ...route,
      price: route.totalPrice, // Frontend expects 'price' field
    }));

    return NextResponse.json(mappedRoutes);
  } catch (error) {
    console.error('Error fetching flight routes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flight routes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const flightRoute = await db.flightRoute.create({
      data: {
        departureCityId: body.departureCityId,
        arrivalCityId: body.arrivalCityId,
        departureDate: new Date(body.departureDate),
        returnDate: body.returnDate ? new Date(body.returnDate) : null,
        airline: body.airline,
        departureTime: new Date(`1970-01-01T${body.departureTime}`),
        arrivalTime: new Date(`1970-01-01T${body.arrivalTime}`),
        duration: body.duration,
        rating: body.rating || 0,
        availableSeats: body.availableSeats || 0,
        flightClass: body.flightClass || 'economy',
        baggageInfo: body.baggageInfo || null,
        imageUrl: body.imageUrl || '',
        description: body.description || '',
        baseFare: body.baseFare || 0,
        tax: body.tax || 0,
        serviceFee: body.serviceFee || 0,
        baggageFee: body.baggageFee || 0,
        wifiFee: body.wifiFee || 0,
        mealFee: body.mealFee || 0,
        insuranceFee: body.insuranceFee || 0,
        otherFees: body.otherFees || [],
        discount: body.discount || 0,
        totalPrice: body.totalPrice || 0,
      },
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

    return NextResponse.json(mappedRoute, { status: 201 });
  } catch (error) {
    console.error('Error creating flight route:', error);
    return NextResponse.json(
      { error: 'Failed to create flight route' },
      { status: 500 }
    );
  }
}
