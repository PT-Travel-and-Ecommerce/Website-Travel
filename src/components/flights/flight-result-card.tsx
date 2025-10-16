'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Plane, Star } from 'lucide-react';
import { formatRupiah } from '@/lib/format';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface OtherFee {
  id: string;
  name: string;
  amount: number;
}

interface FlightResultCardProps {
  id: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  otherFees?: OtherFee[];
  flightClass?: string;
  departureDate?: string;
}

export function FlightResultCard({
  id,
  airline,
  departureCity,
  arrivalCity,
  departureTime,
  arrivalTime,
  duration,
  price,
  originalPrice,
  rating,
  reviewCount,
  imageUrl,
  otherFees,
  flightClass,
  departureDate,
}: FlightResultCardProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const formatTime = (value: string) => {
    try {
      // Handle ISO or time strings
      if (value.includes('T') || value.endsWith('Z')) {
        const d = new Date(value);
        const hh = d.getHours().toString().padStart(2, '0');
        const mm = d.getMinutes().toString().padStart(2, '0');
        return `${hh}:${mm}`;
      }
      // Already HH:mm or H:mm
      const match = value.match(/^(\d{1,2}):(\d{2})/);
      if (match) {
        const hh = match[1].padStart(2, '0');
        const mm = match[2];
        return `${hh}:${mm}`;
      }
      return value;
    } catch {
      return value;
    }
  };

  const dep = formatTime(departureTime);
  const arr = formatTime(arrivalTime);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow px-1">
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section - Left */}
        <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={airline}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Plane className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content Section - Middle */}
        <div className="flex-1 p-1 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-foreground">{rating?.toFixed ? rating.toFixed(1) : rating}</span>
              <span>•</span>
              <span>{t('reviews')}</span>
            </div>

            <div className="mb-4">
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {dep} - {arr}
              </div>
              <div className="text-base text-muted-foreground">{airline}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {departureCity} - {arrivalCity}
            </div>
            {departureDate && (
              <div className="text-xs text-muted-foreground">
                {t('date')}: {new Date(departureDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            )}
            {flightClass && (
              <div className="text-xs font-medium text-muted-foreground capitalize">
                {t('type')}: {flightClass}
              </div>
            )}
            {otherFees && otherFees.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {t('included')}: {otherFees.map(fee => fee.name).join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Price & Action Section - Right */}
        <div className="flex flex-row md:flex-col justify-between items-center md:items-end p-5 md:p-6 md:min-w-[220px] border-t md:border-t-0 md:border-l">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 rounded-full border border-border hover:bg-muted md:mb-auto"
            aria-label="toggle favorite"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
            />
          </button>
          
          <div className="flex flex-col items-end gap-4 md:mt-auto">
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-2">{t('startingFrom')}</div>
              {originalPrice && (
                <div className="text-sm line-through text-muted-foreground/70 mb-1">
                  {formatRupiah(originalPrice)}
                </div>
              )}
              <div className="text-2xl md:text-3xl font-bold text-primary">
                {formatRupiah(price)}
              </div>
            </div>
            <Button 
              onClick={() => router.push(`/flights/${id}/book`)}
              className="w-full md:w-auto md:min-w-[160px] bg-primary text-primary-foreground hover:bg-primary/90 px-6"
              size="lg"
            >
              {t('viewDeals')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
