import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, generateTokenExpiry, sendEmail, getPasswordResetEmailTemplate } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ success: true })
    }

    const token = generateToken()
    const expires = generateTokenExpiry()

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires
      }
    })

    await sendEmail(
      email,
      'Reset your password - Electronic Web',
      getPasswordResetEmailTemplate(token, email)
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
  }
}
