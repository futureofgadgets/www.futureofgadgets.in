'use client'
import React, { useState, useEffect } from 'react'
import ProductCard from '../product-card'
import Link from 'next/link';
import { toast } from 'sonner';
import { addToCart } from '@/lib/cart';
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  coverImage: string;
  images: string[];
  price: number;
  mrp?: number;
  quantity: number;
};

export default function NewArrivals(){
  const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.quantity === 0) {
      toast.error("Out of Stock", {
        description: "This product is currently unavailable."
      });
      return;
    }
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.coverImage
    });
    setProducts(products.map(p => 
      p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
    ));
    toast.success("", {
      description: `${product.name} has been added to your cart.`
    });
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.quantity === 0) {
      toast.error("Out of Stock", {
        description: "This product is currently unavailable."
      });
      return;
    }
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.coverImage
    });
    router.push("/cart");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const cart = JSON.parse(localStorage.getItem("v0_cart") || "[]");
        const mappedProducts = data.map((p: any) => {
          const cartQty = cart.reduce((sum: number, item: any) => 
            item.id === p.id ? sum + (item.qty || 1) : sum, 0
          );
          return {
            id: p.id,
            slug: p.slug || p.name.toLowerCase().replace(/\s+/g, "-"),
            name: p.name || p.title,
            type: p.category || p.type,
            description: p.description,
            coverImage: p.frontImage,
            images: p.images || [p.frontImage],
            price: p.price,
            mrp: p.mrp,
            quantity: Math.max(0, (p.quantity || p.stock) - cartQty)
          };
        });
        setProducts(mappedProducts.slice(0, 10));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-6 sm:py-10">
      <div className="mx-auto max-w-[1440px] sm:px-6 lg:px-11">
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-3 sm:px-0">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">New Arrivals</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">Fresh products just In</p>
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
              <ProductCard key={product.id} product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
