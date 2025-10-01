'use client'

import { useSession } from 'next-auth/react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Package, ShoppingCart, Users, BarChart3, Settings, Menu, LogOut } from 'lucide-react'
import Loading from '../loading'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/admin/orders'),
          fetch('/api/admin/users')
        ])
        
        const products = await productsRes.json()
        const ordersData = await ordersRes.json()
        const usersData = await usersRes.json()
        
        const totalRevenue = ordersData.orders?.reduce((sum: number, order: any) => sum + order.total, 0) || 0
        
        setStats({
          products: products?.length || 0,
          orders: ordersData.orders?.length || 0,
          users: Array.isArray(usersData) ? usersData.length : 0,
          revenue: totalRevenue
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (session) {
      fetchStats()
    }
  }, [session])

  if (status === 'loading' || loading) {
    return <Loading />
  }

  if (!session || (session.user?.role !== 'admin' && session.user?.email !== 'admin@electronic.com')) {
    notFound()
  }

  const cards = [
    {
      title: 'Products',
      count: stats.products.toString(),
      description: 'Total products in inventory',
      icon: Package,
      href: '/admin/products',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Orders',
      count: stats.orders.toString(),
      description: 'Total orders received',
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Users',
      count: stats.users.toString(),
      description: 'Registered users',
      icon: Users,
      href: '/admin/users',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Revenue',
      count: `₹${(stats.revenue / 1000).toFixed(1)}K`,
      description: 'Total revenue earned',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Settings',
      count: '12',
      description: 'Configuration options',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-gray-500 to-gray-700'
    }
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session.user?.name} 👋</p>
          </div>
        </div>

        {/* Stat Cards */}
       

        {/* Analytics Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Overview</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">
            📊 Chart Placeholder (use Recharts / Chart.js)
          </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {cards.map((card, index) => {
            const Icon = card.icon
            return (
              <Link key={index} href={card.href}>
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className='flex justify-between text-blue-600'>
                  <div className={`h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-to-r ${card.color} text-white shadow-md mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                    <span className="hover:underline">View All</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{card.count}</p>
                  <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
