import { Metadata } from "next";
import { Target, Shield, Truck, Users, Award, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our company and mission",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Electronic Web</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted destination for quality electronics and cutting-edge technology. 
            We&apos;re committed to making the latest innovations accessible to everyone.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600">Products</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded in 2019 with a simple vision: to make cutting-edge technology accessible 
                to everyone. What started as a small electronics store has grown into a trusted 
                online destination for tech enthusiasts worldwide.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We carefully curate our product selection, partnering with leading brands to 
                ensure quality and value. Our team of tech experts tests every product to meet 
                our high standards before it reaches your doorstep.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we&apos;re proud to serve thousands of customers globally, offering everything 
                from laptops and smartphones to smart home devices and gaming accessories.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
              <div className="text-center">
                <Globe className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Reach</h3>
                <p className="text-gray-600">Serving customers in over 50 countries worldwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To democratize technology by providing cutting-edge electronics with unmatched 
                quality, competitive pricing, and exceptional customer service.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Promise</h3>
              <p className="text-gray-600 leading-relaxed">
                Every product undergoes rigorous testing and quality checks. We stand behind 
                our products with comprehensive warranties and hassle-free returns.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fast & Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                Lightning-fast shipping with secure packaging ensures your products arrive 
                safely and quickly. Track your order every step of the way.
              </p>
            </div>
          </div>
        </div>

        {/* Sustainability & Environment */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Environmental Commitment</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Eco-Friendly Packaging</h3>
              </div>
              <p className="text-gray-600">
                We use 100% recyclable packaging materials and minimize waste in our shipping process.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">♻️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">E-Waste Recycling</h3>
              </div>
              <p className="text-gray-600">
                Partner with certified recycling centers to responsibly dispose of electronic waste.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Carbon Neutral Shipping</h3>
              </div>
              <p className="text-gray-600">
                Offset carbon emissions from shipping through renewable energy investments.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Global Impact</h3>
              </div>
              <p className="text-gray-600">
                Supporting environmental initiatives and clean technology development worldwide.
              </p>
            </div>
          </div>
          
          <div className="text-center bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Green Goals for 2025</h3>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">50%</div>
                <div className="text-sm text-gray-600">Packaging Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600">Renewable Energy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1M+</div>
                <div className="text-sm text-gray-600">Trees Planted</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}