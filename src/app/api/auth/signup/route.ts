import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateVerificationCode, generateCodeExpiry, sendEmail, getVerificationEmailTemplate } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email, password, name, phone } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ 
      where: { 
        email_provider: { 
          email, 
          provider: 'credentials' 
        } 
      } 
    })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const isAdmin = email === 'admin@electronic.com'

    if (isAdmin) {
      await prisma.user.create({
        data: {
          email,
          name: name || 'Admin',
          phone: phone || '9905757864',
          password: hashedPassword,
          role: 'admin',
          provider: 'credentials',
          emailVerified: true
        }
      })
      return NextResponse.json({ success: true, message: 'Admin account created!' })
    }

    const code = generateVerificationCode()
    const expires = generateCodeExpiry()
    const hashedCode = await bcrypt.hash(code, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        phone: phone || null,
        password: hashedPassword,
        role: 'user',
        provider: 'credentials',
        emailVerified: false,
        emailVerificationToken: hashedCode,
        emailVerificationExpires: expires
      }
    })

    console.log('✅ User created:', newUser.email)

    sendEmail(
      email,
      'Verify your email - Electronic Web',
      getVerificationEmailTemplate(code, email)
    ).catch(err => console.log('⚠️ Email send failed:', err.message))

    return NextResponse.json({ success: true, message: 'Verification code sent to your email!' })
  } catch (error: any) {
    console.error('❌ Signup error:', error.message || error)
    return NextResponse.json({ error: error.message || 'Failed to create account' }, { status: 500 })
  }
}
