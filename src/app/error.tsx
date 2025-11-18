'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-6">
      <style>{`
        @keyframes floatY { 0% { transform: translateY(0); } 50% { transform: translateY(-8px);} 100%{transform:translateY(0);} }
        @keyframes shakeX { 0% { transform: translateX(0) } 20% { transform: translateX(-6px) } 40% { transform: translateX(6px) } 60% { transform: translateX(-4px) } 80% { transform: translateX(4px) } 100% { transform: translateX(0) }
        }
        .float { animation: floatY 3s ease-in-out infinite }
        .shake { animation: shakeX 0.6s cubic-bezier(.36,.07,.19,.97) }
      `}</style>

      <main className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-slate-200">
        <div className="md:flex">
          {/* Left: Illustration / Icon */}
          <div className="md:w-1/2 bg-gradient-to-br from-rose-50 via-amber-50 to-indigo-50 p-8 flex items-center justify-center">
            <div className="text-center">
              <div aria-hidden className="mx-auto w-36 h-36 rounded-full bg-gradient-to-tr from-rose-400 to-purple-500 text-white flex items-center justify-center text-5xl shadow-lg float">
                ⚠️
              </div>
              <div className="mt-6 text-sm text-slate-500">Automatic diagnostics collected</div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="md:w-1/2 p-8 md:p-10">
            <div role="alert" aria-live="polite">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Something went wrong</h1>
              <p className="text-slate-600 mb-6">Sorry — an unexpected error occurred. You can try reloading the page, return home, or view more details for debugging.</p>

              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => {
                    // give a tiny shake to indicate retry
                    const btn = document.getElementById('try-btn')
                    if (btn) {
                      btn.classList.remove('shake')
                      // trigger reflow
                      void btn.offsetWidth
                      btn.classList.add('shake')
                    }
                    reset()
                  }}
                  id="try-btn"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-transform active:scale-95"
                >
                  🔄 Try again
                </button>

                <button
                  onClick={() => router.push('/')}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  🏠 Home
                </button>

                <button
                  onClick={() => setShowDetails((s) => !s)}
                  aria-expanded={showDetails}
                  className="ml-auto inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:underline"
                >
                  {showDetails ? 'Hide details' : 'Show details'}
                </button>
              </div>

              {/* Details */}
              {showDetails && (
                <div className="mb-4">
                  <div className="rounded-md bg-slate-50 border border-slate-100 p-3 text-sm text-slate-700 max-h-48 overflow-auto font-mono whitespace-pre-wrap">
                    <div><strong>Message:</strong> {error?.message ?? '—'}</div>
                    {error?.stack && (
                      <pre className="mt-2 text-xs text-slate-600">{error.stack}</pre>
                    )}
                    {error && (error as any).digest && (
                      <div className="mt-2 text-xs text-slate-500">Digest: {(error as any).digest}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-500">
                If this keeps happening, please contact support with the error details.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}