import React from 'react'
import ProductCard from '../product-card'
import { popularProducts } from "@/lib/data/popular-products";

export default function DealoftheDay(){
    return (
        <section className="py-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-700">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Deal of the Day</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Limited time offers</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ends in 12h 30m</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {popularProducts.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    )
}

