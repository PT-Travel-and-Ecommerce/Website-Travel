import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          logoUrl: '/logo.png',
          siteName: 'Travel Indonesia',
          metaTitle: 'Travel Indonesia - Jelajahi Dunia Bersama Kami',
          metaDescription: 'Temukan penawaran terbaik untuk penerbangan, hotel, dan paket liburan',
          heroTitle: 'JELAJAHI DUNIA BERSAMA KAMI',
          heroSubtitle: 'Temukan penawaran terbaik untuk penerbangan, hotel, dan paket liburan',
          heroImageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
          flightHeroTitle: 'Make your travel wishlist, we\'ll do the rest',
          flightHeroSubtitle: 'Special offers to suit your plan',
          flightHeroImageUrl: 'https://images.unsplash.com/photo-1542296332-2e4473faf563',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      const newSettings = await prisma.siteSettings.create({
        data: body,
      });
      return NextResponse.json(newSettings);
    }

    const updatedSettings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: body,
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
