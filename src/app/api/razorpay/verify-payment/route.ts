import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import crypto from "crypto"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 })
    }
    
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    
    if (!keySecret) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 })
    }
    
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex")
    
    const isValid = expectedSignature === razorpay_signature
    
    if (!isValid) {
      return NextResponse.json({ 
        error: "Payment verification failed",
        verified: false 
      }, { status: 400 })
    }
    
    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
