import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const { amount, currency = "INR", receipt } = await request.json()
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }
    
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 })
    }
    
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes: {
          userId: session.user?.email || 'guest'
        }
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      console.error('Razorpay error:', error)
      return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 })
    }
    
    const order = await response.json()
    
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId
    })
  } catch (error) {
    console.error('Payment order creation error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
