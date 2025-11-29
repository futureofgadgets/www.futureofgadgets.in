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
  // TESTING: Log email details when SMTP is not configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    // console.log('📧 Email would be sent to:', to)
    // console.log('📧 Subject:', subject)
    const codeMatch = html.match(/<div[^>]*>\s*(\d{6})\s*<\/div>/)
    if (codeMatch) {
      // console.log('📧 Verification Code:', codeMatch[1])
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

    // console.log('✅ Email sent to:', to) // TESTING
    return true
  } catch (error: any) {
    // TESTING: Fallback logging when email fails
    // console.log('⚠️ Email failed, logging to console instead')
    const codeMatch = html.match(/<div[^>]*>\s*(\d{6})\s*<\/div>/)
    if (codeMatch) {
      // console.log('📧 Verification Code:', codeMatch[1])
    }
    return true
  }
}

export function getVerificationEmailTemplate(code: string, email: string): string {
  return `<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #000;">

  <p style="font-size: 20px; font-weight: bold; margin: 0 0 20px 0;">
    Verify your account
  </p>

  <p style="font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
    Please enter this code to verify your account and complete your sign-up to Future of Gadgets.
  </p>

  <p style="font-size: 16px; margin: 0 0 10px 0;">
    <strong>Verification code:</strong>
  </p>

  <div style="font-size: 40px; font-weight: bold; letter-spacing: 8px; margin: 10px 0;">
    ${code}
  </div>

  <p style="font-size: 14px; color: #555; margin: 0 0 30px 0;">
    (This code is valid for 10 minutes)
  </p>

  <p style="font-size: 16px; margin: 0 0 20px 0;">
    For additional help, contact Future of Gadgets Support:<br>
    <a href="https://electronic-web.vercel.app/contact" style="color: #1a73e8; text-decoration: none;">
      Click here
    </a>
  </p>

  <p style="font-size: 14px; line-height: 1.5; margin: 20px 0 0 0; color: #555;">
    Future of Gadgets will never ask for your password, credit card, or banking details in an email.  
    If you receive a suspicious message with a link to update your account, do not click it.
  </p>

</div>`
}

export function getPasswordResetEmailTemplate(code: string, email: string): string {
  return `<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #000;">

  <p style="font-size: 20px; font-weight: bold; margin: 0 0 20px 0;">
    Reset your password
  </p>

  <p style="font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
    Please enter this code to reset your password and complete your sign-in to Future of Gadgets.
  </p>

  <p style="font-size: 16px; margin: 0 0 10px 0;">
    <strong>Verification code:</strong>
  </p>

  <div style="font-size: 40px; font-weight: bold; letter-spacing: 8px; margin: 10px 0;">
    ${code}
  </div>

  <p style="font-size: 14px; color: #555; margin: 0 0 30px 0;">
    (This code is valid for 10 minutes)
  </p>

  <p style="font-size: 16px; margin: 0 0 20px 0;">
    For additional help, contact Future of Gadgets Support:<br>
    <a href="https://electronic-web.vercel.app/contact" style="color: #1a73e8; text-decoration: none;">
      Click here
    </a>
  </p>

  <p style="font-size: 14px; line-height: 1.5; margin: 20px 0 0 0; color: #555;">
    Future of Gadgets will never ask for your password, credit card, or banking details in an email.  
    If you receive a suspicious message with a link to update your account, do not click it.
  </p>

</div>`
}

