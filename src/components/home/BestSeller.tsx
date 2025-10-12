import React from 'react'
import ProductCard from '../product-card'
import { popularProducts } from "@/lib/data/popular-products";
import Link from 'next/link';

export default function BestSeller(){
    return (
        <section className="bg-white dark:bg-gray-800 py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Best Sellers</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Most popular products</p>
            </div>
            <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 hover:underline font-semibold text-sm">View All →</Link>
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


