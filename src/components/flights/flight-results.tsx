"use client";

import { Plane, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const flightResults = [
  {
    id: 1,
    airline: "Emirates",
    logo: "EK",
    departure: { time: "08:00 AM", airport: "JFK" },
    arrival: { time: "11:30 AM", airport: "LAX" },
    duration: "5h 30m",
    stops: "Non-stop",
    price: 299,
    class: "Economy",
  },
  {
    id: 2,
    airline: "Delta Airlines",
    logo: "DL",
    departure: { time: "10:15 AM", airport: "JFK" },
    arrival: { time: "02:00 PM", airport: "LAX" },
    duration: "5h 45m",
    stops: "Non-stop",
    price: 349,
    class: "Economy",
  },
  {
    id: 3,
    airline: "United Airlines",
    logo: "UA",
    departure: { time: "01:30 PM", airport: "JFK" },
    arrival: { time: "05:45 PM", airport: "LAX" },
    duration: "6h 15m",
    stops: "1 Stop",
    price: 279,
    class: "Economy",
  },
  {
    id: 4,
    airline: "American Airlines",
    logo: "AA",
    departure: { time: "03:45 PM", airport: "JFK" },
    arrival: { time: "08:30 PM", airport: "LAX" },
    duration: "5h 45m",
    stops: "Non-stop",
    price: 329,
    class: "Economy",
  },
];

export default function FlightResults() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Available Flights ({flightResults.length})
        </h2>
        <select className="border border-border rounded-md px-4 py-2 text-sm">
          <option>Cheapest First</option>
          <option>Fastest First</option>
          <option>Earliest Departure</option>
          <option>Latest Departure</option>
        </select>
      </div>

      {flightResults.map((flight) => (
        <div
          key={flight.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Airline Logo */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {flight.logo}
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-sm">{flight.airline}</p>
                  <p className="text-xs text-muted-foreground">{flight.class}</p>
                </div>
              </div>
            </div>

            {/* Flight Details */}
            <div className="md:col-span-7">
              <div className="flex items-center justify-between">
                {/* Departure */}
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {flight.departure.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {flight.departure.airport}
                  </p>
                </div>

                {/* Journey Line */}
                <div className="flex-1 mx-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex-1 h-px bg-border"></div>
                    <div className="flex flex-col items-center">
                      <Plane className="h-5 w-5 text-primary rotate-90" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {flight.duration}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {flight.stops}
                      </p>
                    </div>
                    <div className="flex-1 h-px bg-border"></div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {flight.arrival.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {flight.arrival.airport}
                  </p>
                </div>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="md:col-span-3 text-center md:text-right">
              <p className="text-sm text-muted-foreground mb-1">Starting from</p>
              <p className="text-3xl font-bold text-primary mb-3">
                ${flight.price}
              </p>
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                Select Flight
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}