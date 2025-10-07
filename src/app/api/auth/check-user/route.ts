// src/app/api/auth/check-user/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // check user with composite unique (email + provider)
    const user = await prisma.user.findUnique({
      where: {
        email_provider: {
          email,
          provider: 'credentials' // or "google", "github" etc depending on login flow
        }
      }
    })

    return NextResponse.json({ exists: !!user })
  } catch (error) {
    console.error('Error in check-user route:', error)
    return NextResponse.json({ exists: false })
  }
}
