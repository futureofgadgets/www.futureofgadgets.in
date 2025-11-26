import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== "admin" && session.user?.email !== process.env.PROTECTED_ADMIN_EMAIL_ID)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    
    const cutoffDate = new Date(currentYear - 1, currentMonth, 1)
    
    const result = await prisma.order.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    })
    
    return NextResponse.json({ 
      message: "Old orders deleted successfully",
      deletedCount: result.count,
      cutoffDate: cutoffDate.toISOString()
    })
  } catch (error: any) {
    console.error('Order cleanup error:', error)
    return NextResponse.json({ 
      error: error.message || "Failed to cleanup orders",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