export function getOrderNotificationTemplate(orderData: {
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: Array<{ name: string; qty: number; price: number; color?: string }>
  total: number
  address: string
  paymentMethod: string
}): string {
  const itemsHtml = orderData.items
    .map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #334155; font-size: 14px;">
          ${item.name}
          ${item.color ? `<br><span style="color: #64748b; font-size: 12px;">Color: ${item.color}</span>` : ''}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px;">×${item.qty}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0f172a; font-size: 14px; font-weight: 600;">₹${(item.price * item.qty).toLocaleString()}</td>
      </tr>
    `).join('')

  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff;">
      <h1 style="color: #2563eb; margin: 0 0 8px 0; font-size: 28px; font-weight: 600;">New Order</h1>
      <p style="color: #64748b; margin: 0 0 40px 0; font-size: 15px;">Future of Gadgets</p>
      
      <div style="margin-bottom: 32px;">
        <p style="color: #64748b; margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Order ID</p>
        <p style="color: #0f172a; margin: 0; font-size: 16px; font-weight: 600;">${orderData.orderId}</p>
      </div>
      
      <div style="margin-bottom: 32px;">
        <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Customer</h2>
        <p style="color: #475569; margin: 0 0 8px 0; font-size: 15px;">${orderData.customerName}</p>
        <p style="color: #64748b; margin: 0 0 4px 0; font-size: 14px;">${orderData.customerPhone}</p>
        ${orderData.customerEmail ? `<p style="color: #64748b; margin: 0; font-size: 14px;">${orderData.customerEmail}</p>` : ''}
      </div>
      
      <div style="margin-bottom: 32px;">
        <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Items</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #0f172a;">
          <table style="width: 100%;">
            <tr>
              <td style="color: #0f172a; font-size: 16px; font-weight: 600;">Total</td>
              <td style="text-align: right; color: #2563eb; font-size: 20px; font-weight: 700;">₹${orderData.total.toLocaleString()}</td>
            </tr>
          </table>
        </div>
      </div>
      
      <div style="margin-bottom: 32px;">
        <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Delivery Address</h2>
        <p style="color: #475569; margin: 0; font-size: 14px; line-height: 1.6;">${orderData.address}</p>
      </div>
      
      <div style="margin-bottom: 32px;">
        <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Payment</h2>
        <p style="color: #475569; margin: 0; font-size: 14px;">${orderData.paymentMethod.toUpperCase()}</p>
      </div>
      
      <p style="color: #94a3b8; font-size: 12px; margin: 40px 0 0 0; border-top: 1px solid #e2e8f0; padding-top: 20px;">Automated notification from Future of Gadgets</p>
    </div>
  `
}

export function getOrderConfirmationTemplate(orderData: {
  orderId: string
  customerName: string
  items: Array<{ name: string; qty: number; price: number; color?: string }>
  total: number
  address: string
  paymentMethod: string
  deliveryDate?: Date
}): string {
  const itemsHtml = orderData.items
    .map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #334155; font-size: 14px;">
          ${item.name}
          ${item.color ? `<br><span style="color: #64748b; font-size: 12px;">Color: ${item.color}</span>` : ''}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px;">×${item.qty}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0f172a; font-size: 14px; font-weight: 600;">₹${(item.price * item.qty).toLocaleString()}</td>
      </tr>
    `).join('')

  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff;">
      <h1 style="color: #2563eb; margin: 0 0 8px 0; font-size: 28px; font-weight: 600;">Order Confirmed</h1>
      <p style="color: #64748b; margin: 0 0 32px 0; font-size: 15px;">Future of Gadgets</p>
      
      <p style="color: #475569; margin: 0 0 32px 0; font-size: 15px; line-height: 1.6;">Hi ${orderData.customerName}, thank you for your order! We'll send you a shipping confirmation email as soon as your order ships.</p>
      
      <div style="margin-bottom: 32px;">
        <p style="color: #64748b; margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Order ID</p>
        <p style="color: #0f172a; margin: 0; font-size: 16px; font-weight: 600;">${orderData.orderId}</p>
      </div>
      
      <div style="margin-bottom: 32px;">
        <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #0f172a;">
          <table style="width: 100%;">
            <tr>
              <td style="color: #0f172a; font-size: 16px; font-weight: 600;">Total</td>
              <td style="text-align: right; color: #2563eb; font-size: 20px; font-weight: 700;">₹${orderData.total.toLocaleString()}</td>
            </tr>
          </table>
        </div>
      </div>
      
      <div style="margin-bottom: 32px;">
        <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Delivery Address</h2>
        <p style="color: #475569; margin: 0; font-size: 14px; line-height: 1.6;">${orderData.address}</p>
      </div>
      
      ${orderData.deliveryDate ? `<div style="margin-bottom: 32px;">
        <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Expected Delivery</h2>
        <p style="color: #475569; margin: 0; font-size: 14px;">${new Date(orderData.deliveryDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>` : ''}
      
      <div style="margin-bottom: 32px;">
        <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Payment Method</h2>
        <p style="color: #475569; margin: 0; font-size: 14px;">${orderData.paymentMethod.toUpperCase()}</p>
      </div>
      
      <p style="color: #94a3b8; font-size: 12px; margin: 40px 0 0 0; border-top: 1px solid #e2e8f0; padding-top: 20px;">Thank you for shopping with Future of Gadgets!</p>
    </div>
  `
}
