"use client";

import Link from "next/link";
import Image from "next/image";
import { Plane } from "lucide-react";
import LanguageToggle from "./language-toggle";
import { useTranslations } from "next-intl";

type HeaderNavigationProps = {
  mode?: "hero" | "page";
};

export default function HeaderNavigation({ mode = "hero" }: HeaderNavigationProps) {
  const t = useTranslations('nav');
  const isPage = mode === "page";
  const headerClasses = isPage
    ? "bg-white/80 backdrop-blur-sm border-b border-black/10 shadow-sm"
    : "bg-black/30 backdrop-blur-sm border-b border-white/30 shadow-[0_2px_12px_rgba(0,0,0,0.08)]";
  const linkClass = isPage
    ? "flex items-center gap-2 text-foreground hover:text-primary transition-colors"
    : "flex items-center gap-2 text-white hover:text-primary transition-colors";
  const logoTextClass = isPage ? "text-2xl font-bold text-foreground" : "text-2xl font-bold text-white";
  const langToggleClass = isPage
    ? "text-foreground hover:text-primary hover:bg-black/5"
    : "text-white hover:text-primary hover:bg-white/10";
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${headerClasses}`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-20 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/flights"
              className={linkClass}
            >
              <Plane className="h-5 w-5" />
              <span className="font-medium">{t('findFlights')}</span>
            </Link>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Golobe" width={120} height={52} className="h-16 w-auto" />
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <LanguageToggle variant="ghost" className={langToggleClass} />
          </div>
        </div>
      </nav>
    </header>
  );
}