'use client'
import React, { useState, useEffect } from 'react'
import ProductCard from '../product-card'
import Link from 'next/link';
import { toast } from 'sonner'
import { addToCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'

export default function TrendingNow(){
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(5)

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) setDisplayCount(4);
      else if (window.innerWidth < 768) setDisplayCount(6);
      else setDisplayCount(5);
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

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
    fetch('/api/products')
      .then(res => res.json())
      .then(allProducts => {
        const trending = allProducts
          .filter((p: any) => p.mrp && p.mrp > p.price)
          .sort((a: any, b: any) => {
            const discountA = ((a.mrp - a.price) / a.mrp) * 100
            const discountB = ((b.mrp - b.price) / b.mrp) * 100
            return discountB - discountA
          })
        setProducts(trending)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-6 sm:py-10">
      <div className="mx-auto max-w-[1440px]  sm:px-6 lg:px-11">
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-3 sm:px-0">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
            <p className="hidden sm:block sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">What&apos;s hot right now</p>
          </div>
          <Link href="/section/trending" scroll={true} className="sm:px-4 sm:p-2 sm:bg-blue-100 rounded-full text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm whitespace-nowrap hover:underline">View All </Link>
        </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0 sm:gap-2">
          {loading ? (
            Array.from({ length: displayCount }).map((_, i) => (
              <div key={i} className="bg-white rounded-sm p-4 animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            products.slice(0, displayCount).map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
