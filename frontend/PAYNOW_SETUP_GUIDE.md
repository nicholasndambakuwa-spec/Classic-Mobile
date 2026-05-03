# PayNow Integration Setup Guide

This guide explains how to set up PayNow payment integration for your e-commerce platform.

## Current Status

Your shop is currently in **DEMO MODE** with a simulated payment interface. The DemoPay component uses PayNow's official test scenarios and tokens.

## PayNow Test Mode

PayNow provides official test credentials and scenarios that you can use **without needing a merchant account registration** (though you do need to create one to get real Integration ID/Key).

### Test Tokens Available

#### Mobile Money Test Numbers
```
✅ 0771111111 - Success (5 seconds)
⏳ 0772222222 - Delayed Success (30 seconds)
❌ 0773333333 - User Cancelled
⚠️  0774444444 - Insufficient Balance
```

#### Card Payment Test Tokens
```
✅ {11111111-1111-1111-1111-111111111111} - Success
⏳ {22222222-2222-2222-2222-222222222222} - Pending
❌ {33333333-3333-3333-3333-333333333333} - Cancelled
⚠️  {44444444-4444-4444-4444-444444444444} - Insufficient Balance
```

## Setup Instructions

### Step 1: Create PayNow Account

1. Go to: https://www.paynow.co.zw/Customer/Register
2. Fill in your business details
3. Verify your email
4. Set up your bank account for receiving payments

### Step 2: Get Integration Credentials

1. Log in to PayNow dashboard
2. Navigate to: **Other Ways To Get Paid** → **Create/Manage Shopping Carts** → **Create Advanced Integration**
3. Enter:
   - **Integration Name**: Your app name (e.g., "Classic Mobile Shop")
   - **Email for Notifications**: Your business email
   - **Notification URL**: Leave blank (we handle it per transaction)
   - **Payment Methods**: Select the methods you want to accept

4. Click **Save**
5. Your integration will be created in **TEST MODE**

### Step 3: Get Your Keys

1. In the Integration Keys section, you'll see your **Integration ID**
2. For security, PayNow doesn't display the **Integration Key** on the page
3. Click **Email Key To Company Address** to receive it
4. **Keep the key secret** - store it in your `.env` file

### Step 4: Configure Your Application

#### Update Backend Configuration

Edit `api/checkout.php`:

```php
$paynow_configured = true; // Change from false to true

$paynow_integration_id = "YOUR_INTEGRATION_ID"; // From PayNow dashboard
$paynow_integration_key = "YOUR_INTEGRATION_KEY"; // Emailed by PayNow
```

#### Update Return URLs (Optional)

If you want to customize where customers return after payment:

```php
$return_url = "https://yoursite.com/success"; // After successful payment
$result_url = "https://yoursite.com/api/update_order.php"; // Notification endpoint
```

### Step 5: Test Your Integration

1. Go to your shop and add items to cart
2. Proceed to checkout
3. You'll be redirected to PayNow test payment page
4. Use the test mobile number or card token to simulate payment
5. Select one of the test scenarios (success, delayed, cancelled, etc.)

### Step 6: Go Live

Once you've successfully tested multiple transactions:

1. In PayNow dashboard, go to **Integration Keys**
2. Click **Request to be Set Live**
3. PayNow support will verify your test transactions
4. Once approved, your integration is LIVE and will process real payments

#### Generate New Production Keys

For security, when going live:
1. Click **Generate New Key**
2. PayNow will email you new production credentials
3. Update your `checkout.php` with the new keys
4. Old test keys will no longer work

## Frontend Payment Flow

Your frontend now has an enhanced PayNow test simulator:

1. **Demo Payment Page** (`src/pages/DemoPay.jsx`)
   - Shows method selection (Mobile Money vs Card)
   - Displays test scenarios
   - Simulates payment processing with realistic delays
   - Uses PayNow's official test tokens

2. **Success Page** (`src/pages/Success.jsx`)
   - Shows order confirmation
   - Displays payment reference

## Environment Variables

For production deployment, create a `.env` file in your API directory:

```env
PAYNOW_ID=YOUR_INTEGRATION_ID
PAYNOW_KEY=YOUR_INTEGRATION_KEY
PAYNOW_LIVE=false  # Set to true when going live
```

## Troubleshooting

### Issue: "Integration is not configured"
- **Solution**: Ensure `paynow_configured = true` in checkout.php
- Verify your Integration ID and Key are correct

### Issue: "Test transaction failed"
- **Solution**: Make sure you're using the exact test numbers/tokens from PayNow docs
- Check that your merchant account email matches the `authemail` field

### Issue: "Payment not showing up in dashboard"
- **Solution**: Verify your return and result URLs are correct
- Check that PayNow can reach your notification endpoint

## Documentation References

- **PayNow Developer Hub**: https://developers.paynow.co.zw
- **Test Mode Guide**: https://developers.paynow.co.zw/docs/paynow/test_mode
- **Integration Keys**: https://developers.paynow.co.zw/docs/paynow/integration_generation
- **PHP SDK**: https://developers.paynow.co.zw/docs/paynow/php_quickstart

## Security Notes

⚠️ **Important**: 
- Never commit your Integration Key to version control
- Always use environment variables for secrets in production
- Test thoroughly before going live
- The test keys and numbers are public knowledge - anyone can use them for testing
- In production, only you have the real Integration ID and Key

## Support

For PayNow support, contact: support@paynow.co.zw
