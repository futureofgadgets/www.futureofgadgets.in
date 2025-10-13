'use client'
import React, { useState, useEffect } from 'react'
import ProductCard from '../product-card'
import { popularProducts } from "@/lib/data/popular-products";
import { toast } from 'sonner'
import { addToCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'

export default function DealoftheDay(){
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.frontImage || product.image
    })
    toast.success('', { description: `${product.name} has been added to your cart.` })
  }

  const handleBuyNow = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.frontImage || product.image
    })
    router.push('/cart')
  }

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(res => res.json()),
      fetch('/api/products').then(res => res.json())
    ]).then(([settings, allProducts]) => {
      const ids = settings.sectionProducts?.dealOfTheDay || []
      if (ids.length > 0) {
        setProducts(allProducts.filter((p: any) => ids.includes(p.id)).slice(0, 5))
      } else {
        setProducts(popularProducts.slice(0, 5))
      }
    }).catch(() => setProducts(popularProducts.slice(0, 5)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-6 sm:py-10 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-700">
      <div className="mx-auto max-w-[1440px]  sm:px-6 lg:px-11">
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-3 sm:px-0">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Deal of the Day</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">Limited time offers</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 018 0z" />
            </svg>
            <span className="hidden sm:inline">Ends in 12:00</span>
            <span className="sm:hidden">12:00</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0 sm:gap-2">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-sm p-4 animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
