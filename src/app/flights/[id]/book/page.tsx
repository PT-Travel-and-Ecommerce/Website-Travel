'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import HeaderNavigation from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plane, Heart, Share2 } from 'lucide-react';
import { formatRupiah } from '@/lib/format';
import FlightPaymentModal from '@/components/flights/flight-payment-modal';
import { getCurrentUser, redirectToSSO } from '@/lib/sso-auth';

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
  baseFare: number;
  tax: number;
  serviceFee: number;
  otherFees?: OtherFee[];
  discount: number;
  totalPrice: number;
  departureCity: { id: string; name: string };
  arrivalCity: { id: string; name: string };
}

export default function FlightBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations('flights');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const resolvedParams = use(params);
  const [flightRoute, setFlightRoute] = useState<FlightRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchFlightRoute();
    checkLoginStatus();
  }, [resolvedParams.id]);

  const checkLoginStatus = () => {
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
  };

  const handlePayNowClick = () => {
    if (!isLoggedIn) {
      const currentUrl = window.location.pathname;
      redirectToSSO(currentUrl);
    } else {
      setShowPaymentModal(true);
    }
  };

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

  const formatTime = (timeString: string) => {
    try {
      if (timeString.includes('T') || timeString.endsWith('Z')) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateSubtotal = (fees?: OtherFee[]) => {
    if (!fees || fees.length === 0) return 0;
    return fees.reduce((sum, fee) => sum + Number(fee.amount), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t('loading')}</div>
      </div>
    );
  }

  if (!flightRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t('flightNotFound')}</div>
      </div>
    );
  }

  const subtotal = calculateSubtotal(flightRoute.otherFees);
  const discountAmount = Number(flightRoute.discount) || 0;
  const originalPrice = subtotal;

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation mode="page" />

      <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-8 mt-16">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Details Card */}
            <Card>
              <CardContent className="pt-6">
                {/* Departure Date */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">
                    {t('departureDate')}: {formatDate(flightRoute.departureDate)}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {t('duration')}: {flightRoute.duration}
                  </span>
                </div>

                {/* Airline Info */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border">
                    <Plane className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{flightRoute.airline}</h4>
                    <p className="text-sm text-muted-foreground">
                      {flightRoute.flightClass === 'economy' ? t('economyClass') : flightRoute.flightClass === 'business' ? t('businessClass') : t('firstClass')}
                    </p>
                  </div>
                </div>

                {/* Flight Route */}
                <div className="relative">
                  <div className="flex items-start justify-between">
                    {/* Departure */}
                    <div className="flex-1">
                      <p className="text-2xl font-bold">
                        {formatTime(flightRoute.departureTime)}
                      </p>
                      <p className="text-sm mt-1">{formatDate(flightRoute.departureDate)}</p>
                      <p className="font-semibold mt-2">{flightRoute.departureCity.name}</p>
                    </div>

                    {/* Flight Icon */}
                    <div className="flex flex-col items-center px-8 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-px w-20 bg-border"></div>
                        <Plane className="w-6 h-6 rotate-90 text-primary" />
                        <div className="h-px w-20 bg-border"></div>
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="flex-1 text-right">
                      <p className="text-2xl font-bold">
                        {formatTime(flightRoute.arrivalTime)}
                      </p>
                      <p className="text-sm mt-1">{formatDate(flightRoute.departureDate)}</p>
                      <p className="font-semibold mt-2">{flightRoute.arrivalCity.name}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fare Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('fareDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{t('passengerType')}: {t('adult')}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-semibold">1 {t('traveler')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {flightRoute.otherFees && flightRoute.otherFees.length > 0 ? (
                    <>
                      {flightRoute.otherFees.map((fee, index) => (
                        <div key={fee.id}>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{fee.name}</span>
                            <div className="text-right">
                              <span className="font-medium">{formatRupiah(Number(fee.amount))}</span>
                            </div>
                          </div>
                          {index < flightRoute.otherFees!.length - 1 && <Separator className="my-3" />}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">{t('noFareDetails')}</p>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>{t('subtotal')}</span>
                    <span>{formatRupiah(Number(flightRoute.totalPrice))}</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('total')}</span>
                    <span className="text-primary">{formatRupiah(Number(flightRoute.totalPrice))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{flightRoute.flightClass.charAt(0).toUpperCase() + flightRoute.flightClass.slice(1)} Class</p>
                    {discountAmount > 0 && (
                      <p className="text-lg line-through text-muted-foreground/70">
                        {formatRupiah(originalPrice)}
                      </p>
                    )}
                    <p className="text-3xl font-bold text-primary">
                      {formatRupiah(Number(flightRoute.totalPrice))}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart 
                        className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handlePayNowClick}
                >
                  {isLoggedIn ? t('payNow') : 'Pay Now'}
                </Button>

                <div className="pt-4 border-t space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('route')}</span>
                    <span className="font-medium text-right">
                      {flightRoute.departureCity.name} → {flightRoute.arrivalCity.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('duration')}</span>
                    <span className="font-medium">{flightRoute.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('airline')}</span>
                    <span className="font-medium">{flightRoute.airline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('class')}</span>
                    <span className="font-medium">{flightRoute.flightClass.charAt(0).toUpperCase() + flightRoute.flightClass.slice(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
