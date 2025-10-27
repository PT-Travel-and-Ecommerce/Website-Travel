"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const CtaCards = () => {
  const t = useTranslations('nav');
  const tCta = useTranslations('ctaCards');
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="relative group overflow-hidden rounded-2xl h-[440px]">
        <Image
          src="/flight.jpeg"
          alt="Airport tarmac with plane and ground vehicle"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />
        <div className="relative flex h-full flex-col justify-center text-white px-5 py-10" style={{ zIndex: 2 }}>
          <h3 className="mb-2 text-[2.5rem] font-bold text-white">{tCta('flightsTitle')}</h3>
          <p className="mb-5 max-w-[40ch] text-lg text-white leading-6 line-clamp-2">
            {tCta('flightsDescription')}
          </p>
          <Link
            href="/flights"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-[#9BE0C8] active:bg-[#82CBB2] focus:bg-[#A5EBD3] h-[48px] px-[16px] rounded-[4px] py-[8px] mt-auto w-fit gap-[6px]"
          >
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/svgs/paper-plane-filled-4.svg?"
              alt="paper plane icon"
              width={24}
              height={24}
            />
            {t('findFlights')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaCards;