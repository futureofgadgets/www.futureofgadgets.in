import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { token, email } = await req.json()

    if (email === 'admin@electronic.com') {
      return NextResponse.json({ error: 'Admin account does not require verification' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    if (user.emailVerificationToken !== token) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    })

    return NextResponse.json({ success: true, user: { email: updatedUser.email, emailVerified: updatedUser.emailVerified } })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 })
  }
}
