import HeaderNavigation from "@/components/sections/header-navigation";
import HeroBanner from "@/components/sections/hero-banner";
import FlightSearchForm from "@/components/sections/flight-search-form";
import PopularFlightDestinations from "@/components/sections/popular-flight-destinations";
import CtaCards from "@/components/sections/cta-cards";
import CustomerReviewsCarousel from "@/components/sections/customer-reviews-carousel";
import NewsletterSubscription from "@/components/sections/newsletter-subscription";
import Footer from "@/components/sections/footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <HeaderNavigation />
        <HeroBanner />
        <FlightSearchForm />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-20 space-y-20 py-20">
        <PopularFlightDestinations />
        <CtaCards />
        <CustomerReviewsCarousel />
        <NewsletterSubscription />
      </main>

      <Footer />
    </div>
  );
}