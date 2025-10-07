'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Mail, X } from 'lucide-react'

export function EmailVerificationBanner() {
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  if (!session?.user || session.user.emailVerified || !isVisible) {
    return null
  }

  const handleResendVerification = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email })
      })

      if (response.ok) {
        toast.success('Verification email sent! Check your inbox.')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to send verification email')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Email verification required
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Please verify your email address to access all features.
            </p>
            <Button
              onClick={handleResendVerification}
              disabled={isLoading}
              size="sm"
              className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isLoading ? 'Sending...' : 'Resend verification email'}
            </Button>
          </div>
        </div>
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="sm"
          className="text-yellow-600 hover:text-yellow-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}