'use client'
import React, { useState, useEffect } from 'react'
import ProductCard from '../product-card'
import { toast } from 'sonner'
import { addToCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'

export default function FeaturedSection() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])

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
      const ids = settings.sectionProducts?.featuredSection || []
      if (ids.length > 0) {
        setProducts(allProducts.filter((p: any) => ids.includes(p.id)).slice(0, 5))
      } else {
        setProducts([])
      }
    }).catch(() => setProducts([]))
  }, [])

  return (
    <section className="py-6 sm:py-10">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        {products.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0 sm:gap-2">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
