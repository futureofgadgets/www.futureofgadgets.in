"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function ElectronicsPage() {



  const categories = [
    {
      name: "Laptops",
      slug: "laptops",
      icon: "💻",

      description: "High-performance laptops",
    },
    {
      name: "Laptop Accessories",
      slug: "laptop-accessories",
      icon: "🎒",

      description: "Stands, sleeves & hubs",
    },
    {
      name: "Chargers",
      slug: "chargers",
      icon: "🔌",

      description: "Power adapters & banks",
    },
    {
      name: "Keyboards",
      slug: "keyboards",
      icon: "⌨️",

      description: "Mechanical & wireless",
    },
    {
      name: "Mouse",
      slug: "mouse",
      icon: "🖱️",

      description: "Gaming & ergonomic",
    },
    {
      name: "Monitors",
      slug: "monitors",
      icon: "🖥️",

      description: "Professional displays",
    },
  ];



  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Shop by Category Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover premium electronics and technology products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer border-0 shadow-sm hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">
                      {category.icon}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why Shop With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Free shipping on orders over $50. Same-day delivery available.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold mb-2">
                Secure Shopping
              </h3>
              <p className="text-gray-600">
                Your data is protected with industry-standard encryption.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-semibold mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                Only authentic products from trusted brands and manufacturers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}