export interface City {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
}

export interface Package {
  id: string;
  cityId: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  imageUrl: string;
  features: string[];
  createdAt: Date;
}

export interface PackageWithCity extends Package {
  city: City;
}

export interface FlightPackage {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  class: string;
  availableSeats: number;
  duration: string;
  baggage: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  packageId: string;
  userEmail: string;
  userName: string;
  status: string;
  amount: number;
  createdAt: Date;
}

export interface PaymentWithPackage extends Payment {
  package: PackageWithCity;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  location?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PopularDestination {
  id: string;
  city: string;
  country: string;
  airportCode: string;
  imageUrl: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}
