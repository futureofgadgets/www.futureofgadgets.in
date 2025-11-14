"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const brands = [
  { name: "Apple", image: "/brand/Apple.png" },
  { name: "Dell", image: "/brand/dell.png" },
  { name: "HP", image: "/brand/hp.png" },
  { name: "Lenovo", image: "/brand/lenovo.png" },
  { name: "Alian Ware", image: "/brand/alianware.png" },
];

export default function ShopByBrands() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    const scroll = () => {
      if (!isPaused && !isDragging.current) {
        container.scrollLeft += 1;
        const maxScroll = container.scrollWidth / 3;
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setIsPaused(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].pageX;
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0].pageX;
    const walk = (startX.current - x) * 2;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft.current + walk;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  return (
    <section className="py-6">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="border border-[#c1e5cf] dark:border-gray-700 rounded-lg p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white pb-2 sm:pb-3 border-b border-[#c1e5cf] dark:border-gray-700">
              Shop By Brands
            </h2>
          </div>
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hidden cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => { setIsPaused(false); isDragging.current = false; }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex gap-3 sm:gap-4">
              {[...brands, ...brands, ...brands].map((brand, idx) => (
                <a
                  key={`${brand.name}-${idx}`}
                  href={`/search?q=${brand.name.toLowerCase()}`}
                  className="bg-white dark:bg-gray-800 min-w-[100px] sm:min-w-[120px] h-16 sm:h-20 flex items-center justify-center rounded-lg overflow-hidden hover:shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600 flex-shrink-0 group"
                  onClick={(e) => isDragging.current && e.preventDefault()}
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={100}
                    height={70}
                    className="w-12 h-9 sm:w-16 sm:h-12 object-contain transition-transform duration-300 pointer-events-none scale-120 group-hover:scale-130 hover:cursor-pointer"
                    draggable={false}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
