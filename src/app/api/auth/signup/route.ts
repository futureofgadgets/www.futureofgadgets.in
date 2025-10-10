import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateVerificationCode, generateCodeExpiry, sendEmail, getVerificationEmailTemplate } from '@/lib/email'

const pendingUsers = new Map<string, { email: string; password: string; name: string; phone: string | null; code: string; expires: Date }>()

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

    if (!email.endsWith('@gmail.com')) {
      return NextResponse.json({ error: 'Only @gmail.com emails are allowed. Please use Continue with Google option.' }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({ 
      where: { 
        email, 
        provider: 'credentials' 
      } 
    })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const isAdmin = email === process.env.PROTECTED_ADMIN_EMAIL_ID

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

    pendingUsers.set(email, {
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      phone: phone || null,
      code,
      expires
    })

    console.log('✅ Pending user stored:', email)

    try {
      await sendEmail(
        email,
        'Verify your email - Future Of Gadgets',
        getVerificationEmailTemplate(code, email)
      )
      console.log('✅ Email sent to:', email)
    } catch (err) {
      console.log('⚠️ Email send failed:', err)
    }

    return NextResponse.json({ success: true, message: 'Verification code sent to your email!' })
  } catch (error: any) {
    console.error('❌ Signup error:', error.message || error)
    return NextResponse.json({ error: error.message || 'Failed to create account' }, { status: 500 })
  }
}

export { pendingUsers }
