import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const hotelDestinations = [
  {
    city: "Sarasota",
    country: "USA",
    type: "Boutique",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/images/next-985638-pexels-photo-297983.jpeg?",
  },
  {
    city: "Kirkland",
    country: "USA",
    type: "Budget",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/images/next-535755-pexels-photo-14024792.jpeg?",
  },
  {
    city: "Austin",
    country: "USA",
    type: "Budget",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/images/next-665191-pexels-photo-13312426.jpeg?",
  },
  {
    city: "Honolulu",
    country: "USA",
    type: "Suite",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/images/next-622162-pexels-photo-6243853.jpeg?",
  },
  {
    city: "Denver",
    country: "USA",
    type: "Resort and Spa",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/images/next-543105-pexels-photo-9400979.jpeg?",
  },
  {
    city: "Lexington",
    country: "USA",
    type: "Budget",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/images/next-178325-free-photo-of-palm-trees-by-the-pool.jpeg?",
  },
  {
    city: "Seattle",
    country: "USA",
    type: "Suite",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/images/next-563701-free-photo-of-scenic-resort-at-tegenungan-waterfall-in-ubud-bali.jpeg?",
  },
  {
    city: "Tulsa",
    country: "USA",
    type: "Suite",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/images/next-381585-pexels-photo-338504.jpeg?",
  },
  {
    city: "Redmond",
    country: "USA",
    type: "Budget",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/images/next-563701-free-photo-of-scenic-resort-at-tegenungan-waterfall-in-ubud-bali.jpeg?",
  },
  {
    city: "Detroit",
    country: "USA",
    type: "Budget",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7365a454-8401-4e16-a806-259d074b2966-golob-travel-agency-vercel-app/assets/images/next-326416-pexels-photo-9400828.jpeg?",
  },
];

const checkIn = 1760227200000;
const checkOut = 1760313600000;
const rooms = 1;
const guests = 1;

const PopularHotelDestinations = () => {
  return (
    <section className="mx-auto">
      <div className="mx-auto mb-[20px] flex items-center justify-between max-md:flex-col max-md:gap-[16px] md:mb-[40px]">
        <div className="md:flex-[0_0_50%]">
          <h2 className="mb-2 text-center text-[2rem] font-semibold text-black md:mb-4 md:text-left">
            Popular Hotel Destinations
          </h2>
          <p className="text-center text-medium-gray md:text-left opacity-75">
            Explore the most sought-after destinations for hotel stays. From
            tropical beaches to urban centers, discover where travelers love to
            stay.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {hotelDestinations.map((dest) => {
          const href = `/hotels/search/city=${dest.city}&country=${dest.country}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=${rooms}&guests=${guests}`;
          return (
            <Link href={href} key={dest.city} className="group">
              <Card className="overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={dest.image}
                      alt={`hotel_image_${dest.city}_${dest.country}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-black shadow-md">
                      {dest.type}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {dest.city}, {dest.country}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default PopularHotelDestinations;