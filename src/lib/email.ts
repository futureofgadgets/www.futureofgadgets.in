import crypto from 'crypto'
import nodemailer from 'nodemailer'

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateTokenExpiry(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
}

export async function sendEmail(to: string, subject: string, html: string) {
  // For development/testing without SMTP credentials
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('📧 Email would be sent to:', to)
    console.log('📧 Subject:', subject)
    console.log('📧 Verification link:', html.match(/href="([^"]+)"/)?.[1])
    return true
  }

  try {
    // Production email sending with nodemailer
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
    console.log('📧 Verification link:', html.match(/href="([^"]+)"/)?.[1])
    return true
  }
}

export function getVerificationEmailTemplate(token: string, email: string): string {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`
  
  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Electronic Web</h1>
        <p style="color: #6b7280; margin: 5px 0;">Verify your email address</p>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin-top: 0;">Welcome to Electronic Web!</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Thank you for signing up. Please verify your email address by clicking the button below:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(to right, #2563eb, #7c3aed); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    display: inline-block;
                    font-weight: 500;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
        </p>
      </div>
      
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        This link will expire in 24 hours. If you didn't create an account, please ignore this email.
      </p>
    </div>
  `
}

export function getPasswordResetEmailTemplate(token: string, email: string): string {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`
  
  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Electronic Web</h1>
        <p style="color: #6b7280; margin: 5px 0;">Reset your password</p>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: linear-gradient(to right, #2563eb, #7c3aed); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    display: inline-block;
                    font-weight: 500;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
        </p>
      </div>
      
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        This link will expire in 24 hours. If you didn't request this reset, please ignore this email.
      </p>
    </div>
  `
}