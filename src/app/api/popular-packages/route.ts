import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const flightRoutes = await prisma.flightRoute.findMany({
      take: 4,
      include: {
        departureCity: true,
        arrivalCity: true,
      },
      orderBy: {
        totalPrice: 'asc',
      },
    });

    const popularPackages = flightRoutes.map((route, index) => ({
      id: route.id,
      packageId: route.id,
      order: index + 1,
      package: {
        id: route.id,
        cityId: route.arrivalCityId,
        name: `${route.departureCity.name} - ${route.arrivalCity.name}`,
        description: route.description,
        price: Number(route.totalPrice),
        durationDays: route.returnDate 
          ? Math.ceil((new Date(route.returnDate).getTime() - new Date(route.departureDate).getTime()) / (1000 * 60 * 60 * 24))
          : 1,
        imageUrl: route.imageUrl || route.arrivalCity.imageUrl,
        features: [route.airline, route.flightClass, route.baggageInfo],
        createdAt: route.createdAt,
        city: {
          id: route.arrivalCity.id,
          name: route.arrivalCity.name,
          description: route.arrivalCity.description,
          imageUrl: route.arrivalCity.imageUrl,
          createdAt: route.arrivalCity.createdAt,
        },
      },
    }));

    return NextResponse.json(popularPackages);
  } catch (error) {
    console.error('Error fetching popular packages:', error);
    return NextResponse.json({ error: 'Failed to fetch popular packages' }, { status: 500 });
  }
}
