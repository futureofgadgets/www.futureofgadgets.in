import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateVerificationCode, generateCodeExpiry, sendEmail, getPasswordResetEmailTemplate } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({ 
      where: { 
        email_provider: { 
          email, 
          provider: 'credentials' 
        } 
      } 
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const code = generateVerificationCode()
    const expires = generateCodeExpiry()
    const hashedCode = await bcrypt.hash(code, 10)

    await prisma.user.update({
      where: { 
        email_provider: { 
          email, 
          provider: 'credentials' 
        } 
      },
      data: {
        resetPasswordToken: hashedCode,
        resetPasswordExpires: expires
      }
    })

    await sendEmail(
      email,
      'Reset your password - Electronic Web',
      getPasswordResetEmailTemplate(code, email)
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
  }
}
