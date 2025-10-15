"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const HeaderSlider = () => {
  const [sliderData, setSliderData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [transitioning, setTransitioning] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.slider) setSliderData(data.slider);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Auto slide every 3s
  useEffect(() => {
    if (sliderData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderData.length]);

  // Infinite effect
  useEffect(() => {
    if (currentSlide === sliderData.length) {
      // reached clone, disable transition and reset to first
      const timeout = setTimeout(() => {
        setTransitioning(false);
        setCurrentSlide(0);
      }, 700); // match transition duration
      return () => clearTimeout(timeout);
    } else {
      setTransitioning(true);
    }
  }, [currentSlide, sliderData.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="overflow-hidden relative w-full">
        <div
          className="relative px-1 sm:py-16 md:py-20 sm:px-8 md:px-12 mt-5 sm:mt-10 bg-gray-200 animate-pulse flex items-center sm:rounded-lg"
          style={{ height: "280px" }}
        >
          <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
            <div className="h-4 sm:h-5 bg-gray-300 rounded w-32 sm:w-48"></div>
            <div className="space-y-2">
              <div className="h-6 sm:h-8 md:h-10 bg-gray-300 rounded w-full max-w-md"></div>
              <div className="h-6 sm:h-8 md:h-10 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="flex gap-2 sm:gap-3 pt-2">
              <div className="h-9 sm:h-10 bg-gray-300 rounded-full w-24 sm:w-32"></div>
              <div className="h-9 sm:h-10 bg-gray-300 rounded-full w-24 sm:w-32"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 my-3 sm:my-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gray-300"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (sliderData.length === 0) return null;

  // clone first slide at end for infinite loop
  const slides = [...sliderData, sliderData[0]];

  return (
    <div className="overflow-hidden relative w-full">
      <div
        ref={sliderRef}
        className={`flex ${
          transitioning ? "transition-transform duration-700 ease-in-out" : ""
        }`}
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Link
            href={(slide as any).link || "/products"}
            key={index}
            className="min-w-full block sm:rounded-lg overflow-hidden"
          >
            <div
              className="relative px-1 sm:py-16 md:py-20 sm:px-8 md:px-12 mt-5 sm:mt-10 md:!min-h-[350px] lg:!min-h-[400px] cursor-pointer overflow-hidden flex items-center sm:rounded-lg"
              style={{
                backgroundImage: (slide as any).image
                  ? `url(${(slide as any).image})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#E6E9F2",
                minHeight: "270px",
              }}
            >
              {(slide as any).image && !loadedImages.has(slide.id) && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse" />
              )}
              {(slide as any).image && (
                <Image
                  fetchPriority="high"
                  fill
                  src={(slide as any).image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover sm:rounded-lg"
                  onLoad={() =>
                    setLoadedImages((prev) => new Set(prev).add(slide.id))
                  }
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-[1]"></div>
              <div className="relative z-10 max-w-xl text-white px-4 sm:px-0">
                <p className="text-[10px] sm:text-sm text-orange-400 pb-1 sm:pb-2 font-bold uppercase tracking-wide">
                  {slide.offer}
                </p>
                <h1 className="text-base sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-5 leading-tight">
                  {slide.title}
                </h1>
                <div className="flex flex-row items-center gap-2 sm:gap-3 ">
                  <div className="text-[10px] sm:text-sm px-3 text-center sm:px-8 py-1.5 sm:py-2.5 bg-orange-600 hover:bg-orange-700 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                    {slide.buttonText1}
                  </div>
                  <div className="group flex items-center gap-1 text-center sm:gap-1.5 text-[10px] sm:text-sm px-3 sm:px-7 py-1.5 sm:py-2.5 font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full transition-all">
                    {slide.buttonText2}
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 my-3 sm:my-4">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full cursor-pointer transition-all ${
              currentSlide % sliderData.length === index
                ? "bg-orange-600 w-6 sm:w-8"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
