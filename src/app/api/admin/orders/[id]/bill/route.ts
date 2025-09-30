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
      where: { id },
      select: {
        id: true,
        billUrl: true
      }
    })
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    
    if (!order.billUrl) {
      return NextResponse.json({ error: "No bill found for this order" }, { status: 404 })
    }
    
    return NextResponse.json({ billUrl: order.billUrl })
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
    const { billData, fileName, fileType } = await request.json()
    
    if (!billData) {
      return NextResponse.json({ error: "No bill data provided" }, { status: 400 })
    }
    
    // Validate file size (base64 is ~33% larger than original)
    const sizeInBytes = (billData.length * 3) / 4
    const maxSize = 5 * 1024 * 1024 // 5MB limit
    
    if (sizeInBytes > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 })
    }
    
    // Validate file type
    if (!billData.startsWith('data:image/') && !billData.startsWith('data:application/pdf')) {
      return NextResponse.json({ error: "Invalid file type. Only images and PDFs are allowed" }, { status: 400 })
    }
    
    // Check if order exists first
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })
    
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    
    // Store only a reference or compressed version
    // For production, consider using cloud storage (AWS S3, Cloudinary, etc.)
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        billUrl: billData.substring(0, 1000000), // Limit to 1MB of base64 data
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

    return NextResponse.json({ 
      order: {
        ...updatedOrder,
        billUrl: updatedOrder.billUrl ? 'uploaded' : null // Don't send full base64 in response
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