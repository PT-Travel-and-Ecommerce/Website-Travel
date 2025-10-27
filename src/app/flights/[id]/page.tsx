'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import HeaderNavigation from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import { AdvancedFlightFilters } from "@/components/flights/advanced-flight-filters";
import { FlightResultCard } from "@/components/flights/flight-result-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plane, Calendar } from 'lucide-react';
import { formatRupiah, formatDateToString } from '@/lib/format';
import FlightPaymentModal from '@/components/flights/flight-payment-modal';

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

export default function FlightDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations('flights');
  const router = useRouter();
  const resolvedParams = use(params);
  const [flightRoute, setFlightRoute] = useState<FlightRoute | null>(null);
  const [similarFlights, setSimilarFlights] = useState<FlightRoute[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<FlightRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest'>('cheapest');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [100000, 100000000],
    departureTimeRange: [0, 23.99],
    ratings: [],
    airlines: [],
  });

  useEffect(() => {
    fetchFlightRoute();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (flightRoute) {
      fetchSimilarFlights();
    }
  }, [flightRoute]);

  useEffect(() => {
    applyFilters();
  }, [similarFlights, filters, sortBy]);

  const fetchFlightRoute = async () => {
    try {
      const response = await fetch(`/api/flight-routes/${resolvedParams.id}`);
      const data = await response.json();
      setFlightRoute(data);
    } catch (error) {
      console.error('Error fetching flight route:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarFlights = async () => {
    if (!flightRoute) return;

    try {
      const params = new URLSearchParams();
      params.append('departureCityId', flightRoute.departureCityId);
      params.append('arrivalCityId', flightRoute.arrivalCityId);
      
      // Include date filters to match the original search criteria
      if (flightRoute.departureDate) {
        const departureDate = new Date(flightRoute.departureDate);
        const dateStr = formatDateToString(departureDate);
        if (dateStr) params.append('departureDate', dateStr);
      }
      
      if (flightRoute.returnDate) {
        const returnDate = new Date(flightRoute.returnDate);
        const dateStr = formatDateToString(returnDate);
        if (dateStr) params.append('returnDate', dateStr);
      }

      const response = await fetch(`/api/flight-routes?${params.toString()}`);
      const data = await response.json();
      setSimilarFlights(data.filter((r: FlightRoute) => r.id !== flightRoute.id));

      if (data.length > 0) {
        const prices = data.map((r: FlightRoute) => parseFloat(r.price.toString()));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setFilters((prev) => ({
          ...prev,
          priceRange: [minPrice, maxPrice],
        }));
      }
    } catch (error) {
      console.error('Error fetching similar flights:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...similarFlights];

    filtered = filtered.filter((route) => {
      const price = parseFloat(route.price.toString());
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
      filtered.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()));
    } else {
      filtered.sort((a, b) => {
        const getDurationMinutes = (duration: string) => {
          const [hours, minutes] = duration.split('h');
          return parseInt(hours) * 60 + parseInt(minutes.replace('m', '').trim());
        };
        return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
      });
    }

    setFilteredFlights(filtered);
  };

  const availableAirlines = Array.from(new Set(similarFlights.map((r) => r.airline)));
  const minPrice = similarFlights.length > 0
    ? Math.min(...similarFlights.map((r) => parseFloat(r.price.toString())))
    : 0;
  const maxPrice = similarFlights.length > 0
    ? Math.max(...similarFlights.map((r) => parseFloat(r.price.toString())))
    : 10000000;

  const cheapestPrice = filteredFlights.length > 0
    ? Math.min(...filteredFlights.map((r) => parseFloat(r.price.toString())))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!flightRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Flight not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation mode="hero" />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back') || 'Back'}
          </Button>

          <Card className="p-8 mb-8">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {flightRoute.departureCity.name} to {flightRoute.arrivalCity.name}
                  </h1>
                  <p className="text-gray-600">{flightRoute.airline}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600">{t('departure')} Date</div>
                      <div className="font-semibold">
                        {new Date(flightRoute.departureDate).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  {flightRoute.returnDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <div className="text-sm text-gray-600">{t('return')} Date</div>
                        <div className="font-semibold">
                          {new Date(flightRoute.returnDate).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Plane className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600">Flight Time</div>
                      <div className="font-semibold">
                        {flightRoute.departureTime} - {flightRoute.arrivalTime}
                      </div>
                      <div className="text-sm text-gray-500">Duration: {flightRoute.duration}</div>
                    </div>
                  </div>
                </div>

                {flightRoute.flightClass && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600 mb-1">Tipe Penumpang</div>
                    <div className="font-semibold capitalize">
                      {flightRoute.flightClass === 'economy' ? 'Ekonomi' : flightRoute.flightClass === 'business' ? 'Bisnis' : flightRoute.flightClass === 'first' ? 'First Class' : flightRoute.flightClass}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-right space-y-4">
                <div>
                  <div className="text-sm text-gray-600">{t('startingFrom')}</div>
                  <div className="text-3xl font-bold text-primary">
                    {formatRupiah(parseFloat(flightRoute.price.toString()))}
                  </div>
                </div>
                <Button 
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {t('payNow')}
                </Button>
              </div>
            </div>
          </Card>

          <h2 className="text-2xl font-bold mb-6">{t('similarFlights')}</h2>

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
                <div className="text-sm text-gray-600">
                  {t('showing')} {filteredFlights.length} {t('of')} {similarFlights.length} {filteredFlights.length === 1 ? t('result') : t('results_plural')}
                </div>
              </div>

              {filteredFlights.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {filteredFlights.slice(0, displayCount).map((route) => (
                      <FlightResultCard
                        key={route.id}
                        id={route.id}
                        airline={route.airline}
                        departureCity={route.departureCity.name}
                        arrivalCity={route.arrivalCity.name}
                        departureTime={route.departureTime}
                        arrivalTime={route.arrivalTime}
                        duration={route.duration}
                        price={parseFloat(route.price.toString())}
                        rating={route.rating}
                        reviewCount={0}
                        imageUrl={route.imageUrl}
                        otherFees={route.otherFees}
                        flightClass={route.flightClass}
                        departureDate={route.departureDate}
                      />
                    ))}
                  </div>
                  {displayCount < filteredFlights.length && (
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
                  <p className="text-gray-500">No similar flights found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {flightRoute && (
        <FlightPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          flightRoute={flightRoute}
        />
      )}
    </div>
  );
}
