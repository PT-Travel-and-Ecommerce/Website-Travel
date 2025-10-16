"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CitySelector from "@/components/flights/city-selector";
import DateSelector from "@/components/flights/date-selector";
import { Repeat2 } from "lucide-react";
import { type City } from "@/types";
import { formatDateToString } from "@/lib/format";

const FlightSearchForm = () => {
  const t = useTranslations('search');
  const router = useRouter();
  const [fromCity, setFromCity] = React.useState<City | null>(null);
  const [toCity, setToCity] = React.useState<City | null>(null);
  const [departDate, setDepartDate] = React.useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = React.useState<Date | undefined>(undefined);
  const [tripType, setTripType] = React.useState<string>("one-way");
  return (
    <div className="relative left-1/2 top-full w-[95%] sm:w-[90%] -translate-x-1/2 -translate-y-[20%] rounded-lg bg-white px-3 py-4 shadow-lg sm:px-8 md:rounded-2xl lg:-translate-y-[25%] xl:-translate-y-[30%]">
      <Tabs defaultValue="flights" className="w-full">
        <TabsList className="h-auto items-center justify-start gap-1 rounded-md bg-transparent p-0 text-muted-foreground">
          <TabsTrigger
            value="flights"
            className="h-14 w-full gap-[6px] rounded-lg border px-4 font-bold text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm sm:h-16 sm:w-auto"
          >
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/svgs/airplane-filled.df1ad365-1.svg?"
              alt="airplane_icon"
              width={24}
              height={24}
            />
            <span>{t('searchFlights')}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="flights" className="mt-2">
          <form>
            <div className="my-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="relative col-span-full flex h-auto flex-col gap-2 rounded-lg border-2 border-primary md:flex-row lg:col-span-2">
                <span className="absolute -top-[10px] left-[10px] z-10 inline-block rounded-md bg-white px-1 text-sm font-medium leading-none">
                  {t('from')} <span className="text-red-600">*</span> - {t('to')} <span className="text-red-600">*</span>
                </span>
                <div className="h-auto min-h-[80px] sm:min-h-[100px] max-w-full grow rounded-none border-0 p-3 sm:p-4 max-md:mx-1 max-md:border-b-2 md:my-1 md:w-1/2 md:border-r-2 border-[#E2E8F0]">
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
                  aria-label="swap airport names"
                  onClick={() => { const a = fromCity; setFromCity(toCity); setToCity(a); }}
                  className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary p-2 transition-all hover:border-2 hover:border-primary hover:bg-primary/90"
                >
                  <Repeat2 className="h-5 w-5 text-primary-foreground" />
                </button>
                <div className="h-auto min-h-[80px] sm:min-h-[100px] max-w-full grow rounded-none border-0 p-3 sm:p-4 max-md:mx-1 max-md:border-t-2 md:my-1 md:w-1/2 md:border-l-2 border-[#E2E8F0]">
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

              <div className="relative col-span-full flex h-auto flex-col gap-2 rounded-lg border-2 border-primary md:flex-row lg:col-span-2">
                <span className="absolute -top-[10px] left-[10px] z-10 inline-block rounded-md bg-white px-1 text-sm font-medium leading-none">
                  {t('departure')} <span className="text-red-600">*</span> - {t('return')}
                </span>
                <div className="h-auto min-h-[80px] sm:min-h-[100px] max-w-full grow rounded-none border-0 p-3 sm:p-4 max-md:mx-1 max-md:border-b-2 md:my-1 md:w-1/2 md:border-r-2 border-[#E2E8F0]">
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
                <div className="h-auto min-h-[80px] sm:min-h-[100px] max-w-full grow rounded-none border-0 p-3 sm:p-4 max-md:mx-1 max-md:border-t-2 md:my-1 md:w-1/2 md:border-l-2 border-[#E2E8F0]">
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

              {/** Travelers/Class removed as requested */}
            </div>

            <div className="flex flex-wrap justify-end gap-6">
              <Button
                type="button"
                onClick={() => {
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
                }}
                className="h-[48px] w-[150px] gap-1 rounded-sm bg-primary px-[16px] py-[8px] text-primary-foreground hover:bg-[#9BE0C8] active:bg-[#82CBB2]"
              >
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/svgs/paper-plane-filled-4.svg?"
                  alt="paper_plane_icon"
                  width={24}
                  height={24}
                />
                <span>{t('searchFlights')}</span>
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlightSearchForm;