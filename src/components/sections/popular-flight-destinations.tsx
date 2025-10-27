"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface City {
  id: string;
  name: string;
}

interface FlightRoute {
  id: string;
  airline: string;
  departureCity: City;
  arrivalCity: City;
  totalPrice: number;
  imageUrl: string;
  duration: string;
}

interface PopularFlightRoute {
  id: string;
  flightRouteId: string;
  displayOrder: number;
  isActive: boolean;
  imageUrl?: string | null;
  flightRoute: FlightRoute;
}

type Destination = {
  city: string;
  routeName: string;
  imageUrl: string;
  href: string;
  price: number;
  duration: string;
};

const PopularFlightDestinations = () => {
  const t = useTranslations('destinations');
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetch('/api/popular-flight-routes')
      .then(res => res.json())
      .then((data: PopularFlightRoute[]) => {
        if (Array.isArray(data)) {
          const formattedDestinations = data
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(popRoute => ({
              city: popRoute.flightRoute.arrivalCity.name,
              routeName: `${popRoute.flightRoute.departureCity.name} → ${popRoute.flightRoute.arrivalCity.name}`,
              imageUrl: popRoute.imageUrl || popRoute.flightRoute.imageUrl || 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg',
              price: Number(popRoute.flightRoute.totalPrice),
              duration: popRoute.flightRoute.duration,
              href: `/flights/${popRoute.flightRoute.id}/book`,
            }));
          setDestinations(formattedDestinations);
        }
      })
      .catch(error => console.error('Error fetching popular flight routes:', error));
  }, []);

  return (
    <section className="mx-auto">
      <div className="mx-auto mb-5 flex items-center justify-between max-md:flex-col max-md:gap-4 md:mb-10">
        <div className="md:w-1/2">
          <h2 className="mb-2 text-[2rem] font-semibold text-dark-charcoal max-md:text-center md:mb-4">
            {t('popularFlights')}
          </h2>
          <p className="text-medium-gray max-md:text-center">
            {t('exploreDeals')}
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((destination, index) => (
          <Link href={destination.href} key={`${destination.city}-${index}`}>
            <div className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <Image
                  alt={`${destination.routeName}`}
                  src={destination.imageUrl}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">
                      {destination.city.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl text-white font-bold leading-tight">
                    {destination.routeName}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularFlightDestinations;
