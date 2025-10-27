'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface FlightHeroSettings {
  flightHeroTitle: string;
  flightHeroSubtitle: string;
  flightHeroImageUrl: string;
}

export default function FlightHero() {
  const t = useTranslations('flights');
  const [settings, setSettings] = useState<FlightHeroSettings>({
    flightHeroTitle: 'Make your travel wishlist, we\'ll do the rest',
    flightHeroSubtitle: 'Special offers to suit your plan',
    flightHeroImageUrl: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings({
            flightHeroTitle: data.flightHeroTitle,
            flightHeroSubtitle: data.flightHeroSubtitle,
            flightHeroImageUrl: data.flightHeroImageUrl,
          });
        }
      })
      .catch(error => console.error('Error fetching flight hero settings:', error));
  }, []);

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={settings.flightHeroImageUrl}
          alt="Airplane at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-20 h-full flex items-center pt-16 md:pt-24">
        <div className="text-white max-w-2xl drop-shadow-lg">
          <h1 className="text-white text-5xl md:text-6xl font-bold mb-4">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-white/90">
            {t('heroSubtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}

