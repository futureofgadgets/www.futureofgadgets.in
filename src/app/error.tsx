'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Oops!</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          We encountered an unexpected error. Please try again or go back to the homepage.
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            🔄 Try Again
          </button>
          <button 
            onClick={() => router.push('/')}
            className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors"
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  )
}