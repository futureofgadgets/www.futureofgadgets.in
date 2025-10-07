import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { code, email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email_provider: { email, provider: 'credentials' } } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.resetPasswordToken) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    const isValidCode = await bcrypt.compare(code, user.resetPasswordToken)
    if (!isValidCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return NextResponse.json({ error: 'Code expired' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { email_provider: { email, provider: 'credentials' } },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}
