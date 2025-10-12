"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const HeaderSlider = () => {
  const [sliderData, setSliderData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.slider) setSliderData(data.slider)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (sliderData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="overflow-hidden relative w-full">
        <div className="relative py-16 md:py-24 px-5 md:px-14 mt-6 min-h-[200px] sm:min-h-[350px] md:min-h-[350px] xl:min-h-[450px] 2xl:min-h-[500px] bg-gray-200 animate-pulse flex items-center">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="h-5 md:h-6 bg-gray-300 rounded w-48"></div>
            <div className="space-y-3">
              <div className="h-8 md:h-12 bg-gray-300 rounded w-full max-w-xl"></div>
              <div className="h-8 md:h-12 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="flex gap-4 pt-2">
              <div className="h-10 md:h-11 bg-gray-300 rounded-full w-28 md:w-36"></div>
              <div className="h-10 md:h-11 bg-gray-300 rounded-full w-28 md:w-36"></div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center justify-center gap-2 my-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-2 w-2 rounded-full bg-gray-300"></div>
          ))}
        </div>
      </div>
    );
  }

  if (sliderData.length === 0) return null;

  return (
    <div className="overflow-hidden relative w-full ">
      <div
        className="flex transition-transform duration-700 ease-in-out "
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <Link href={(slide as any).link || '/products'} key={slide.id} className="min-w-full block rounded-sm overflow-hidden">
            <div
              className="relative py-16 md:py-24 px-5 md:px-14 mt-6 cursor-pointer overflow-hidden flex items-center rounded-sm"
              style={{
                backgroundImage: (slide as any).image ? `url(${(slide as any).image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#E6E9F2'
              }}
            >
              {(slide as any).image && !loadedImages.has(slide.id) && (
                <div className="absolute inset-0 bg-gray-300 animate-puls overflow-hidden" />
              )}
              {(slide as any).image && (
                <Image
                 fetchPriority="high" 
                 fill
                  src={(slide as any).image}
                  alt=""
                  className="absolute inset-0 w-full h-20 object-cover opacity-0 rounded-sm overflow-hidden"
                  onLoad={() => setLoadedImages(prev => new Set(prev).add(slide.id))}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-[1]"></div>
              <div className="relative z-10 max-w-2xl text-white">
                <p className="text-xs sm:text-sm md:text-base text-orange-400 pb-1 sm:pb-2 font-semibold">{slide.offer}</p>
                <h1 className="text-lg sm:text-2xl md:text-[40px] md:leading-[48px] font-bold mb-3 sm:mb-6">
                  {slide.title}
                </h1>
                <div className="flex items-center gap-2 sm:gap-4">
                  <Button className="text-xs sm:text-sm md:text-base md:px-10 px-4 sm:px-7 md:py-2.5 py-1.5 sm:py-2 bg-orange-600 hover:bg-orange-700 rounded-full text-white font-medium cursor-pointer" >
                    {slide.buttonText1}
                  </Button>
                  <Button className="group flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base px-4 sm:px-6 py-1.5 sm:py-2.5 font-medium bg-white/20 hover:bg-white/30 border-none shadow-none text-white cursor-pointer rounded-full">
                    {slide.buttonText2}
                    <span className="group-hover:translate-x-1 transition">→</span>
                  </Button>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>

      <div className="hidden sm:flex items-center justify-center gap-2 my-4">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
