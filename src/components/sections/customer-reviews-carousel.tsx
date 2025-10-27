"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, Users, BadgePercent, BarChart3 as TrendingUp, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

type Stat = { icon: React.ComponentType<any>; value: string; labelKey: string; bgColor: string };

const stats: Stat[] = [
  {
    icon: Star,
    value: "5.0",
    labelKey: "averageRating",
    bgColor: "bg-chart-1/20",
  },
  {
    icon: Users,
    value: "1+",
    labelKey: "satisfiedCustomers",
    bgColor: "bg-primary/20",
  },
  {
    icon: BadgePercent,
    value: "100%",
    labelKey: "satisfactionRate",
    bgColor: "bg-chart-2/40",
  },
  {
    icon: TrendingUp,
    value: "1+",
    labelKey: "fiveStarReviews",
    bgColor: "bg-chart-3/40",
  },
];

const StatCard = React.memo(({ icon: Icon, value, labelKey, bgColor }: Stat) => {
  const t = useTranslations('stats');
  return (
    <div className={`p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-2 text-center shadow-sm ${bgColor}`}>
      <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
      <p className="text-3xl font-bold text-dark-charcoal">{value}</p>
      <p className="text-sm text-medium-gray">{t(labelKey as any)}</p>
    </div>
  );
});
StatCard.displayName = 'StatCard';

type ReviewTextProps = { text: string };

const ReviewText = ({ text }: ReviewTextProps) => {
  const t = useTranslations('reviews');
  const [isExpanded, setIsExpanded] = useState(false);
  const shortText = text.length > 250 ? text.substring(0, 250) + "..." : text;

  return (
    <p className="mt-5 text-justify text-base text-medium-gray">
      {isExpanded ? text : shortText}
      {text.length > 250 && (
         <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1 font-semibold text-primary underline underline-offset-4"
        >
            {isExpanded ? t('viewLess', { default: 'View less' }) : t('viewMore', { default: 'View more' })}
        </button>
      )}
    </p>
  );
};

type Review = { name: string; title: string; rating: number; text: string };

const EmblaCarousel = ({ reviews }: { reviews: Review[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative mx-auto mt-8 max-w-4xl">
        <button
          className="embla__prev absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary p-3 text-white shadow-lg transition-opacity hover:opacity-80 disabled:opacity-30 sm:-left-6 md:-left-10 lg:-left-16"
          onClick={scrollPrev}
          aria-label="Previous review"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {reviews.map((review: Review, index: number) => (
            <div key={index} className="embla__slide min-w-0 flex-[0_0_100%] px-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-dark-charcoal">{review.name}</h3>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-dark-charcoal">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-medium-gray">{review.title}</p>
                    <ReviewText text={review.text} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        <button
          className="embla__next absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary p-3 text-white shadow-lg transition-opacity hover:opacity-80 disabled:opacity-30 sm:-right-6 md:-right-10 lg:-right-16"
          onClick={scrollNext}
          aria-label="Next review"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
    </div>
  );
};

const CustomerReviewsCarousel = () => {
  const t = useTranslations('reviews');
  const tCommon = useTranslations('common');
  const [reviews, setReviews] = useState([
    {
      name: tCommon('loading'),
      title: tCommon('pleaseWait'),
      rating: 5.0,
      text: tCommon('loadingReviews'),
    }
  ]);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formattedReviews = data
            .filter(review => review.isActive)
            .map(review => ({
              name: review.customerName,
              title: review.location || tCommon('verifiedCustomer'),
              rating: review.rating,
              text: review.comment,
            }));
          setReviews(formattedReviews);
        }
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setReviews([
          {
            name: "Mojahid",
            title: tCommon('verifiedCustomer'),
            rating: 5.0,
            text: "Using this travel agency's website has been a seamless experience. The platform is user-friendly and professional, making it easy to search and book flights and hotels.",
          }
        ]);
      });
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">
          {t('title', { default: 'What Our Customers Say' })}
        </h2>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <EmblaCarousel reviews={reviews} />
      </div>
    </section>
  );
};

export default CustomerReviewsCarousel;
