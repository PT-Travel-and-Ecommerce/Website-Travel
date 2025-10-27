'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Check } from 'lucide-react';
import Link from 'next/link';

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

interface PackageCardProps {
  package: PackageWithCity;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const features = Array.isArray(pkg.features) ? pkg.features : [];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.imageUrl}
          alt={pkg.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
          {pkg.name}
        </Badge>
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{pkg.city.name}</span>
        </div>
        <h3 className="text-xl font-bold line-clamp-1">
          {pkg.city.name} - {pkg.name}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {pkg.description}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{pkg.durationDays} Hari</span>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Yang Didapatkan:</p>
          <ul className="space-y-1">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#dcac56' }} />
                <span>{feature}</span>
              </li>
            ))}
            {features.length > 3 && (
              <li className="text-sm text-primary font-medium">
                +{features.length - 3} lainnya
              </li>
            )}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <div>
          <p className="text-sm text-muted-foreground">Mulai dari</p>
          <p className="text-2xl font-bold text-primary">{formatPrice(Number(pkg.price))}</p>
        </div>
        <Link href={`/packages/${pkg.id}`}>
          <Button size="lg">
            Lihat Detail
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
