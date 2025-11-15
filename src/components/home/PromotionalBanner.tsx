'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

export default function PromotionalBanner(){
    const [banners, setBanners] = useState([
      { title: 'LAPTOPS', subtitle: 'Up to 40%-70% Off', description: 'Premium laptops at affordable prices', link: '/category/laptops', bgColor: 'from-slate-900 to-slate-800', textColor: 'text-orange-400' },
      { title: 'Renewed Laptops', subtitle: 'Starting Price ₹15,499', description: 'A++ conditions at lowest price', link: '/category/monitors', bgColor: 'from-blue-600 to-blue-700', textColor: 'text-blue-100' }
    ])

    useEffect(() => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.promotionalBanners) setBanners(data.promotionalBanners)
        })
        .catch(() => {})
    }, [])

    return (
         <section className="py-6">
        <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {banners.map((banner, index) => (
              <Link key={index} href={banner.link || '#'} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${banner.bgColor} p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-all duration-300 group`}>
                <div className="relative z-10">
                  <p className={`text-[10px] sm:text-xs font-bold ${banner.textColor} uppercase tracking-widest mb-1 sm:mb-2`}>{banner.title}</p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">{banner.subtitle}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">{banner.description}</p>
                  <span className="inline-flex items-center text-white font-semibold text-xs sm:text-sm group-hover:translate-x-1 transition-transform">{index === 0 ? 'Shop Now' : 'Explore'} →</span>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
}

