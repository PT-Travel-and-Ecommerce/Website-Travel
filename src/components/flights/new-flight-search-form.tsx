'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Repeat2 } from 'lucide-react';
import CitySelector from './city-selector';
import DateSelector from './date-selector';
import { type City } from '@/types';
import { formatDateToString } from '@/lib/format';

interface FlightSearchFormProps {
  onSearch: (params: SearchParams) => void;
  initialFilters?: SearchParams | null;
}

export interface SearchParams {
  from: City | null;
  to: City | null;
  departDate: Date | undefined;
  returnDate: Date | undefined;
  tripType: 'one-way' | 'round-trip' | 'multi-city';
}

export default function NewFlightSearchForm({ onSearch, initialFilters }: FlightSearchFormProps) {
  const t = useTranslations('flights');
  const router = useRouter();
  const [tripType, setTripType] = useState<'one-way' | 'round-trip' | 'multi-city'>('one-way');
  const [fromCity, setFromCity] = useState<City | null>(null);
  const [toCity, setToCity] = useState<City | null>(null);
  const [departDate, setDepartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchCityData = async (cityId: string): Promise<City | null> => {
      try {
        const response = await fetch('/api/cities');
        if (!response.ok) return null;
        const cities = await response.json();
        return cities.find((c: City) => c.id === cityId) || null;
      } catch (error) {
        console.error('Error fetching city data:', error);
        return null;
      }
    };

    const loadInitialData = async () => {
      if (initialFilters) {
        if (initialFilters.tripType) setTripType(initialFilters.tripType);
        
        // Fetch full city data if only ID is provided
        if (initialFilters.from) {
          if (initialFilters.from.name) {
            setFromCity(initialFilters.from);
          } else if (initialFilters.from.id) {
            const cityData = await fetchCityData(initialFilters.from.id);
            if (cityData) setFromCity(cityData);
          }
        }
        
        if (initialFilters.to) {
          if (initialFilters.to.name) {
            setToCity(initialFilters.to);
          } else if (initialFilters.to.id) {
            const cityData = await fetchCityData(initialFilters.to.id);
            if (cityData) setToCity(cityData);
          }
        }
        
        if (initialFilters.departDate) setDepartDate(initialFilters.departDate);
        if (initialFilters.returnDate) setReturnDate(initialFilters.returnDate);
      }
    };

    loadInitialData();
  }, [initialFilters]);

  const handleSearch = () => {
    // Call the onSearch callback for data fetching
    onSearch({
      from: fromCity,
      to: toCity,
      departDate,
      returnDate,
      tripType,
    });

    // Also update the URL with query parameters for proper navigation
    const params = new URLSearchParams();
    if (fromCity) params.set('from', fromCity.id);
    if (toCity) params.set('to', toCity.id);
    if (tripType) params.set('tripType', tripType);
    if (departDate) {
      const dateStr = formatDateToString(departDate);
      if (dateStr) params.set('departDate', dateStr);
    }
    if (returnDate) {
      const dateStr = formatDateToString(returnDate);
      if (dateStr) params.set('returnDate', dateStr);
    }
    router.push(`/flights?${params.toString()}`);
  };

  return (
    <Card className="shadow-xl border-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* From/To group */}
            <div className="relative flex h-auto flex-col gap-2 rounded-[10px] border-2 border-primary md:flex-row">
              <span className="absolute -top-[10px] left-[10px] z-10 inline-block rounded-md bg-white px-1 text-sm font-medium leading-none">
                Dari <span className="text-red-600">*</span> - Ke <span className="text-red-600">*</span>
              </span>
              <div className="h-auto min-h-[100px] max-w-full grow rounded-none border-0 p-4 max-md:mx-1 max-md:border-b-2 md:my-1 md:w-1/2 md:border-r-2 border-[#E2E8F0]">
                <CitySelector
                  label="From"
                  value={fromCity}
                  onChange={setFromCity}
                  placeholder="Select departure city"
                  minimal
                  placeholderTitle="City"
                  placeholderSubtitle="Airport name"
                />
              </div>
              <button
                type="button"
                aria-label="swap cities"
                onClick={() => {
                  setFromCity(toCity);
                  setToCity(fromCity);
                }}
                className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary p-2 transition-all hover:border-2 hover:border-primary hover:bg-primary/90"
              >
                <Repeat2 className="h-5 w-5 text-primary-foreground" />
              </button>
              <div className="h-auto min-h-[100px] max-w-full grow rounded-none border-0 p-4 max-md:mx-1 max-md:border-t-2 md:my-1 md:w-1/2 md:border-l-2 border-[#E2E8F0]">
                <CitySelector
                  label="To"
                  value={toCity}
                  onChange={setToCity}
                  placeholder="Select destination"
                  minimal
                  placeholderTitle="City"
                  placeholderSubtitle="Airport name"
                />
              </div>
            </div>

            {/* Depart/Return group */}
            <div className="relative flex h-auto flex-col gap-2 rounded-[10px] border-2 border-primary md:flex-row">
              <span className="absolute -top-[10px] left-[10px] z-10 inline-block rounded-md bg-white px-1 text-sm font-medium leading-none">
                Berangkat <span className="text-red-600">*</span> - Pulang <span className="text-red-600">*</span>
              </span>
              <div className="h-auto min-h-[100px] max-w-full grow rounded-none border-0 p-4 max-md:mx-1 max-md:border-b-2 md:my-1 md:w-1/2 md:border-r-2">
                <DateSelector
                  label="Depart *"
                  sublabel="Saturday"
                  value={departDate}
                  onChange={setDepartDate}
                  minimal
                  placeholderTitle="DD MMM YY"
                  placeholderSubtitle="Weekday"
                />
              </div>
              <div className="h-auto min-h-[100px] max-w-full grow rounded-none border-0 p-4 max-md:mx-1 max-md:border-t-2 md:my-1 md:w-1/2 md:border-l-2">
                <DateSelector
                  label="Return *"
                  sublabel="Weekday"
                  value={returnDate}
                  onChange={setReturnDate}
                  minDate={departDate}
                  minimal
                  placeholderTitle="DD MMM YY"
                  placeholderSubtitle="Weekday"
                />
              </div>
            </div>

            {/** Travelers/Class group removed as requested */}
          </div>

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleSearch}
              className="bg-primary text-primary-foreground hover:bg-[#9BE0C8] active:bg-[#82CBB2] px-8"
            >
              <Plane className="w-5 h-5 mr-2" />
              {t('searchFlightButton')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
