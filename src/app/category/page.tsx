"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CategoryPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();
        
        const allSections = [];
        
        if (data.categorySections) {
          allSections.push(...data.categorySections);
        }
        
        setSections(allSections);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Shop by Category</h1>
        
        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="bg-gray-100 rounded-lg p-4">
                      <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : sections.length > 0 ? (
          <div className="space-y-10">
            {sections.map((section, idx) => (
              <div key={idx} className="pb-2">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">{section.title}</h2>
                {section.categories && section.categories.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {section.categories.map((cat: any) => (
                      <Link key={cat.slug} href={`/category/${cat.heading || section.title.toLowerCase()}?filter=${cat.slug}`}>
                        <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition-all hover:scale-105 text-center group">
                          <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                            <Image 
                              src={cat.image || "/placeholder.svg"} 
                              alt={cat.name} 
                              width={64}
                              height={64}
                              className="object-contain group-hover:scale-110 transition-transform" 
                            />
                          </div>
                          <h3 className="font-semibold text-sm text-gray-900 truncate">{cat.name}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-left">No items available</p>
                )}
              </div>
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
