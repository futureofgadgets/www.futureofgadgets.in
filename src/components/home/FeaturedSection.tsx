import React from "react";
import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";

export default function FeaturedSection() {
  const extraData = [
    {
      title: "Free Delivery",
      description: "Free shipping over $100",
      icon: <Truck size={40} />,
    },
    {
      title: "Free Return",
      description: "30-day return policy",
      icon: <GitCompareArrows size={40} />,
    },
    {
      title: "Customer Support",
      description: "Friendly 24/7 customer support",
      icon: <Headset size={40} />,
    },
    {
      title: "Money Back Guarantee",
      description: "Quality checked by our team",
      icon: <ShieldCheck size={40} />,
    },
  ];

  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {extraData?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-blue-600 dark:text-blue-400">
                {item?.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {item?.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                  {item?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
