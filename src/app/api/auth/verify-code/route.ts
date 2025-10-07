import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { code, email } = await req.json()

    const user = await prisma.user.findUnique({ where: { email_provider: { email, provider: 'credentials' } } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    if (!user.emailVerificationToken) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    const isValidCode = await bcrypt.compare(code, user.emailVerificationToken)
    if (!isValidCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return NextResponse.json({ error: 'Code expired' }, { status: 400 })
    }

    await prisma.user.update({
      where: { email_provider: { email, provider: 'credentials' } },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 })
  }
}
