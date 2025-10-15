# Razorpay Integration Setup Guide

## Overview
The checkout page now includes Razorpay payment gateway integration with a modern, card-based payment method selection UI.

## Features
- **Multiple Payment Methods**: UPI, Cards, Net Banking, Wallets, and Cash on Delivery
- **Secure Payments**: All online payments processed through Razorpay
- **Modern UI**: Card-based layout with radio button selection
- **Payment Verification**: Server-side signature verification for security

## Setup Instructions

### 1. Get Razorpay Credentials
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → API Keys
3. Generate API keys (Test mode for development)
4. Copy the Key ID and Key Secret

### 2. Configure Environment Variables
Add these to your `.env.local` file:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

### 3. Test the Integration
1. Start the development server: `npm run dev`
2. Add items to cart and proceed to checkout
3. Select any online payment method (UPI/Card/Net Banking/Wallet)
4. Complete the payment using Razorpay test credentials

## Payment Flow

### Cash on Delivery (COD)
- Order is created directly
- No payment gateway interaction
- Payment collected on delivery

### Online Payments (UPI/Card/Net Banking/Wallet)
1. User selects payment method
2. Order details sent to Razorpay API
3. Razorpay payment modal opens
4. User completes payment
5. Payment signature verified on server
6. Order created with payment details
7. User redirected to success page

## API Routes

### `/api/razorpay/create-order`
- Creates Razorpay order
- Returns order ID and amount
- Requires authentication

### `/api/razorpay/verify-payment`
- Verifies payment signature
- Validates payment authenticity
- Returns verification status

## UI Changes

### Before
- Small icon-based buttons in a grid
- Separate input fields for each payment type
- Less intuitive selection

### After
- Large card-based selection
- Radio button style with clear visual feedback
- All payment details handled by Razorpay modal
- Better mobile responsiveness
- Cleaner, more professional appearance

## Testing

### Test Card Details (Razorpay Test Mode)
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

### Test UPI
- Use any UPI ID format: `test@paytm`
- Select "Success" in test payment screen

## Security Features
- Server-side signature verification
- HMAC SHA256 encryption
- Secure API key storage
- Session-based authentication
- No sensitive data stored in frontend

## Production Checklist
- [ ] Replace test keys with live keys
- [ ] Enable live mode in Razorpay dashboard
- [ ] Test with real payment methods
- [ ] Set up webhooks for payment notifications
- [ ] Configure payment failure handling
- [ ] Add refund functionality (if needed)

## Support
For Razorpay integration issues, refer to:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)
