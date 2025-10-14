"use client";

import { Slider } from "@/components/ui/slider";

export default function FlightFilters() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Filters</h3>

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Price Range</h4>
        <Slider
          defaultValue={[0, 1000]}
          max={1000}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>$0</span>
          <span>$1,000+</span>
        </div>
      </div>
    </div>
  );
}