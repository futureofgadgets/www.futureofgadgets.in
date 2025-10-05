"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Filter } from "lucide-react";
import { CategoryBar } from "@/components/categorybar";
import Link from "next/link";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(slug);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setAllProducts(data);
        
        // Filter products by category
        if (selectedCategory) {
          const filtered = data.filter((product: any) => 
            product.category?.toLowerCase() === selectedCategory.toLowerCase()
          );
          setProducts(filtered);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory]);

  // Generate categories from products
  const categories = [
    { name: "Laptops", slug: "laptops", icon: "💻", description: "High-performance laptops" },
    { name: "Desktops", slug: "desktops", icon: "🖥️", description: "Desktop computers" },
    { name: "Monitors", slug: "monitors", icon: "📺", description: "Professional displays" },
    { name: "Keyboards", slug: "keyboards", icon: "⌨️", description: "Mechanical & wireless" },
    { name: "Mouse", slug: "mouse", icon: "🖱️", description: "Gaming & ergonomic" },
    { name: "Headphones", slug: "headphones", icon: "🎧", description: "Audio devices" },
    { name: "Speakers", slug: "speakers", icon: "🔊", description: "Sound systems" },
    { name: "Webcams", slug: "webcams", icon: "📹", description: "Video cameras" },
    { name: "Storage", slug: "storage", icon: "💾", description: "Hard drives & SSDs" },
    { name: "RAM", slug: "ram", icon: "🧠", description: "Memory modules" },
  ].map(cat => ({
    ...cat,
    count: `${allProducts.filter(p => p.category?.toLowerCase() === cat.slug.toLowerCase()).length} items`
  }));

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case "Best Seller":
        return "bg-orange-100 text-orange-800";
      case "New":
        return "bg-green-100 text-green-800";
      case "Sale":
        return "bg-red-100 text-red-800";
      case "Editor's Choice":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full mx-auto py-10 sm:pt-20 md:py-8">
        <div className="flex gap-8">
          <div className="hidden md:block">
            <CategoryBar
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onCategorySelect={setSelectedCategory}
                      isSidebarOpen={isSidebarOpen}
                      onSidebarToggle={setIsSidebarOpen}
                    />
          </div>
          
          {/* Enhanced Main Content */}
          <div className="flex-1 xl:pr-10 px-4 xl:px-0">
            {selectedCategory ? (
              /* Product Listing */
              <div>
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {
                        categories.find((c) => c.slug === selectedCategory)
                          ?.name
                      }
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {products.length} items • {
                        categories.find((c) => c.slug === selectedCategory)
                          ?.description
                      }
                    </p>
                  </div>
                  <div className="sm:hidden">
                    <CategoryBar
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onCategorySelect={setSelectedCategory}
                      isSidebarOpen={isSidebarOpen}
                      onSidebarToggle={setIsSidebarOpen}
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="hidden sm:inline">Filter</span>
                    </Button>
                  </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-48 bg-gray-200 rounded mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug || product.id}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm cursor-pointer">
                          <CardContent className="p-6">
                            <div className="text-center mb-4">
                              <div className="mb-4 overflow-hidden rounded-lg">
                                <img
                                  src={product.frontImage || product.image || '/placeholder.svg'}
                                  alt={product.name}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {product.name}
                              </h3>
                              <div className="flex items-center justify-center gap-1 mb-3">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600 ml-1">
                                  (4.5)
                                </span>
                              </div>
                              <div className="flex items-center justify-center gap-2 mb-4">
                                <span className="text-2xl font-bold text-green-600">
                                  ₹{product.price?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Products in this category have been are currently
                      unavailable or removed.
                    </p>
                    <Button
                      onClick={() => setSelectedCategory(null)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Browse All Categories
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Category Grid */
              <div>
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Shop by Category
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover premium electronics and technology products
                  </p>
                </div>

                {/* Features Section */}
                <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm">
                  <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
                    Why Shop With Us?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl sm:text-2xl">🚚</span>
                      </div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">
                        Fast Delivery
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Free shipping on orders over $50. Same-day delivery
                        available.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl sm:text-2xl">🛡️</span>
                      </div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">
                        Secure Shopping
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Your data is protected with industry-standard
                        encryption.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl sm:text-2xl">💎</span>
                      </div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">
                        Premium Quality
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Only authentic products from trusted brands and
                        manufacturers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
