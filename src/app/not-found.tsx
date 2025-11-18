'use client'

import { useRouter } from 'next/navigation'
import { Home, ArrowLeft, Search, ShoppingBag, Zap } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen pt-20 md:pt-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="text-center relative z-10 max-w-2xl mx-auto">
        {/* Animated 404 */}
        <div className="mb-8 relative">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-blue-100 animate-ping opacity-20">
            404
          </div>
        </div>

        {/* Search Icon with Animation */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Search className="w-16 h-16 text-gray-400 animate-spin" style={{animationDuration: '3s'}} />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for seems to have wandered off into the digital void. 
            Let&apos;s get you back to shopping!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => router.push('/')}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-3 min-w-[200px] justify-center"
          >
            <Home className="w-5 h-5 group-hover:animate-bounce" />
            Back to Home
          </button>
          
          <button 
            onClick={() => router.back()}
            className="group border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-3 min-w-[200px] justify-center"
          >
            <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Or explore these popular sections:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => router.push('/category/laptops')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Laptops
            </button>
            <button 
              onClick={() => router.push('/cart')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Cart
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}