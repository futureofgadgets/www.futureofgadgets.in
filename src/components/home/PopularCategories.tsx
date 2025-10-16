"use client"
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const categoryData = [
  { name: "Laptops", image: "/category/laptop.jpeg", href: "/category/laptops" },
  { name: "Keyboards", image: "/category/keyboard.jpeg", href: "/category/keyboards" },
  { name: "Mouse", image: "/category/mouse.jpeg", href: "/category/mouse" },
  { name: "Headphones", image: "/category/headphones.jpeg", href: "/category/headphones" },
  { name: "Accessories", image: "/category/accessories.png", href: "/category/accessories" },
];

export default function PopularCategories() {
  const [categories, setCategories] = useState(categoryData.map(c => ({ ...c, count: 0 })));

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(products => {
        const counts = categoryData.map(cat => {
          const count = products.filter((p: any) => 
            p.category?.toLowerCase() === cat.name.toLowerCase()
          ).length;
          return { ...cat, count };
        });
        setCategories(counts);
      })
      .catch(() => {});
  }, []);
  return (
    <section className="py-6 sm:py-10">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="border border-[#c1e5cf] dark:border-gray-700 rounded-lg p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white pb-2 sm:pb-3 border-b border-[#c1e5cf] dark:border-gray-700">
              Popular Categories
            </h2>
          </div>

           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="bg-[#f6f6f6] dark:bg-gray-800 p-3 sm:p-5 rounded-lg hover:bg-[#e7e7e7] dark:hover:bg-gray-700 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 rounded-lg">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={50}
                      height={50}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-0.5 truncate">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      ({category.count}) items
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            <Link
              href="/category/"
              className="bg-[#f6f6f6] dark:bg-gray-800 p-3 sm:p-5 rounded-lg hover:bg-[#e7e7e7] dark:hover:bg-gray-700 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 rounded-lg">
                  <div className="flex flex-col items-center justify-center text-[#4a5f52] dark:text-green-400">
                    <ArrowRight size={24} className="sm:w-8 sm:h-8 group-hover:translate-x-1 transition-transform" />
                    <span className="text-[10px] sm:text-xs font-semibold mt-0.5">See All</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-0.5 truncate">
                    See All
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    All items
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
