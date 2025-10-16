"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const categoryImages: { [key: string]: string } = {
  laptops: "/category/laptop.jpeg",
  monitors: "/category/monitor.jpeg",
  keyboards: "/category/keyboard.jpeg",
  mouse: "/category/mouse.jpeg",
  headphones: "/category/headphones.jpeg",
  accessories: "/category/accessories.png",
  storage: "/category/storage.jpeg",
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/products");
        const products = await response.json();
        
        const categoryMap = new Map();
        products.forEach((product: any) => {
          const cat = product.category?.toLowerCase();
          if (cat) {
            if (!categoryMap.has(cat)) {
              categoryMap.set(cat, {
                name: product.category,
                slug: cat,
                count: 0,
              });
            }
            categoryMap.set(cat, {
              ...categoryMap.get(cat),
              count: categoryMap.get(cat).count + 1,
            });
          }
        });
        
        setCategories(Array.from(categoryMap.values()));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Shop by Category</h1>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border rounded-lg p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow text-center">
                  <img src={categoryImages[cat.slug] || "/placeholder.svg"} alt={cat.name} className="w-16 h-16 object-contain mx-auto mb-3" />
                  <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}
