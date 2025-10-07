# Troubleshooting Guide

## "Unexpected socket close" Error

This error occurs when the database connection times out or closes unexpectedly.

### Solution:
1. **Restart the dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Check database connection:**
   ```bash
   npx prisma db push
   ```

3. **If still failing, check MongoDB:**
   - Ensure your MongoDB cluster is running
   - Check if IP address is whitelisted in MongoDB Atlas
   - Verify DATABASE_URL in .env is correct

## "User already exists" Error

The user was created but verification failed.

### Solution:
1. **Delete the user from database:**
   - Go to MongoDB Atlas
   - Find and delete the user
   - Or use a different email

2. **Or verify the existing user:**
   - Check console for verification link
   - Use the link to verify

## No Verification Email

### Solution:
1. **Check console/terminal** - Emails are logged there in development
2. Look for lines starting with 📧
3. Copy the verification link from console

## Tips:
- Always check the terminal/console for verification links
- Restart dev server if database errors occur
- Use different email if user already exists
