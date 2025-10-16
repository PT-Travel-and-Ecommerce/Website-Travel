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

    // Date filtering with timezone-safe parsing
    if (departureDate) {
      try {
        // Handle both ISO format and simple date format
        let dateStr = departureDate;
        if (dateStr.includes('T')) {
          dateStr = dateStr.split('T')[0]; // Extract date part from ISO string
        }
        
        const [year, month, day] = dateStr.split('-').map(Number);
        if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
          throw new Error('Invalid date format');
        }
        
        const searchDate = new Date(Date.UTC(year, month - 1, day));
        const nextDay = new Date(Date.UTC(year, month - 1, day + 1));
        
        where.departureDate = {
          gte: searchDate,
          lt: nextDay
        };
      } catch (error) {
        console.error('Error parsing departure date:', departureDate, error);
        // Skip date filter if invalid
      }
    }

    // For round trip, optionally filter by return date
    if (returnDate) {
      try {
        let dateStr = returnDate;
        if (dateStr.includes('T')) {
          dateStr = dateStr.split('T')[0];
        }
        
        const [year, month, day] = dateStr.split('-').map(Number);
        if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
          throw new Error('Invalid date format');
        }
        
        const searchReturnDate = new Date(Date.UTC(year, month - 1, day));
        const nextDay = new Date(Date.UTC(year, month - 1, day + 1));
        
        where.returnDate = {
          gte: searchReturnDate,
          lt: nextDay
        };
      } catch (error) {
        console.error('Error parsing return date:', returnDate, error);
        // Skip date filter if invalid
      }
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

    // Parse dates safely without timezone issues
    const [depYear, depMonth, depDay] = body.departureDate.split('-').map(Number);
    const departureDateUTC = new Date(Date.UTC(depYear, depMonth - 1, depDay));
    
    let returnDateUTC = null;
    if (body.returnDate) {
      const [retYear, retMonth, retDay] = body.returnDate.split('-').map(Number);
      returnDateUTC = new Date(Date.UTC(retYear, retMonth - 1, retDay));
    }

    const flightRoute = await db.flightRoute.create({
      data: {
        departureCityId: body.departureCityId,
        arrivalCityId: body.arrivalCityId,
        departureDate: departureDateUTC,
        returnDate: returnDateUTC,
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
