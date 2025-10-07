import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateToken, generateTokenExpiry, sendEmail, getVerificationEmailTemplate } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email, password, name, phone } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const token = generateToken()
    const expires = generateTokenExpiry()
    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        phone: phone || null,
        password: hashedPassword,
        role: 'user',
        emailVerified: false,
        emailVerificationToken: token,
        emailVerificationExpires: expires
      }
    })

    console.log('✅ User created:', newUser.email)

    // Send email async (don't wait)
    sendEmail(
      email,
      'Verify your email - Electronic Web',
      getVerificationEmailTemplate(token, email)
    ).catch(err => console.log('⚠️ Email send failed:', err.message))

    return NextResponse.json({ success: true, message: 'Account created! Please check your email (or console) for verification link.' })
  } catch (error: any) {
    console.error('❌ Signup error:', error.message || error)
    return NextResponse.json({ error: error.message || 'Failed to create account' }, { status: 500 })
  }
}
