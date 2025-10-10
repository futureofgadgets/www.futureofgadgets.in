import crypto from 'crypto'
import nodemailer from 'nodemailer'

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateTokenExpiry(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
}

export function generateCodeExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('📧 Email would be sent to:', to)
    console.log('📧 Subject:', subject)
    const codeMatch = html.match(/<div[^>]*>\s*(\d{6})\s*<\/div>/)
    if (codeMatch) {
      console.log('📧 Verification Code:', codeMatch[1])
    }
    return true
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html
    })

    console.log('✅ Email sent to:', to)
    return true
  } catch (error: any) {
    console.log('⚠️ Email failed, logging to console instead')
    const codeMatch = html.match(/<div[^>]*>\s*(\d{6})\s*<\/div>/)
    if (codeMatch) {
      console.log('📧 Verification Code:', codeMatch[1])
    }
    return true
  }
}

export function getVerificationEmailTemplate(code: string, email: string): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Future Of Gadgets</h1>
        <p style="color: #6b7280; margin: 5px 0;">Verify your email address</p>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin-top: 0;">Welcome to Future Of Gadgets!</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Thank you for signing up. Use this verification code:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
            ${code}
          </div>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0; text-align: center;">
          Enter this code in the verification form to complete your registration.
        </p>
      </div>
      
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        This code will expire in 10 minutes. If you didn't create an account, please ignore this email.
      </p>
    </div>
  `
}

export function getPasswordResetEmailTemplate(code: string, email: string): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Future Of Gadgets</h1>
        <p style="color: #6b7280; margin: 5px 0;">Reset your password</p>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          We received a request to reset your password. Use this verification code:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
            ${code}
          </div>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0; text-align: center;">
          Enter this code to reset your password.
        </p>
      </div>
      
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        This code will expire in 10 minutes. If you didn't request this reset, please ignore this email.
      </p>
    </div>
  `
}
