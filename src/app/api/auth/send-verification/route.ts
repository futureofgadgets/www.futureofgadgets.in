import { NextResponse } from 'next/server'
import { generateVerificationCode, generateCodeExpiry, sendEmail, getVerificationEmailTemplate } from '@/lib/email'
import { pendingUsers } from '../signup/route'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const pendingUser = pendingUsers.get(email)
    if (!pendingUser) {
      return NextResponse.json({ error: 'Verification session expired. Please sign up again.' }, { status: 404 })
    }

    const code = generateVerificationCode()
    const expires = generateCodeExpiry()

    pendingUser.code = code
    pendingUser.expires = expires
    pendingUsers.set(email, pendingUser)

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

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}
