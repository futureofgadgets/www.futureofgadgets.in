"use client"
import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

const brands = [
  { name: "Apple", image: "/brand/Apple.png",},
  { name: "Dell", image: "/brand/dell.png" },
  { name: "HP", image: "/brand/hp.png" },
  { name: "Lenovo", image: "/brand/lenovo.png" },
  { name: "Alian Ware", image: "/brand/alianware.png" },
];

const ITEM_WIDTH = 140;
const AUTO_SCROLL_INTERVAL = 3000;

const ShopByBrands = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    autoScrollRef.current = setInterval(() => {
      if (scrollRef.current && !isScrollingRef.current) {
        scrollRef.current.scrollBy({ left: ITEM_WIDTH, behavior: "smooth" });
      }
    }, AUTO_SCROLL_INTERVAL);
  }, [stopAutoScroll]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || brands.length === 0) return;

    const singleSetWidth = brands.length * ITEM_WIDTH;

    const handleScroll = () => {
      const { scrollLeft } = container;

      if (!isScrollingRef.current) {
        if (scrollLeft >= singleSetWidth * 2) {
          isScrollingRef.current = true;
          container.scrollLeft = singleSetWidth + (scrollLeft - singleSetWidth * 2);
          requestAnimationFrame(() => {
            isScrollingRef.current = false;
          });
        } else if (scrollLeft < singleSetWidth) {
          isScrollingRef.current = true;
          container.scrollLeft = singleSetWidth + scrollLeft;
          requestAnimationFrame(() => {
            isScrollingRef.current = false;
          });
        }
      }
    };

    container.scrollLeft = singleSetWidth;
    container.addEventListener("scroll", handleScroll, { passive: true });
    startAutoScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      stopAutoScroll();
    };
  }, [startAutoScroll, stopAutoScroll]);

  return (
     <section className="py-6">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="border border-[#c1e5cf] dark:border-gray-700 rounded-lg p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white pb-2 sm:pb-3 border-b border-[#c1e5cf] dark:border-gray-700">Shop By Brands</h2>
          </div>
          <div 
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
          >
            {[...brands, ...brands, ...brands].map((brand, idx) => (
            <a
              key={`${brand.name}-${idx}`}
              href={`/search?q=${brand.name.toLowerCase()}`}
              className="bg-white dark:bg-gray-800 min-w-[100px] sm:min-w-[120px] h-16 sm:h-20 flex items-center justify-center rounded-lg overflow-hidden hover:shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600 flex-shrink-0"
            >
              <Image
                src={brand.image}
                alt={brand.name}
                width={100}
                height={70}
                className="w-12 h-9 sm:w-16 sm:h-12 object-contain transition-all duration-300 scale-130 hover:scale-150"
              />
            </a>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByBrands;
