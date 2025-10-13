'use client'

import { useEffect, useState } from 'react'
import { getWishlist, removeFromWishlist, type WishlistItem } from '@/lib/wishlist'
import { addToCart } from '@/lib/cart'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2, Sparkles, TrendingUp, Tag, Share2, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setItems(getWishlist())
    setLoading(false)
    const onUpdate = () => setItems(getWishlist())
    window.addEventListener('wishlist-updated', onUpdate)
    return () => window.removeEventListener('wishlist-updated', onUpdate)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 animate-pulse">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded-full" />
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-48" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden border">
                <div className="aspect-square bg-gray-200" />
                <div className="p-2 sm:p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen mt-5 sm:mt-2 bg-white to-white p-4">
        <header className="mb-8 text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 sm:mt-2">Save your favorite items for later</p>
        </header>
        <div className="max-w-2xl w-full text-center mx-auto">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-red-100 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-gradient-to-br from-pink-200 to-red-200 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-pink-500" strokeWidth={1.5} />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Your Wishlist is Empty</h1>
          <p className="text-sm sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-md mx-auto">
            Start adding products you love and keep track of items you want to buy later
          </p>
          
          <Link href="/" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:from-pink-600 hover:to-red-600 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            Start Shopping
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
            <div className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Save Favorites</h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center">Keep track of products you love</p>
            </div>
            
            <div className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Track Prices</h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center">Get notified of price drops</p>
            </div>
            
            <div className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Easy Access</h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center">Quick access to saved items</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-5 sm:mt-2">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 fill-pink-500" />
            My Wishlist ({items.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => {
            const mrp = item.price ? Math.round(item.price * 1.15) : 0
            const discount = mrp > 0 ? Math.round(((mrp - item.price) / mrp) * 100) : 0
            
            return (
              <div key={item.id} className="bg-white rounded-sm transition-shadow duration-200 flex flex-col relative hover:shadow-lg">
                {discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                    {discount}% OFF
                  </div>
                )}
                <button
                  onClick={() => {
                    removeFromWishlist(item.id)
                    toast.success('Removed from wishlist')
                  }}
                  className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4 text-red-500"/>
                </button>
                
                <Link href={`/products/${item.slug}`} className="block">
                  <div className="relative aspect-[4/3] bg-white p-8 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={225}
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                  </div>
                </Link>
                
                <div className="p-4 flex-1 flex flex-col">
                  <Link href={`/products/${item.slug}`} className="mb-2">
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 leading-snug">
                      {item.name}
                    </h3>
                  </Link>
                  <Link href={`/products/${item.slug}`} className="flex-1">
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      High-quality product with premium features and excellent performance
                    </p>
                  </Link>
                  
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{(item.price || 0).toLocaleString()}
                      </span>
                      {discount > 0 && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{mrp.toLocaleString()}
                          </span>
                          <span className="text-sm text-green-600 font-semibold">
                            {discount}% off
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-green-600 font-medium">★★★★☆</span>
                      <span className="text-xs text-gray-500">(4.2)</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          slug: item.slug,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        })
                        toast.success('', { description: `${item.name} has been added to your cart.` })
                      }}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 text-sm transition-all shadow-md"
                    >
                      ADD TO CART
                    </button>
                    <button
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          slug: item.slug,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        })
                        router.push('/cart')
                      }}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-sm transition-all shadow-md"
                    >
                      BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
