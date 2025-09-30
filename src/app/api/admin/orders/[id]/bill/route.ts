import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user?.role !== 'admin' && session.user?.email !== 'admin@electronic.com')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    
    const order = await prisma.order.findUnique({
      where: { id }
    })
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    
    const orderWithBill = order as any
    
    if (!orderWithBill.billUrl) {
      return NextResponse.json({ error: "No bill found for this order" }, { status: 404 })
    }
    
    return NextResponse.json({ billUrl: orderWithBill.billUrl })
  } catch (error) {
    console.error('Error fetching bill:', error)
    return NextResponse.json({ 
      error: "Failed to fetch bill", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user?.role !== 'admin' && session.user?.email !== 'admin@electronic.com')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { billUrl, fileName, fileType } = await request.json()
    
    if (!billUrl) {
      return NextResponse.json({ error: "No bill URL provided" }, { status: 400 })
    }
    
    // Check if order exists first
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })
    
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    
    // Store the uploaded image URL
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        billUrl: billUrl,
        updatedAt: new Date()
      } as any,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    const orderWithBill = updatedOrder as any
    
    return NextResponse.json({ 
      order: {
        ...updatedOrder,
        billUrl: orderWithBill.billUrl ? 'uploaded' : null // Don't send full base64 in response
      }, 
      success: true 
    })
  } catch (error) {
    console.error('Error uploading bill:', error)
    return NextResponse.json({ 
      error: "Failed to upload bill", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}