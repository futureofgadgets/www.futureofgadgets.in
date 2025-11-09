import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const reviews = await prisma.customerReview.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ reviews })
  } catch (error: any) {
    console.error('Get reviews error:', error)
    return NextResponse.json({ reviews: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const customerName = formData.get('customerName') as string
    const message = formData.get('message') as string
    const rating = formData.get('rating') as string
    const ratingCount = formData.get('ratingCount') as string
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `SAVE_${Date.now()}.jpg`
    const filepath = join(process.cwd(), 'public', 'CustomerReview', filename)
    await writeFile(filepath, buffer)
    const imageUrl = `/CustomerReview/${filename}`
    
    const review = await prisma.customerReview.create({
      data: {
        customerName,
        message,
        rating: Number(rating),
        ratingCount: Number(ratingCount),
        imageUrl
      }
    })
    
    return NextResponse.json({ success: true, review })
  } catch (error: any) {
    console.error('Customer review error:', error)
    return NextResponse.json({ error: error.message || 'Failed to upload' }, { status: 500 })
  }
}
