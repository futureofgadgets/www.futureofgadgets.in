# Quick Start Guide: Email Verification & Password Reset

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies (Already Done)
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Test the Features

## 🧪 Testing Email Verification

### 1. Sign Up
1. Open http://localhost:3000
2. Click "Sign In" button
3. Click "Sign up here"
4. Fill the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Password: Test@123 (must have letters, numbers, symbols)
5. Click "Create Account"

### 2. Get Verification Link
Check your terminal/console for output like:
```
📧 Email would be sent to: test@example.com
📧 Subject: Verify your email - Electronic Web
📧 Verification link: http://localhost:3000/auth/verify-email?token=...
```

### 3. Verify Email
1. Copy the verification link from console
2. Paste it in your browser
3. You should see "Email Verified!" message
4. You'll be redirected to home page

### 4. Check Verification Banner
- Sign in with your account
- If not verified, you'll see a yellow banner
- Click "Resend verification email" to get a new link

## 🔐 Testing Forgot Password

### 1. Initiate Password Reset
1. Open http://localhost:3000
2. Click "Sign In" button
3. Click "Forgot Password?" link
4. Enter your email: test@example.com
5. Click "Send Reset Link"

### 2. Get Reset Link
Check your terminal/console for:
```
📧 Email would be sent to: test@example.com
📧 Subject: Reset your password - Electronic Web
📧 Verification link: http://localhost:3000/auth/reset-password?token=...
```

### 3. Reset Password
1. Copy the reset link from console
2. Paste it in your browser
3. Enter new password: NewTest@123
4. Confirm password: NewTest@123
5. Click "Reset Password"
6. You'll see success message

### 4. Sign In with New Password
1. Go to sign in
2. Use email: test@example.com
3. Use password: NewTest@123
4. Click "Sign In"

## 📧 Setting Up Real Email (Optional)

### For Gmail

1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password:
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Add to `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=noreply@electronic.com
```
4. Restart dev server
5. Emails will now be sent to real addresses!

### For Other Providers

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your_mailgun_password
```

## 🎯 What to Expect

### Console Output (Development Mode)
When emails are sent, you'll see:
```
📧 Email would be sent to: user@example.com
📧 Subject: Verify your email - Electronic Web
📧 Verification link: http://localhost:3000/auth/verify-email?token=abc123...
```

### Toast Notifications
You'll see toast messages for:
- ✅ Account created
- ✅ Email verified
- ✅ Password reset link sent
- ✅ Password reset successfully
- ❌ Invalid credentials
- ❌ Token expired

### UI Changes
- Yellow verification banner for unverified users
- "Forgot Password?" link in sign-in dialog
- Forgot password form view
- Email verification page
- Password reset page

## 🐛 Troubleshooting

### "Token expired" error
- Tokens expire after 24 hours
- Request a new verification/reset email

### Can't find verification link
- Check terminal/console output
- Look for lines starting with 📧
- Copy the full URL including token

### Password validation error
Password must have:
- At least 8 characters
- At least one letter (a-z or A-Z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

Example valid passwords:
- `Test@123`
- `MyPass123!`
- `Secure#2024`

### Email not sending (with SMTP setup)
- Check SMTP credentials are correct
- Verify SMTP_HOST and SMTP_PORT
- Check firewall/network settings
- Try with console logging first (remove SMTP vars)

## 📝 Test Checklist

- [ ] Sign up creates account
- [ ] Verification email logged to console
- [ ] Verification link works
- [ ] Email verified successfully
- [ ] Verification banner shows for unverified users
- [ ] Resend verification works
- [ ] Forgot password link appears
- [ ] Reset email logged to console
- [ ] Reset link works
- [ ] New password can be set
- [ ] Can sign in with new password
- [ ] Toast notifications appear
- [ ] Loading states work
- [ ] Error handling works

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Sign up shows success toast
2. ✅ Console shows verification link
3. ✅ Clicking link shows "Email Verified!"
4. ✅ Forgot password shows success toast
5. ✅ Console shows reset link
6. ✅ Can reset password successfully
7. ✅ Can sign in with new password

## 📚 Additional Resources

- `EMAIL_VERIFICATION_SETUP.md` - Detailed setup guide
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `FEATURE_GUIDE.md` - User-facing feature guide
- `README.md` - Main project documentation

## 💡 Pro Tips

1. **Keep Console Open**: All email links appear in console during development
2. **Copy Full URL**: Make sure to copy the entire verification/reset URL
3. **Test Both Flows**: Try both email verification and password reset
4. **Check Expiration**: Tokens expire in 24 hours
5. **Use Strong Passwords**: Follow the password requirements

## 🚀 Ready to Go!

Your email verification and password reset features are fully implemented and ready to test. Start the dev server and try signing up!

```bash
npm run dev
```

Then open http://localhost:3000 and click "Sign In" to get started!
