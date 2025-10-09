"use client"

import type { Metadata } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { popularProducts } from "@/lib/data/popular-products";
import HeaderSlider from "@/components/home/HomeSlider";
import ProductCard from "@/components/product-card";
import { Footer } from "@/components/Footer";
import Loading from "./loading";

export default function HomePage() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return (
// <Loading/>
//     );
//   }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Slider */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="mx-auto md:px-4">
          <HeaderSlider />
        </div>
      </section>

      {/* Quick Categories */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="mx-auto max-w-[1400px] px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 ">
            {[
              { name: 'Laptops', href: '/category/laptops' },
              { name: 'Monitors', href: '/category/monitors' },
              { name: 'Keyboards', href: '/category/keyboards' },
              { name: 'Mouse', href: '/category/mouse' },
              { name: 'Chargers', href: '/category/chargers' },
              { name: 'Accessories', href: '/category/laptop-accessories' }
            ].map((cat) => (
              <Link key={cat.name} href={cat.href} className="group">
                <div className="bg-gray-50 dark:bg-gray-900 border overflow-hidden border-gray-200 dark:border-gray-700 rounded p-4 text-center hover:bg-blue-50 dark:hover:bg-gray-800 hover:border-blue-400 transition-all">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 ">
            {popularProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-10 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link href="/category/laptops" className="relative overflow-hidden rounded bg-slate-900 p-6 sm:p-8 md:p-12 hover:opacity-95 transition-opacity">
              <div className="relative z-10">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">LAPTOPS</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Up to 40% Off</h3>
                <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">Premium brands at best prices</p>
                <span className="hidden sm:inline-flex items-center text-white font-semibold text-xs sm:text-sm border-b-2 border-white pb-1">Shop Now →</span>
              </div>
            </Link>
            <Link href="/category/monitors" className="relative overflow-hidden rounded bg-blue-600 p-6 sm:p-8 md:p-12 hover:opacity-95 transition-opacity">
              <div className="relative z-10">
                <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1 sm:mb-2">MONITORS</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Starting ₹5,999</h3>
                <p className="text-blue-50 text-xs sm:text-sm mb-4 sm:mb-6">Full HD & 4K displays</p>
                <span className="hidden sm:inline-flex items-center text-white font-semibold text-xs sm:text-sm border-b-2 border-white pb-1">Explore →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Best Sellers</h2>
            <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">View All →</Link>
          </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-hidden">
            {popularProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Brands */}
      <section className="py-10 bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700">
        <div className="mx-auto max-w-[1400px] px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shop by Brand</h2>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 ">
            {['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Asus'].map((brand) => (
              <Link key={brand} href="/products" scroll={true} className="bg-gray-50 dark:bg-gray-900 border overflow-hidden border-gray-200 dark:border-gray-700 rounded p-5 text-center hover:bg-white dark:hover:bg-gray-800 hover:border-blue-500 hover:shadow-md transition-all group">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{brand}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-10 bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-6 ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
            <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">View All →</Link>
          </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 ">
            {popularProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="py-10 bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Deal of the Day</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Limited time offers</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ends in 12h 30m</span>
            </div>
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 ">
            {popularProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Arrivals</h2>
            <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">View All →</Link>
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 ">
            {popularProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>


      {/* Trust Badges */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Genuine Products</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">100% Authentic</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Safe & Encrypted</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">On orders above ₹500</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">7 Days Return Policy</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
