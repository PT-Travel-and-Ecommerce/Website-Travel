"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import { useTranslations } from 'next-intl';

const GolobeLogo = () => (
  <Link href="/" aria-label="Golobe logo. Click to go to home page">
    <div className="flex items-center">
      <Image src="/logo.png" alt="Golobe" width={140} height={36} className="h-44 w-auto" />
    </div>
  </Link>
);


const Footer = () => {
  const t = useTranslations('footer');
  return (
    <footer className="bg-primary px-4 py-10 text-white md:px-20 md:py-10">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-4">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
          <GolobeLogo />
          <div className="flex gap-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="h-6 w-6 text-white transition-opacity hover:opacity-80" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="h-6 w-6 text-white transition-opacity hover:opacity-80" />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
              <Youtube className="h-6 w-6 text-white transition-opacity hover:opacity-80" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-6 w-6 text-white transition-opacity hover:opacity-80" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <h3 className="font-bold">{t('ourDestination')}</h3>
          <Link href="#" className="hover:underline">{t('canada')}</Link>
          <Link href="#" className="hover:underline">{t('alaska')}</Link>
          <Link href="#" className="hover:underline">{t('france')}</Link>
          <Link href="#" className="hover:underline">{t('iceland')}</Link>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <h3 className="font-bold">{t('ourActivity')}</h3>
          <Link href="#" className="hover:underline">{t('northernLights')}</Link>
          <Link href="#" className="hover:underline">{t('cruisingSailing')}</Link>
          <Link href="#" className="hover:underline">{t('multiActivities')}</Link>
          <Link href="#" className="hover:underline">{t('kayaking')}</Link>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <h3 className="font-bold">{t('travelBlogs')}</h3>
          <Link href="#" className="hover:underline">{t('baliGuide')}</Link>
          <Link href="#" className="hover:underline">{t('srilankaGuide')}</Link>
          <Link href="#" className="hover:underline">{t('peruGuide')}</Link>
        </div>

        <div className="flex flex-col gap-8 text-sm">
          <div className="flex flex-col gap-4">
            <h3 className="font-bold">{t('aboutUs')}</h3>
            <Link href="#" className="hover:underline">{t('ourStory')}</Link>
            <Link href="#" className="hover:underline">{t('workWithUs')}</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-bold">{t('contactSection')}</h3>
            <Link href="/support" className="hover:underline">{t('supportCenter')}</Link>
            <Link href="/privacy" className="hover:underline">{t('privacyPolicy')}</Link>
            <Link href="/terms" className="hover:underline">{t('termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;