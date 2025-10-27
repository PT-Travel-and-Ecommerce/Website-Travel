"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewsletterSubscription = () => {
  const t = useTranslations('newsletter');
  return (
    <section>
      <div className="flex flex-col-reverse items-center justify-between gap-16 rounded-[20px] bg-primary p-8 lg:flex-row lg:gap-8 lg:p-16">
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-bold uppercase tracking-wider text-[#112211] lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t('subtitle')}
          </p>
          <form className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Input
              type="email"
              placeholder={t('placeholder')}
              className="h-14 w-full rounded-md border-foreground/20 bg-white placeholder:text-muted-foreground"
            />
            <Button
              className="h-14 w-full shrink-0 rounded-md bg-[#dcac56] text-white hover:bg-[#dcac56]/90 sm:w-32"
            >
              {t('subscribe')}
            </Button>
          </form>
        </div>

        <div className="relative flex w-full justify-center lg:w-1/2 lg:justify-end">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/svgs/mailbox.e298bed9-5.svg?"
            alt="Mailbox illustration for newsletter"
            width={300}
            height={300}
            className="h-48 w-48 lg:h-64 lg:w-64"
          />
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;