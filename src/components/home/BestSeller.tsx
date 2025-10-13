'use client'
import React, { useState, useEffect } from 'react'
import ProductCard from '../product-card'
import { popularProducts } from "@/lib/data/popular-products";
import Link from 'next/link';
import { toast } from 'sonner'
import { addToCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'

export default function BestSeller(){
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
      const ids = settings.sectionProducts?.bestSeller || []
      if (ids.length > 0) {
        setProducts(allProducts.filter((p: any) => ids.includes(p.id)).slice(0, 5))
      } else {
        setProducts(popularProducts.slice(0, 5))
      }
    }).catch(() => setProducts(popularProducts.slice(0, 5)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-6 sm:py-10">
      <div className="mx-auto max-w-[1440px]  sm:px-6 lg:px-11">
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-3 sm:px-0">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Best Sellers</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">Most popular products</p>
          </div>
          <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm whitespace-nowrap hover:underline">View All →</Link>
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
