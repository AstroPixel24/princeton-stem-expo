# Google Apps Script Setup Guide for Stripe Payment Integration

## Step-by-Step Setup Instructions

### 1. Create/Update Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Create a new project or open your existing one
3. Replace the contents of `Code.gs` with the code below
4. Save the project (Ctrl+S)

### 2. Set up Stripe Secret Key

1. In Google Apps Script, click the **gear icon** (Project Settings)
2. Scroll down to **Script Properties**
3. Click **Add script property**
4. Enter:
   - **Property**: `STRIPE_SECRET`
   - **Value**: Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
5. Click **Save script properties**

### 3. Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the **gear icon** next to "Select type"
3. Choose **Web app**
4. Fill in:
   - **Description**: "Payment processing for PSE registration"
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. **Copy the Web app URL** - this is what you need in your HTML file

### 4. Update HTML File

Replace the `scriptURL` in your registration.html with the Web app URL from step 3.

### 5. Test the Setup

1. Open the `test_payment.html` file in your browser
2. Click "Test Google Apps Script"
3. Check for any error messages and follow the troubleshooting steps

## Common Issues and Solutions

### Issue: "Missing STRIPE_SECRET in Script Properties"
**Solution**: Make sure you added the STRIPE_SECRET property in step 2 above.

### Issue: "Network error" or "Failed to fetch"
**Solution**: 
- Check that the script URL in your HTML matches the deployment URL
- Make sure the script is deployed with "Who has access: Anyone"

### Issue: "Invalid JSON response"
**Solution**: 
- Check that your Code.gs file has the correct code
- Look for syntax errors in Google Apps Script
- Check the Apps Script execution log for errors

### Issue: Stripe API errors
**Solution**:
- Verify your Stripe secret key is correct
- Make sure you're using the right key (test vs live)
- Check that your Stripe account is in good standing

## Testing Your Setup

1. Use the test file: `test_payment.html`
2. Check browser console for detailed error messages
3. Test with small amounts first ($1-5)
4. Verify webhooks are working (if using them)

## Security Notes

- Never put your Stripe secret key in client-side code
- Always use HTTPS in production
- Keep your Google Apps Script and Stripe keys secure
- Regularly rotate your API keys

## Support

If you continue having issues:
1. Check the browser console for detailed error messages
2. Check the Google Apps Script execution log
3. Verify all setup steps are completed correctly
4. Test with the provided test file first