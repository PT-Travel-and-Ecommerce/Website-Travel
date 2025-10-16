'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import HeaderNavigation from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import FlightHero from "@/components/flights/flight-hero";
import NewFlightSearchForm, { SearchParams } from "@/components/flights/new-flight-search-form";
import { AdvancedFlightFilters } from "@/components/flights/advanced-flight-filters";
import { FlightResultCard } from "@/components/flights/flight-result-card";
import { Button } from "@/components/ui/button";
import { formatDateToString } from "@/lib/format";

interface OtherFee {
  id: string;
  name: string;
  amount: number;
}

interface FlightRoute {
  id: string;
  departureCityId: string;
  arrivalCityId: string;
  departureDate: string;
  returnDate: string | null;
  price: number;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  rating: number;
  availableSeats: number;
  flightClass: string;
  imageUrl?: string;
  otherFees?: OtherFee[];
  departureCity: { id: string; name: string };
  arrivalCity: { id: string; name: string };
}

interface FilterState {
  priceRange: [number, number];
  departureTimeRange: [number, number];
  ratings: number[];
  airlines: string[];
}

function FlightsContent() {
  const t = useTranslations('flights');
  const searchParams = useSearchParams();
  const [searchFilters, setSearchFilters] = useState<SearchParams | null>(null);
  const [flightRoutes, setFlightRoutes] = useState<FlightRoute[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<FlightRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest'>('cheapest');
  const [displayCount, setDisplayCount] = useState(5);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [100000, 100000000],
    departureTimeRange: [0, 23.99],
    ratings: [],
    airlines: [],
  });

  useEffect(() => {
    const fromCityId = searchParams.get('from');
    const toCityId = searchParams.get('to');
    const tripType = searchParams.get('tripType') as 'one-way' | 'round-trip' | 'multi-city' || 'one-way';
    const departDateStr = searchParams.get('departDate');
    const returnDateStr = searchParams.get('returnDate');

    if (fromCityId || toCityId || tripType) {
      // Clean up date strings - extract only YYYY-MM-DD part
      const cleanDepartDate = departDateStr 
        ? (departDateStr.includes('T') ? departDateStr.split('T')[0] : departDateStr)
        : null;
      const cleanReturnDate = returnDateStr 
        ? (returnDateStr.includes('T') ? returnDateStr.split('T')[0] : returnDateStr)
        : null;

      setSearchFilters({
        from: fromCityId ? { id: fromCityId, name: '', description: '', imageUrl: '', createdAt: new Date() } : null,
        to: toCityId ? { id: toCityId, name: '', description: '', imageUrl: '', createdAt: new Date() } : null,
        departDate: cleanDepartDate ? new Date(cleanDepartDate) : undefined,
        returnDate: cleanReturnDate ? new Date(cleanReturnDate) : undefined,
        tripType,
      });
      fetchFlightRoutes(fromCityId, toCityId, cleanDepartDate, cleanReturnDate);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [flightRoutes, filters, sortBy]);

  const fetchFlightRoutes = async (
    fromCityId: string | null,
    toCityId: string | null,
    departDate: string | null,
    returnDate: string | null
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromCityId) params.append('departureCityId', fromCityId);
      if (toCityId) params.append('arrivalCityId', toCityId);
      if (departDate) params.append('departureDate', departDate);
      if (returnDate) params.append('returnDate', returnDate);

      const response = await fetch(`/api/flight-routes?${params.toString()}`);
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setFlightRoutes(data);
      } else {
        console.error('API returned non-array data:', data);
        setFlightRoutes([]);
      }

      // Keep priceRange fixed to [100000, 100000000] per UI requirement
    } catch (error) {
      console.error('Error fetching flight routes:', error);
      setFlightRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...flightRoutes];

    filtered = filtered.filter((route) => {
      const price = route.price ? parseFloat(route.price.toString()) : 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Parse departure time from datetime string
      if (route.departureTime) {
        try {
          const date = new Date(route.departureTime);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const departureHours = hours + minutes / 60;
          
          if (
            departureHours < filters.departureTimeRange[0] ||
            departureHours > filters.departureTimeRange[1]
          ) {
            return false;
          }
        } catch (error) {
          console.error('Error parsing departure time:', error);
        }
      }

      if (filters.ratings.length > 0 && !filters.ratings.includes(route.rating)) {
        return false;
      }

      if (filters.airlines.length > 0 && !filters.airlines.includes(route.airline)) {
        return false;
      }

      return true;
    });

    if (sortBy === 'cheapest') {
      filtered.sort((a, b) => {
        const priceA = a.price ? parseFloat(a.price.toString()) : 0;
        const priceB = b.price ? parseFloat(b.price.toString()) : 0;
        return priceA - priceB;
      });
    } else {
      filtered.sort((a, b) => {
        const getDurationMinutes = (duration: string) => {
          if (!duration) return 0;
          const [hours, minutes] = duration.split('h');
          return parseInt(hours) * 60 + parseInt(minutes.replace('m', '').trim());
        };
        return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
      });
    }

    setFilteredRoutes(filtered);
  };

  const handleSearch = (params: SearchParams) => {
    setSearchFilters(params);
    if (params.from && params.to) {
      const departDateStr = formatDateToString(params.departDate);
      const returnDateStr = formatDateToString(params.returnDate);
        
      fetchFlightRoutes(
        params.from.id,
        params.to.id,
        departDateStr || null,
        returnDateStr || null
      );
    }
  };

  const availableAirlines = Array.from(new Set(flightRoutes.map((r) => r.airline)));
  const minPrice = flightRoutes.length > 0
    ? Math.min(...flightRoutes.map((r) => r.price ? parseFloat(r.price.toString()) : 0))
    : 0;
  const maxPrice = flightRoutes.length > 0
    ? Math.max(...flightRoutes.map((r) => r.price ? parseFloat(r.price.toString()) : 0))
    : 10000000;

  const cheapestPrice = filteredRoutes.length > 0
    ? Math.min(...filteredRoutes.map((r) => r.price ? parseFloat(r.price.toString()) : 0))
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation mode="hero" />
      <FlightHero />

      <main className="pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20 -mt-20 relative z-10">
          <NewFlightSearchForm onSearch={handleSearch} initialFilters={searchFilters} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-20 mt-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-80 flex-shrink-0">
              <AdvancedFlightFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableAirlines={availableAirlines}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {t('showing')} {filteredRoutes.length} {t('of')} {flightRoutes.length} {filteredRoutes.length === 1 ? t('result') : t('results_plural')}
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">{t('loading')}</div>
              ) : filteredRoutes.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {filteredRoutes.slice(0, displayCount).map((route) => (
                      <FlightResultCard
                        key={route.id}
                        id={route.id}
                        airline={route.airline}
                        departureCity={route.departureCity?.name || ''}
                        arrivalCity={route.arrivalCity?.name || ''}
                        departureTime={route.departureTime || ''}
                        arrivalTime={route.arrivalTime || ''}
                        duration={route.duration || ''}
                        price={route.price ? parseFloat(route.price.toString()) : 0}
                        rating={route.rating || 0}
                        reviewCount={0}
                        imageUrl={route.imageUrl}
                        otherFees={route.otherFees}
                        flightClass={route.flightClass}
                        departureDate={route.departureDate}
                      />
                    ))}
                  </div>
                  {displayCount < filteredRoutes.length && (
                    <div className="mt-8 text-center">
                      <Button
                        onClick={() => setDisplayCount(prev => prev + 5)}
                        variant="outline"
                        size="lg"
                        className="min-w-[200px]"
                      >
                        {t('loadMore')}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('noFlightsFound')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FlightsContent />
    </Suspense>
  );
}