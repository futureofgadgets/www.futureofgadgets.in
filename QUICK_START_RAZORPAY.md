# 🚀 Quick Start - Razorpay Integration

## ⚡ 5-Minute Setup Guide

### Step 1: Get Razorpay Keys (2 minutes)
1. Go to https://razorpay.com and sign up
2. Navigate to **Settings** → **API Keys**
3. Click **Generate Test Key**
4. Copy both:
   - `Key ID` (starts with `rzp_test_`)
   - `Key Secret` (keep this secret!)

### Step 2: Add to Environment (1 minute)
Create/edit `.env.local` file in project root:

```env
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_secret_key_here"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
```

### Step 3: Update Database (1 minute)
```bash
npx prisma db push
```

### Step 4: Start Server (1 minute)
```bash
npm run dev
```

## ✅ Test It Now!

1. Open http://localhost:3000
2. Add products to cart
3. Go to checkout
4. Select **UPI/Card/Net Banking** (not COD)
5. Use test card:
   - **Card**: `4111 1111 1111 1111`
   - **CVV**: `123`
   - **Expiry**: `12/25`
6. Complete payment
7. Check order in `/orders` page

## 🎯 What You'll See

### User Side:
- Razorpay payment modal
- Multiple payment options
- Payment success confirmation
- Order with Payment ID
- Transaction ID displayed

### Admin Side (`/admin/orders`):
- Payment ID: `pay_xxxxxxxxxxxxx`
- Transaction ID: `order_xxxxxxxxxxxxx`
- ✅ Payment Verified badge

## 🔒 Security Checklist

- ✅ Secret key in `.env.local` (not committed)
- ✅ Server-side payment verification
- ✅ Signature validation enabled
- ✅ Stock checked before order
- ✅ Payment verified before order creation

## 💳 Test Payment Methods

### Cards:
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`

### UPI:
- **Success**: `success@razorpay`
- **Failure**: `failure@razorpay`

### Net Banking:
- Select any bank
- Use test credentials provided by Razorpay

## 🚨 Common Issues

### "Payment gateway not configured"
- Check if `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are in `.env.local`
- Restart dev server after adding env variables

### "Payment verification failed"
- Ensure `RAZORPAY_KEY_SECRET` is correct
- Check for extra spaces in env variables

### Payment succeeds but order not created
- Check database connection
- Verify stock availability
- Check server console for errors

## 📱 Going Live

When ready for production:

1. Complete KYC on Razorpay
2. Generate **Live Keys** (starts with `rzp_live_`)
3. Replace test keys with live keys in `.env.local`
4. Test with small real transaction
5. Deploy to production

## 💰 Fees

- **Test Mode**: FREE (no charges)
- **Live Mode**: 2% per transaction
- **No Setup Fee**
- **No Annual Fee**

## 📞 Need Help?

- **Setup Guide**: See `RAZORPAY_SETUP.md`
- **Full Summary**: See `PAYMENT_INTEGRATION_SUMMARY.md`
- **Razorpay Support**: support@razorpay.com
- **Docs**: https://razorpay.com/docs

---

**That's it! You're ready to accept payments! 🎉**
