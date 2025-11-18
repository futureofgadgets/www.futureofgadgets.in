"use client";

import { useEffect, useState } from "react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/product-card";

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

const ProductSkeleton = () => (
  <div className="bg-gray-50 border sm:rounded-sm transition-shadow duration-200 flex flex-col sm:mt-1 relative overflow-hidden">
    {/* Image skeleton - matches aspect-[4/3] */}
    <div className="relative aspect-[4/3] bg-white p-8 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <div className="w-full h-full bg-gray-200 shimmer rounded"></div>
      </div>
    </div>
    
    {/* Content skeleton - matches p-4 structure */}
    <div className="p-4 flex-1 flex flex-col">
      {/* Title skeleton - matches h3 with line-clamp-2 */}
      <div className="flex justify-between items-start sm:mb-2">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 shimmer rounded mb-1"></div>
          <div className="h-4 bg-gray-200 shimmer rounded w-3/4"></div>
        </div>
        <div className="ml-2 w-6 h-6 bg-gray-200 shimmer rounded-full"></div>
      </div>
      
      {/* Description skeleton - matches p with line-clamp-2 */}
      <div className="mb-2">
        <div className="h-3 bg-gray-200 shimmer rounded mb-1"></div>
        <div className="h-3 bg-gray-200 shimmer rounded w-5/6"></div>
      </div>
      
      {/* Price section skeleton */}
      <div className="mb-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 items-baseline sm:gap-2 sm:mb-1">
          <div className="h-6 bg-gray-200 shimmer rounded w-20"></div>
          <div className="flex space-x-2">
            <div className="h-3 bg-gray-200 shimmer rounded w-12"></div>
            <div className="h-3 bg-gray-200 shimmer rounded w-10"></div>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="h-3 bg-gray-200 shimmer rounded w-16"></div>
          <div className="h-3 bg-gray-200 shimmer rounded w-8"></div>
        </div>
      </div>
      
      {/* Buy now link skeleton */}
      <div className="h-4 bg-gray-200 shimmer rounded w-16"></div>
    </div>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        setProducts(mappedProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 sm:py-8 pb-2 mt-5 sm:mt-2">  

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <div className="text-center py-12 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Check back later for new arrivals!</p>
          </div>
        )}
      </div>
    </div>
  );
}
