"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const laptopCategories = [
  { name: "Slim Laptops", image: "/category/ultra_thin_laptop.jpg", href: "/category/slim-laptop" },
  { name: "Apple Macbook", image: "/category/regular_laptop.jpg", href: "/category/apple-macbook" },
  { name: "Touch Laptops", image: "/category/touchscreen.png", href: "/category/touch-laptop" },
  { name: "Pro Laptops", image: "/category/pro_laptop.jpg", href: "/category/pro-laptop" },
  { name: "Gaming Laptops", image: "/category/best-gaming-laptop.jpg", href: "/category/gaming-laptop" },
  { name: "Office Laptops", image: "/category/office_laptop.jpg", href: "/category/office-laptop" },
];

export default function LaptopCarousel() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // pointer drag refs
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  // adaptive speed: pixels added per animation frame
  const speedRef = useRef<number>(1); // default (desktop)
  const isMobileRef = useRef<boolean>(false);
  const animationIdRef = useRef<number | null>(null);

  // initialize and update speed based on viewport
  useEffect(() => {
    const updateSpeed = () => {
      const width = window.innerWidth;
      // adjust breakpoints & speeds as you like
      if (width < 640) {
        isMobileRef.current = true;
        speedRef.current = 0.35; // slow on small screens
      } else if (width < 1024) {
        isMobileRef.current = false;
        speedRef.current = 0.7; // medium speed for tablet
      } else {
        isMobileRef.current = false;
        speedRef.current = 1.2; // a little faster on large screens
      }
    };

    updateSpeed();
    window.addEventListener("resize", updateSpeed);
    return () => window.removeEventListener("resize", updateSpeed);
  }, []);

  // auto-scroll loop using rAF and adaptive speed
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let frameCounter = 0;

    const loop = () => {
      if (!isPaused && !isPointerDownRef.current) {
        frameCounter++;
        // We can optionally use frameCounter % n to slow down more, but using small float speed is simpler
        container.scrollLeft += speedRef.current;
        // when we've scrolled through one chunk (we duplicated items 3x), reset to keep continuous loop
        if (container.scrollLeft >= container.scrollWidth / 3) {
          container.scrollLeft = 0;
        }
      }
      animationIdRef.current = requestAnimationFrame(loop);
    };

    animationIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    };
  }, [isPaused]);

  // drag / swipe handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    const container = scrollRef.current;
    if (!container) return;
    isPointerDownRef.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startXRef.current = e.clientX;
    startScrollLeftRef.current = container.scrollLeft;
    setIsPaused(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const container = scrollRef.current;
    if (!container || !isPointerDownRef.current) return;
    const dx = e.clientX - startXRef.current;
    container.scrollLeft = startScrollLeftRef.current - dx;
  };

  const handlePointerUp = (e?: React.PointerEvent) => {
    if (isPointerDownRef.current && e) {
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
    isPointerDownRef.current = false;
    // small delay before auto-scroll resumes
    setTimeout(() => setIsPaused(false), 150);
  };

  return (
    <section className="py-3 sm:py-6">
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-2 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-hidden select-none touch-pan-x"
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {[...laptopCategories, ...laptopCategories, ...laptopCategories].map((category, idx) => (
              <Link
                key={`${category.name}-${idx}`}
                href={category.href}
                className="flex flex-col items-center group flex-shrink-0"
                onClick={(e) => {
                  if (isPointerDownRef.current) e.preventDefault();
                }}
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={200}
                      height={200}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-center py-0.5 sm:py-1.5 text-[9px] sm:text-xs font-semibold">
                    {category.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
