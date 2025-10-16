'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { User, Package, MapPin, Phone, Mail, Calendar, Edit2, X, Loader2, LogOut, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [editingPhone, setEditingPhone] = useState(false)
  const [editingAddress, setEditingAddress] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const savePhone = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const data = await response.json()
      if (response.ok) {
        setEditingPhone(false)
        toast.success('Phone number updated successfully')
      } else {
        console.error('API Error:', data)
        toast.error(data.error || 'Failed to update phone number')
      }
    } catch (error) {
      console.error('Network Error:', error)
      toast.error('Failed to update phone number')
    }
  }

  const saveAddress = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
      const data = await response.json()
      if (response.ok) {
        setEditingAddress(false)
        toast.success('Address updated successfully')
      } else {
        console.error('API Error:', data)
        toast.error(data.error || 'Failed to update address')
      }
    } catch (error) {
      console.error('Network Error:', error)
      toast.error('Failed to update address')
    }
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin?callbackUrl=/profile')
      return
    }
    
    const fetchProfile = async () => {
      setLoadingProfile(true)
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setPhone(data.phone || '')
          setAddress(data.address || '')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoadingProfile(false)
      }
    }
    
    const fetchOrders = async () => {
      setLoadingOrders(true)
      try {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoadingOrders(false)
      }
    }
    
    fetchProfile()
    fetchOrders()
  }, [session, status, router])

  if (status === 'loading') {
    return <ProfileSkeleton />
  }

  if (!session) return null

  const profileFields = [
    {
      label: 'Full Name',
      value: session.user?.name || 'Not provided',
      editable: false as const
    },
    {
      label: 'Email',
      value: (
        <div className="flex flex-wrap items-center gap-2">
          <span>{session.user?.email}</span>
          {session.user?.emailVerified ? (
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Verified</span>
          ) : (
            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">Not Verified</span>
          )}
        </div>
      ),
      editable: false as const
    },
    {
      label: 'Phone',
      value: loadingProfile ? <span className="text-gray-500">loading...</span> : (phone || 'Not provided'),
      editable: true as const,
      editing: editingPhone,
      setEditing: setEditingPhone,
      inputValue: phone,
      setInputValue: (value: string) => setPhone(value.replace(/\D/g, '')),
      save: savePhone,
      type: 'tel' as const,
      placeholder: 'Enter phone number'
    },
    {
      label: 'Address',
      value: loadingProfile ? <span className="text-gray-500">loading...</span> : (address || 'Not provided'),
      editable: true as const,
      editing: editingAddress,
      setEditing: setEditingAddress,
      inputValue: address,
      setInputValue: setAddress,
      save: saveAddress,
      type: 'textarea' as const,
      placeholder: 'Enter your address'
    }
  ]



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Profile Header */}
        <div className="bg-white sm:rounded-lg sm:shadow-sm sm:border border-gray-200 p-3 sm:p-6 mb-3 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <div className="relative">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={64}
                  height={64}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">{session.user?.name || 'User'}</h1>
              <p className="text-xs sm:text-base text-gray-600 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mb-1 sm:mb-2 truncate">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{session.user?.email}</span>
              </p>
              <p className="text-[10px] sm:text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                Member since {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2 justify-center w-full sm:w-auto">
              <Link href="/orders" className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Orders</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white sm:rounded-lg sm:shadow-sm sm:border border-gray-200 p-3 sm:p-6">
            <h2 className="text-sm sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">Personal Information</h2>
            <div className="space-y-3 sm:space-y-4">
              {profileFields.map((field) => (
                <div key={field.label}>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">{field.label}</label>
                  {!field.editable ? (
                    <div className="text-xs sm:text-base text-gray-900 mt-1">{field.value}</div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      {field.editing ? (
                        <>
                          {field.type === 'textarea' ? (
                            <textarea
                              value={field.inputValue}
                              onChange={(e) => field.setInputValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), field.save())}
                              className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm resize-none"
                              placeholder={field.placeholder}
                              rows={2}
                            />
                          ) : (
                            <input
                              type={field.type}
                              value={field.inputValue}
                              onChange={(e) => field.setInputValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && field.save()}
                              className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                              placeholder={field.placeholder}
                            />
                          )}
                          <button onClick={field.save} className="px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded-md hover:bg-blue-700">
                            Save
                          </button>
                          <button onClick={() => field.setEditing(false)} className="text-gray-500 hover:text-gray-700">
                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-xs sm:text-base text-gray-900 flex-1">{field.value}</p>
                          {field.editable && !loadingProfile && (
                            <button onClick={() => field.setEditing(true)} className="text-blue-600 hover:text-blue-700">
                              <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white sm:rounded-lg sm:shadow-sm sm:border border-gray-200 p-3 sm:p-6">
            <div className='flex justify-between items-center mb-3 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200'>
              <h2 className="text-sm sm:text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link href='/orders' className='text-[10px] sm:text-sm font-medium text-blue-600 hover:text-blue-700'>View All</Link>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {loadingOrders ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                </div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-2.5 sm:p-4 hover:bg-gray-50 transition-all">
                    <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-base font-medium text-gray-900 truncate">Order #{order.id.slice(-8)}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-xs sm:text-base font-semibold text-gray-900">₹{order.total}</p>
                        <span className={`text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap ${
                          order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'out-for-delivery' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status === 'out-for-delivery' ? 'Out For Delivery' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                  </div>
                  <p className="text-xs sm:text-base text-gray-500 font-medium">No orders yet</p>
                  <p className="text-[10px] sm:text-sm text-gray-400 mt-1">Start shopping to see your orders here</p>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}  