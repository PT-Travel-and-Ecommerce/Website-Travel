'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { City } from '@/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';

interface CitySelectorProps {
  label: string;
  value: City | null;
  onChange: (city: City) => void;
  placeholder?: string;
  minimal?: boolean;
  placeholderTitle?: string;
  placeholderSubtitle?: string;
}

export default function CitySelector({
  label,
  value,
  onChange,
  placeholder = 'Select city',
  minimal = false,
  placeholderTitle = 'City',
  placeholderSubtitle = 'Airport name',
}: CitySelectorProps) {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  async function fetchCities() {
    try {
      const response = await fetch('/api/cities');
      if (!response.ok) throw new Error('Failed to fetch cities');

      const data = await response.json();
      setCities(data || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <label className={minimal ? "sr-only" : "text-sm font-medium text-muted-foreground"}>{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={minimal ? "ghost" : "outline"}
            role="combobox"
            aria-expanded={open}
            className={minimal ? "w-full justify-start text-left font-normal h-auto p-0 bg-transparent hover:bg-transparent border-0 shadow-none" : "w-full justify-start text-left font-normal h-auto py-3 px-4"}
          >
            <div className="flex flex-col items-start w-full">
              {value ? (
                <>
                  <span className={minimal ? "font-bold text-lg sm:text-2xl" : "font-bold text-lg"}>{value.name}</span>
                  <span className={minimal ? "text-xs sm:text-sm text-muted-foreground" : "text-xs text-muted-foreground"}>
                    {value.description.substring(0, 40)}...
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-start w-full">
                  <span className={minimal ? "font-bold text-lg sm:text-2xl" : "text-muted-foreground"}>
                    {minimal ? placeholderTitle : placeholder}
                  </span>
                  {minimal && (
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line">{placeholderSubtitle}</span>
                  )}
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchCity')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">{t('loading')}</div>
            ) : filteredCities.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">{t('noCitiesFound')}</div>
            ) : (
              <div className="space-y-1">
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      onChange(city);
                      setOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">{city.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {city.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
