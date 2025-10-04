"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Filter, Grid3X3, List } from "lucide-react";
import { CategoryBar } from "@/components/categorybar";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(slug);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fakeProducts = {
    laptops: [
      {
        name: 'MacBook Pro 16"',
        price: "$2,399",
        originalPrice: "$2,599",
        rating: 4.8,
        reviews: 1247,
        image: "💻",
        badge: "Best Seller",
      },
      {
        name: "Dell XPS 13 Plus",
        price: "$1,299",
        originalPrice: "$1,499",
        rating: 4.6,
        reviews: 892,
        image: "💻",
        badge: "New",
      },
      {
        name: "HP Spectre x360",
        price: "$1,199",
        originalPrice: null,
        rating: 4.5,
        reviews: 634,
        image: "💻",
        badge: null,
      },
      {
        name: "Lenovo ThinkPad X1",
        price: "$1,899",
        originalPrice: "$2,099",
        rating: 4.7,
        reviews: 456,
        image: "💻",
        badge: "Sale",
      },
    ],
    "laptop-accessories": [
      {
        name: "Laptop Stand Aluminum",
        price: "$49",
        originalPrice: "$69",
        rating: 4.7,
        reviews: 892,
        image: "🖥️",
        badge: "Best Seller",
      },
      {
        name: "Laptop Cooling Pad",
        price: "$35",
        originalPrice: null,
        rating: 4.5,
        reviews: 634,
        image: "❄️",
        badge: "New",
      },
      {
        name: 'Laptop Sleeve 15.6"',
        price: "$25",
        originalPrice: "$35",
        rating: 4.6,
        reviews: 456,
        image: "👜",
        badge: "Sale",
      },
      {
        name: "USB-C Hub 7-in-1",
        price: "$79",
        originalPrice: null,
        rating: 4.8,
        reviews: 723,
        image: "🔌",
        badge: null,
      },
    ],
    chargers: [
      {
        name: "MacBook Pro Charger 96W",
        price: "$79",
        originalPrice: "$99",
        rating: 4.8,
        reviews: 1234,
        image: "🔌",
        badge: "Best Seller",
      },
      {
        name: "USB-C Fast Charger 65W",
        price: "$39",
        originalPrice: null,
        rating: 4.6,
        reviews: 892,
        image: "⚡",
        badge: "New",
      },
      {
        name: "Wireless Charging Pad",
        price: "$29",
        originalPrice: "$39",
        rating: 4.5,
        reviews: 567,
        image: "📱",
        badge: "Sale",
      },
      {
        name: "Power Bank 20000mAh",
        price: "$59",
        originalPrice: null,
        rating: 4.7,
        reviews: 1456,
        image: "🔋",
        badge: null,
      },
    ],
    keyboards: [
      {
        name: "Mechanical Keyboard RGB",
        price: "$129",
        originalPrice: "$149",
        rating: 4.8,
        reviews: 2341,
        image: "⌨️",
        badge: "Best Seller",
      },
      {
        name: "Wireless Compact Keyboard",
        price: "$79",
        originalPrice: null,
        rating: 4.6,
        reviews: 1234,
        image: "⌨️",
        badge: "New",
      },
      {
        name: "Gaming Keyboard Backlit",
        price: "$99",
        originalPrice: "$119",
        rating: 4.7,
        reviews: 892,
        image: "⌨️",
        badge: "Sale",
      },
      {
        name: "Ergonomic Split Keyboard",
        price: "$159",
        originalPrice: null,
        rating: 4.5,
        reviews: 456,
        image: "⌨️",
        badge: null,
      },
    ],
    mouse: [
      {
        name: "Wireless Gaming Mouse",
        price: "$89",
        originalPrice: "$109",
        rating: 4.8,
        reviews: 1876,
        image: "🖱️",
        badge: "Best Seller",
      },
      {
        name: "Ergonomic Vertical Mouse",
        price: "$59",
        originalPrice: null,
        rating: 4.6,
        reviews: 723,
        image: "🖱️",
        badge: "New",
      },
      {
        name: "Bluetooth Silent Mouse",
        price: "$39",
        originalPrice: "$49",
        rating: 4.5,
        reviews: 567,
        image: "🖱️",
        badge: "Sale",
      },
      {
        name: "Trackball Mouse Pro",
        price: "$129",
        originalPrice: null,
        rating: 4.7,
        reviews: 892,
        image: "🖱️",
        badge: null,
      },
    ],
  };

  const categories = [
    {
      name: "Laptops",
      slug: "laptops",
      icon: "💻",
      count: "2,341 items",
      description: "High-performance laptops",
    },
    {
      name: "Laptop Accessories",
      slug: "laptop-accessories",
      icon: "🎒",
      count: "1,876 items",
      description: "Stands, sleeves & hubs",
    },
    {
      name: "Chargers",
      slug: "chargers",
      icon: "🔌",
      count: "1,234 items",
      description: "Power adapters & banks",
    },
    {
      name: "Keyboards",
      slug: "keyboards",
      icon: "⌨️",
      count: "987 items",
      description: "Mechanical & wireless",
    },
    {
      name: "Mouse",
      slug: "mouse",
      icon: "🖱️",
      count: "756 items",
      description: "Gaming & ergonomic",
    },
    {
      name: "Monitors",
      slug: "monitors",
      icon: "🖥️",
      count: "543 items",
      description: "Professional displays",
    },
  ];

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
                      {
                        categories.find((c) => c.slug === selectedCategory)
                          ?.count
                      }{" "}
                      •{" "}
                      {
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
                {fakeProducts[selectedCategory as keyof typeof fakeProducts]
                  ?.length > 0 ? (
                  <div
                    className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {fakeProducts[
                      selectedCategory as keyof typeof fakeProducts
                    ]?.map((product, idx) => (
                      <Card
                        key={idx}
                        className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
                      >
                        <CardContent className="p-6">
                          {product.badge && (
                            <Badge
                              className={`mb-3 ${getBadgeColor(product.badge)}`}
                            >
                              {product.badge}
                            </Badge>
                          )}
                          <div className="text-center mb-4">
                            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                              {product.image}
                            </div>
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-center gap-1 mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 ml-1">
                                ({product.reviews})
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <span className="text-2xl font-bold text-green-600">
                                {product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                  {product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
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
