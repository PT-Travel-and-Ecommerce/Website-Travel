'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import HeaderNavigation from '@/components/sections/header-navigation';
import Footer from '@/components/sections/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PaymentModal from '@/components/packages/payment-modal';

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

export default function PackageDetailPage() {
  const params = useParams();
  const [pkg, setPkg] = useState<PackageWithCity | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPackage(params.id as string);
    }
  }, [params.id]);

  async function fetchPackage(id: string) {
    try {
      const response = await fetch(`/api/packages/${id}`);
      if (!response.ok) throw new Error('Failed to fetch package');

      const data = await response.json();
      setPkg(data);
    } catch (error) {
      console.error('Error fetching package:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <HeaderNavigation mode="page" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <HeaderNavigation mode="page" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Paket tidak ditemukan</h1>
            <Link href="/flights">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Paket
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <HeaderNavigation mode="page" />

      <main className="container mx-auto px-4 sm:px-6 lg:px-20 pb-12">
        <div className="mb-6">
          <Link href="/flights">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-96 rounded-xl overflow-hidden">
              <img
                src={pkg.imageUrl}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 text-lg px-4 py-2">
                {pkg.name}
              </Badge>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span className="text-lg text-muted-foreground">{pkg.city.name}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                {pkg.city.name} - {pkg.name}
              </h1>
              <p className="text-lg text-muted-foreground">{pkg.description}</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Fasilitas Yang Didapatkan</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(Array.isArray(pkg.features) ? pkg.features : []).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#dcac56' }} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Detail Paket</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Durasi</p>
                      <p className="text-muted-foreground">{pkg.durationDays} Hari</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Destinasi</p>
                      <p className="text-muted-foreground">{pkg.city.name}, {pkg.city.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Harga Paket</p>
                  <p className="text-4xl font-bold text-primary">
                    {formatPrice(Number(pkg.price))}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    untuk {pkg.durationDays} hari
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full text-lg py-6"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Beli Paket
                </Button>

                <div className="border-t pt-6 space-y-3">
                  <p className="font-semibold text-sm">Yang Termasuk:</p>
                  <ul className="space-y-2">
                    {(Array.isArray(pkg.features) ? pkg.features : []).slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#dcac56' }} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        package={pkg}
      />
    </div>
  );
}
