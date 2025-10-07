'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Package, Truck, CheckCircle, Clock, Eye, Download } from 'lucide-react'
import { OrderProgress } from '@/components/order-progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Loading from '../loading'

type Order = {
  id: string
  items: {
    productId: string
    name: string
    price: number
    qty: number
    image?: string
  }[]
  total: number
  status: string
  statusHistory?: Array<{
    status: string
    timestamp: string
    note?: string
  }>
  address: {
    fullName: string
    phone: string
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
  }
  paymentMethod: string
  deliveryDate: string
  billUrl?: string
  createdAt: string
  updatedAt: string
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [showBillDialog, setShowBillDialog] = useState(false)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin?callbackUrl=/orders')
      return
    }
    
    const fetchOrders = async () => {
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products')
        ])
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          setOrders(ordersData.orders)
        }
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setProducts(productsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [session, status, router])

  if (status === 'loading' || loading) {
    return (
          <Loading/>
    )
  }

  if (!session) return null



  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'out-for-delivery':
        return <Truck className="h-5 w-5 text-orange-600" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      default:
        return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'out-for-delivery':
        return 'bg-orange-100 text-orange-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order {order.id.slice(-8)}</h3>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'out-for-delivery' ? 'Out For Delivery' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Items Ordered</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name} × {item.qty}</span>
                          <span className="font-medium">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Delivery Details</h4>
                    <p className="text-sm text-gray-600 mb-1">{order.address.fullName}</p>
                    <p className="text-sm text-gray-600 mb-1">{order.address.line1}</p>
                    <p className="text-sm text-gray-600 mb-2">{order.address.city}, {order.address.state} - {order.address.zip}</p>
                    <p className="text-sm text-gray-600">Payment: {order.paymentMethod.toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t ">
                  <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogTrigger asChild>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto p-0">
                      <DialogHeader className="sr-only">
                        <DialogTitle>Order Details</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="bg-gray-50">
                          
                          <div className="grid lg:grid-cols-3 gap-6 p-6">
                            {/* Left Column - Order Items */}
                            <div className="lg:col-span-2">
                              <div className="bg-white rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                  <h2 className="text-xl font-medium">Order Items {selectedOrder.items.length} items</h2>
                                  <button className="text-blue-600 text-sm font-medium">View all</button>
                                </div>
                                
                                {/* Product Images Grid */}
                                <div className="flex gap-3 mb-6">
                                  {selectedOrder.items.slice(0, 4).map((item, idx) => {
                                    const product = products.find(p => p.id === item.productId)
                                    const imageUrl = product?.frontImage || product?.images?.[0] || '/placeholder-product.jpg'
                                    return (
                                      <div key={idx} className="relative">
                                        <img 
                                          src={imageUrl} 
                                          alt={item.name}
                                          className="w-20 h-20 object-cover rounded border"
                                          onError={(e) => {
                                            e.currentTarget.src = '/placeholder-product.jpg'
                                          }}
                                        />
                                        {item.qty > 1 && (
                                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {item.qty}
                                          </span>
                                        )}
                                      </div>
                                    )
                                  })}
                                  {selectedOrder.items.length > 4 && (
                                    <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center text-gray-500 text-sm">
                                      +{selectedOrder.items.length - 4}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Price and Offer */}
                                <div className="flex items-center gap-3 mb-6">
                                  <span className="text-2xl font-bold">₹{selectedOrder.total}</span>
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">1 offer</span>
                                </div>
                                
                                {/* Order Status */}
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="font-medium">Order Confirmed, {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                  </div>
                                  {selectedOrder.status === 'out-for-delivery' && (
                                    <div className="flex items-center gap-3">
                                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                      <span className="font-medium">Out For Delivery, {new Date(selectedOrder.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                  )}
                                  {selectedOrder.status === 'delivered' && (
                                    <div className="flex items-center gap-3">
                                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                      <span className="font-medium">Delivered, {new Date(selectedOrder.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                  )}
                                  <button 
                                    onClick={() => setShowTrackingModal(true)}
                                    className="text-blue-600 text-sm font-medium flex items-center gap-1"
                                  >
                                    See All Updates <span>›</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Right Column - Details */}
                            <div className="space-y-6">
                              {/* Delivery Details */}
                              <div className="bg-white rounded-lg p-6">
                                <h3 className="font-bold text-lg mb-4">Delivery details</h3>
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-0.5">
                                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="font-medium">Home</p>
                                      <p className="text-sm text-gray-600">{selectedOrder.address.line1}, {selectedOrder.address.city}, {selectedOrder.address.state}, ...</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-0.5">
                                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="font-medium">{selectedOrder.address.fullName}</p>
                                      <p className="text-sm text-gray-600">{selectedOrder.address.phone}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Price Details */}
                              <div className="bg-white rounded-lg p-6">
                                <h3 className="font-bold text-lg mb-4">Price details</h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span>Listing price</span>
                                    <span>₹{Math.round(selectedOrder.total * 1.4).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                      Selling price 
                                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                    <span>₹{selectedOrder.total}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                      Other discount 
                                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                    <span className="text-green-600">-₹{Math.round(selectedOrder.total * 0.05)}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                      Total fees 
                                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                    <span>₹12</span>
                                  </div>
                                  <hr className="border-dashed" />
                                  <div className="flex justify-between items-center font-bold text-lg">
                                    <span>Total amount</span>
                                    <span className="flex items-center gap-2">
                                      ₹{selectedOrder.total}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Paid by</span>
                                    <span>{selectedOrder.paymentMethod === 'cod' ? 'Cash On Delivery' : selectedOrder.paymentMethod.toUpperCase()}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Offers Earned */}
                              <div className="bg-white rounded-lg p-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">🏆</span>
                                    <span className="font-medium">Offers earned</span>
                                  </div>
                                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {/* Order Tracking Modal */}
                  <Dialog open={showTrackingModal} onOpenChange={setShowTrackingModal}>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Order Tracking Details</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="py-4">
                          <div className="relative">
                            {/* Timeline - stops before delivered item */}
                            <div className="absolute left-3 top-0 w-0.5 bg-green-500" style={{
                              height: selectedOrder.status === 'delivered' ? 'calc(100% - 50px)' : '100%'
                            }}></div>
                            
                            <div className="space-y-8">
                              {/* Order Confirmed */}
                              <div className="relative flex items-start">
                                <div className="absolute left-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <div className="ml-10">
                                  <h3 className="text-lg font-semibold text-black mb-1">
                                    Order Confirmed <span className="text-gray-500 font-normal">{new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })}</span>
                                  </h3>
                                  <div className="space-y-3 text-sm">
                                    <div>
                                      <p className="text-black font-medium">Your Order has been placed.</p>
                                      <p className="text-gray-500">{new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })} - {new Date(selectedOrder.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}</p>
                                    </div>
                                    {(selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'out-for-delivery' || selectedOrder.status === 'delivered') && (
                                      <div>
                                        <p className="text-black font-medium">Seller has processed your order.</p>
                                        <p className="text-gray-500">{new Date(selectedOrder.statusHistory?.find(h => h.status === 'processing')?.timestamp || selectedOrder.updatedAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })} - {new Date(selectedOrder.statusHistory?.find(h => h.status === 'processing')?.timestamp || selectedOrder.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}</p>
                                      </div>
                                    )}
                                    {(selectedOrder.status === 'shipped' || selectedOrder.status === 'out-for-delivery' || selectedOrder.status === 'delivered') && (
                                      <div>
                                        <p className="text-black font-medium">Your item has been picked up by courier partner.</p>
                                        <p className="text-gray-500">{new Date(selectedOrder.statusHistory?.find(h => h.status === 'shipped')?.timestamp || selectedOrder.updatedAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })} - {new Date(selectedOrder.statusHistory?.find(h => h.status === 'shipped')?.timestamp || selectedOrder.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Shipped */}
                              {(selectedOrder.status === 'shipped' || selectedOrder.status === 'out-for-delivery' || selectedOrder.status === 'delivered') && (
                                <div className="relative flex items-start">
                                  <div className="absolute left-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                  <div className="ml-10">
                                    <h3 className="text-lg font-semibold text-black mb-1">
                                      Shipped <span className="text-gray-500 font-normal">{new Date(selectedOrder.statusHistory?.find(h => h.status === 'shipped')?.timestamp || selectedOrder.updatedAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })}</span>
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                      <div>
                                        <p className="text-black font-medium">Your item has been shipped.</p>
                                        <p className="text-gray-500">{new Date(selectedOrder.statusHistory?.find(h => h.status === 'shipped')?.timestamp || selectedOrder.updatedAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })} - {new Date(selectedOrder.statusHistory?.find(h => h.status === 'shipped')?.timestamp || selectedOrder.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}</p>
                                      </div>
                                      <div>
                                        <p className="text-black font-medium">Your item has been received in the hub nearest to you</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Out For Delivery */}
                              {(selectedOrder.status === 'out-for-delivery' || selectedOrder.status === 'delivered') && (
                                <div className="relative flex items-start">
                                  <div className="absolute left-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                  <div className="ml-10">
                                    <h3 className="text-lg font-semibold text-black mb-1">
                                      Out For Delivery <span className="text-gray-500 font-normal">{new Date(selectedOrder.statusHistory?.find(h => h.status === 'out-for-delivery')?.timestamp || selectedOrder.updatedAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })}</span>
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                      <div>
                                        <p className="text-black font-medium">Your item is out for delivery</p>
                                        <p className="text-gray-500">{new Date(selectedOrder.statusHistory?.find(h => h.status === 'out-for-delivery')?.timestamp || selectedOrder.updatedAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })} - {new Date(selectedOrder.statusHistory?.find(h => h.status === 'out-for-delivery')?.timestamp || selectedOrder.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Delivered */}
                              {selectedOrder.status === 'delivered' && (
                                <div className="relative flex items-start">
                                  <div className="absolute left-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                  <div className="ml-10">
                                    <h3 className="text-lg font-semibold text-black mb-1">
                                      Delivered <span className="text-gray-500 font-normal">{new Date(selectedOrder.updatedAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })}</span>
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                      <div>
                                        <p className="text-black font-medium">Your item has been delivered</p>
                                        <p className="text-gray-500">{new Date(selectedOrder.updatedAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })} - {new Date(selectedOrder.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {order.status === 'delivered' && order.billUrl && (
                    <button 
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = order.billUrl!
                        link.download = `bill-${order.id.slice(-8)}.jpg`
                        link.target = '_blank'
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
                    >
                      <Download className="h-4 w-4" />
                      Download Bill
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">Start shopping to see your orders here</p>
          </div>
        )}
      </div>
    </div>
  )
}