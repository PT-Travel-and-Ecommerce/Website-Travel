'use client';

import { useEffect, useState } from 'react';
import PackageCard from './package-card';

interface City {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
}

interface PackageWithCity {
  id: string;
  cityId: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  imageUrl: string;
  features: string[];
  createdAt: Date;
  city: City;
}

interface SearchParams {
  from: { id: string } | null;
  to: { id: string } | null;
  departDate: Date | undefined;
  returnDate: Date | undefined;
  tripType: 'one-way' | 'round-trip' | 'multi-city';
}

interface PackagesListProps {
  filters?: SearchParams | null;
}

export default function PackagesList({ filters }: PackagesListProps) {
  const [packages, setPackages] = useState<PackageWithCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedPackages, setGroupedPackages] = useState<Record<string, PackageWithCity[]>>({});

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, packages]);

  async function fetchPackages() {
    try {
      const response = await fetch('/api/packages');
      if (!response.ok) throw new Error('Failed to fetch packages');

      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filteredPackages = [...packages];

    if (filters?.from) {
      filteredPackages = filteredPackages.filter(pkg => pkg.cityId === filters.from?.id);
    }

    const grouped = filteredPackages.reduce((acc: Record<string, PackageWithCity[]>, pkg: PackageWithCity) => {
      const cityName = pkg.city.name;
      if (!acc[cityName]) {
        acc[cityName] = [];
      }
      acc[cityName].push(pkg);
      return acc;
    }, {});

    setGroupedPackages(grouped);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {Object.entries(groupedPackages).map(([cityName, cityPackages]) => (
        <section key={cityName} className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">{cityName}</h2>
            <span className="text-muted-foreground">
              ({cityPackages.length} paket)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityPackages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        </section>
      ))}

      {packages.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            Belum ada paket perjalanan tersedia
          </p>
        </div>
      )}
    </div>
  );
}
