"use client";

import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { useTransition } from "react";

type LanguageToggleProps = {
  variant?: "default" | "ghost";
  className?: string;
};

export default function LanguageToggle({ variant = "ghost", className = "" }: LanguageToggleProps) {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newLocale = locale === 'id' ? 'en' : 'id';

    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      window.location.reload();
    });
  };

  return (
    <Button
      variant={variant}
      onClick={handleToggle}
      disabled={isPending}
      className={className}
    >
      {locale === 'id' ? 'EN' : 'ID'}
    </Button>
  );
}
