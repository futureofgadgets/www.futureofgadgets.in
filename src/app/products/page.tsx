"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  coverImage: string;
  images: string[];
  price: number;
  quantity: number;
};

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log('Raw API data:', data);
        const mappedProducts = data.map((p: any) => {
          console.log('Product frontImage:', p.frontImage);
          return {
            id: p.id,
            slug: p.slug || p.name.toLowerCase().replace(/\s+/g, "-"),
            name: p.name || p.title,
            type: p.category || p.type,
            description: p.description,
            coverImage: p.frontImage,
            images: p.images || [p.frontImage],
            price: p.price,
            quantity: p.quantity || p.stock
          };
        });
        console.log('Mapped products:', mappedProducts);
        setProducts(mappedProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">  

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                  <Image
                    src={product.coverImage || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.log('Image load error:', product.coverImage);
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  {product.quantity > 0 ? (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      In Stock
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Out of Stock
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {product.type}
                    </span>
                  </div>
                  
                  <h2 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h2>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 ">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-blue-600 font-medium group-hover:text-blue-700">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Check back later for new arrivals!</p>
          </div>
        )}
      </div>
    </div>
  );
}
