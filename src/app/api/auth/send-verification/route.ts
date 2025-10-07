import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, generateTokenExpiry, sendEmail, getVerificationEmailTemplate } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findFirst({ where: { email, provider: 'credentials' } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    const token = generateToken()
    const expires = generateTokenExpiry()

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: token,
        emailVerificationExpires: expires
      }
    })

    await sendEmail(
      email,
      'Verify your email - Electronic Web',
      getVerificationEmailTemplate(token, email)
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }

}
