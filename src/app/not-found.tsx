'use client'

import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => router.push('/')}
            className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors"
          >
            🏠 Home
          </button>
          <button 
            onClick={() => router.back()}
            className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
}