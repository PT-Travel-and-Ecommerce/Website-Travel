'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatRupiah } from '@/lib/format';

interface FilterState {
  priceRange: [number, number];
  departureTimeRange: [number, number];
  ratings: number[];
  airlines: string[];
}

interface AdvancedFlightFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableAirlines: string[];
  minPrice: number;
  maxPrice: number;
}

export function AdvancedFlightFilters({
  filters,
  onFiltersChange,
  availableAirlines,
  minPrice,
  maxPrice,
}: AdvancedFlightFiltersProps) {
  const t = useTranslations('flights');
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    departureTime: true,
    rating: true,
    airlines: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const handleDepartureTimeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      departureTimeRange: [value[0], value[1]],
    });
  };

  const handleRatingToggle = (rating: number) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating];
    onFiltersChange({
      ...filters,
      ratings: newRatings,
    });
  };

  const handleAirlineToggle = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter((a) => a !== airline)
      : [...filters.airlines, airline];
    onFiltersChange({
      ...filters,
      airlines: newAirlines,
    });
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection('price')}
          className="w-full px-6 py-4 flex items-center justify-between bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <span className="font-semibold text-foreground">{t('priceRange')}</span>
          {expandedSections.price ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.price && (
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Slider
                min={100000}
                max={100000000}
                step={100000}
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatRupiah(filters.priceRange[0])}</span>
                <span>{formatRupiah(filters.priceRange[1])}</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection('departureTime')}
          className="w-full px-6 py-4 flex items-center justify-between bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <span className="font-semibold text-foreground">{t('departureTime')}</span>
          {expandedSections.departureTime ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.departureTime && (
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Slider
                min={0}
                max={23.99}
                step={0.25}
                value={filters.departureTimeRange}
                onValueChange={handleDepartureTimeChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(filters.departureTimeRange[0])}</span>
                <span>{formatTime(filters.departureTimeRange[1])}</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full px-6 py-4 flex items-center justify-between bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <span className="font-semibold text-foreground">{t('rating')}</span>
          {expandedSections.rating ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.rating && (
          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingToggle(rating)}
                  className={`px-6 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                    filters.ratings.includes(rating)
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-border hover:border-primary hover:bg-muted'
                  }`}
                >
                  {rating}+
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection('airlines')}
          className="w-full px-6 py-4 flex items-center justify-between bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <span className="font-semibold text-foreground">{t('airlines')}</span>
          {expandedSections.airlines ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.airlines && (
          <div className="p-6 space-y-3">
            {availableAirlines.map((airline) => (
              <div key={airline} className="flex items-center space-x-2">
                <Checkbox
                  id={`airline-${airline}`}
                  checked={filters.airlines.includes(airline)}
                  onCheckedChange={() => handleAirlineToggle(airline)}
                />
                <label
                  htmlFor={`airline-${airline}`}
                  className="text-sm cursor-pointer"
                >
                  {airline}
                </label>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Button
        onClick={() => onFiltersChange({ ...filters })}
        variant="default"
        className="w-full"
      >
        {t('applyFilters')}
      </Button>
    </div>
  );
}
