import React from 'react'
import Link from 'next/link';

export default function PromotionalBanner(){
    return (
         <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/category/laptops" className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 hover:shadow-2xl transition-all duration-300 group">
              <div className="relative z-10">
                <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">LAPTOPS</p>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">Up to 40% Off</h3>
                <p className="text-gray-300 text-sm mb-6">Premium brands at best prices</p>
                <span className="inline-flex items-center text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">Shop Now →</span>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
            </Link>
            <Link href="/category/monitors" className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 md:p-12 hover:shadow-2xl transition-all duration-300 group">
              <div className="relative z-10">
                <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-2">MONITORS</p>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">Starting ₹5,999</h3>
                <p className="text-blue-50 text-sm mb-6">Full HD & 4K displays</p>
                <span className="inline-flex items-center text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">Explore →</span>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
            </Link>
          </div>
        </div>
      </section>
    )
}

