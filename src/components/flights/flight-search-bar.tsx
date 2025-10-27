"use client";

import { Calendar, Plane, Users, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FlightSearchBar() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* From */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">From</label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="City or Airport"
              className="pl-10"
              defaultValue="New York (JFK)"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center md:col-span-2 lg:col-span-1 lg:mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        {/* To */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">To</label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-90" />
            <Input
              placeholder="City or Airport"
              className="pl-10"
              defaultValue="Los Angeles (LAX)"
            />
          </div>
        </div>

        {/* Departure Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Departure</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="pl-10"
            />
          </div>
        </div>

        {/* Return Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Return</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="pl-10"
            />
          </div>
        </div>

        {/* Passengers */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Passengers</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="1 Passenger"
              className="pl-10"
              defaultValue="1 Passenger, Economy"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-2">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plane className="mr-2 h-4 w-4" />
            Search Flights
          </Button>
        </div>
      </div>
    </div>
  );
}