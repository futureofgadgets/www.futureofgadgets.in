# Review System Documentation

## Overview
A comprehensive review system that allows customers to review delivered products within 3 days, with admin capabilities to manage and respond to reviews.

## Features

### Customer Features
- **Review Delivered Orders**: Customers can review products from delivered orders
- **3-Day Window**: Reviews can only be submitted within 3 days of delivery
- **One Review Per Product**: Each product in an order can only be reviewed once
- **Star Rating**: 1-5 star rating system
- **Written Review**: Customers can write detailed feedback

### Admin Features
- **Review Management Dashboard**: View all customer reviews at `/admin/reviews`
- **Reply to Reviews**: Admin can respond to customer reviews
- **Delete Reviews**: Admin can remove inappropriate reviews
- **Add Reviews**: Admin can manually add reviews for products
- **View on Products**: All reviews display on product pages

## Database Schema

```prisma
model Review {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  orderId     String   @db.ObjectId
  order       Order    @relation(fields: [orderId], references: [id])
  productId   String
  userId      String
  userName    String
  rating      Int
  comment     String
  adminReply  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

### GET /api/reviews
Fetch reviews with optional filters
- Query params: `productId`, `orderId`
- Returns: `{ reviews: Review[] }`

### POST /api/reviews
Create a new review (customer)
- Body: `{ orderId, productId, rating, comment }`
- Validates: Order is delivered, within 3 days, no duplicate review
- Returns: `{ review: Review }`

### PATCH /api/reviews/[id]
Update review with admin reply (admin only)
- Body: `{ adminReply }`
- Returns: `{ review: Review }`

### DELETE /api/reviews/[id]
Delete a review (admin only)
- Returns: `{ success: true }`

### POST /api/admin/reviews
Admin adds review directly (admin only)
- Body: `{ productId, rating, comment, userName }`
- Returns: `{ review: Review }`

## User Flow

### Customer Review Flow
1. Customer places an order
2. Order is delivered
3. Customer views order in `/orders` page
4. "Write a Review" button appears for each product (if within 3 days)
5. Customer clicks button, rates product (1-5 stars), writes comment
6. Review is submitted and appears on product page
7. After 3 days, review option disappears

### Admin Management Flow
1. Admin navigates to `/admin/reviews`
2. Views all customer reviews
3. Can reply to reviews (appears as "Seller Response")
4. Can delete inappropriate reviews
5. Can manually add reviews for products

## Implementation Details

### Review Eligibility Check
```typescript
const canReview = (order: Order, productId: string) => {
  if (order.status !== 'delivered') return false
  const deliveredDate = new Date(order.updatedAt)
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  if (deliveredDate < threeDaysAgo) return false
  return !reviews.some(r => r.orderId === order.id && r.productId === productId)
}
```

### Review Display on Product Page
- Shows all reviews for the product
- Displays star rating, customer name, date
- Shows admin reply if available
- Sorted by newest first

## Pages Modified

1. **`/src/app/orders/page.tsx`**
   - Added review button for eligible products
   - Review dialog with star rating and comment
   - 3-day expiry check

2. **`/src/app/products/[slug]/page.tsx`**
   - Reviews section displaying all product reviews
   - Star ratings and customer feedback
   - Admin replies

3. **`/src/app/admin/reviews/page.tsx`** (NEW)
   - Admin dashboard for review management
   - Reply, delete, and add review functionality

4. **`/src/app/admin/page.tsx`**
   - Added Reviews card to dashboard

## Files Created

- `/src/app/api/reviews/route.ts` - Main review API
- `/src/app/api/reviews/[id]/route.ts` - Update/delete review API
- `/src/app/api/admin/reviews/route.ts` - Admin add review API
- `/src/app/admin/reviews/page.tsx` - Admin review management page
- `/prisma/schema.prisma` - Updated with Review model

## Usage Examples

### Customer Submitting Review
```typescript
const res = await fetch('/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: 'order123',
    productId: 'product456',
    rating: 5,
    comment: 'Great product!'
  })
})
```

### Admin Replying to Review
```typescript
const res = await fetch(`/api/reviews/${reviewId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    adminReply: 'Thank you for your feedback!'
  })
})
```

### Admin Adding Review
```typescript
const res = await fetch('/api/admin/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'product456',
    rating: 5,
    comment: 'Excellent quality',
    userName: 'John Doe'
  })
})
```

## Security

- All review operations require authentication
- Admin operations verify admin role
- 3-day window prevents old order reviews
- Duplicate review prevention
- Order status validation (must be delivered)

## Future Enhancements

- Review images/photos
- Helpful/unhelpful voting
- Verified purchase badge
- Review moderation queue
- Email notifications for new reviews
- Review analytics dashboard
