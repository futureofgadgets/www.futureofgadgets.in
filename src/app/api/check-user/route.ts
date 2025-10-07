import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { email } = await request.json()
  
  const user = await prisma.user.findFirst({
    where: { email }
  })
  
  return NextResponse.json({ exists: !!user })
}