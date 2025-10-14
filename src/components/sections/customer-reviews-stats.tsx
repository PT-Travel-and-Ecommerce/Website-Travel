import React from "react";
import { Star, Users, Medal, TrendingUp, LucideIcon } from "lucide-react";

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
  bgColor: string;
}

const stats: Stat[] = [
  {
    icon: Star,
    value: "5.0",
    label: "Average Rating",
    bgColor: "bg-[#C4F1E0]",
  },
  {
    icon: Users,
    value: "1+",
    label: "Satisfied Customers",
    bgColor: "bg-[#BFE5C6]",
  },
  {
    icon: Medal,
    value: "100%",
    label: "Satisfaction Rate",
    bgColor: "bg-[#F7E9B5]",
  },
  {
    icon: TrendingUp,
    value: "1+",
    label: "5-Star Reviews",
    bgColor: "bg-[#D6E4F7]",
  },
];

const StatCard: React.FC<Stat> = ({ icon: Icon, value, label, bgColor }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 rounded-[12px] p-6 text-center ${bgColor}`}
    >
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/50">
        <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
      </div>
      <p className="text-[3rem] font-semibold leading-none text-dark-charcoal">
        {value}
      </p>
      <p className="text-sm text-medium-gray opacity-75">{label}</p>
    </div>
  );
};

const CustomerReviewsStats: React.FC = () => {
  return (
    <section>
      <div className="mx-auto mb-5 text-center md:mb-10 lg:text-left">
        <h2 className="mb-2 text-3xl font-semibold text-dark-charcoal md:mb-4 lg:text-4xl">
          Customer Reviews
        </h2>
        <p className="text-medium-gray/75">
          Discover what our valued customers say about their Golobe experience
        </p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-gray-300">
        <button className="border-b-2 border-dark-charcoal pb-4 font-bold text-dark-charcoal">
          Customer Reviews
        </button>
        <p className="hidden text-sm font-medium text-dark-charcoal sm:block">
          Showing 1 verified customer reviews
        </p>
      </div>
    </section>
  );
};

export default CustomerReviewsStats;