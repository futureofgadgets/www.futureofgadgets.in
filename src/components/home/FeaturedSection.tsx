'use client'
import React, { useState, useEffect } from 'react'
import ProductCard from '../product-card'
import { toast } from 'sonner'
import { addToCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'

export default function FeaturedSection() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
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
    Promise.all([
      fetch('/api/settings').then(res => res.json()),
      fetch('/api/products').then(res => res.json())
    ]).then(([settings, allProducts]) => {
      const ids = settings.sectionProducts?.featuredSection || []
      if (ids.length > 0) {
        setProducts(allProducts.filter((p: any) => ids.includes(p.id)))
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
              <a href="/section/featured" className="sm:px-4 sm:p-2 sm:bg-blue-100 rounded-full text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm whitespace-nowrap hover:underline">View All</a>
            </div>
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0 sm:gap-2">
              {products.slice(0, displayCount).map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
