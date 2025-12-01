# PayPal Payment Buttons Inventory

This document lists all PayPal payment buttons across the Clean Check application that need to be configured with proper PayPal integration.

---

## 🔧 Configuration Required

All payment forms currently use:
- **PayPal Business Email**: `Steve@bigtexasroof.com`
- **Return URL**: `https://cleancheck.fit/payment-success`

### Secrets Needed Later:
- PayPal Client ID (for PayPal SDK integration)
- PayPal Secret Key (for webhook verification)

---

## 📊 Summary

**Total Payment Buttons**: 8
- **Membership Subscriptions**: 4 buttons (2 quarterly, 2 annual)
- **Lab Kit One-Time**: 2 buttons (Health + Tox)
- **Lab Kit Subscriptions**: 2 buttons (Health + Tox)

---

## 📍 Payment Button Locations

### 1. **Platinum 13-Panel Sexual Health Screen** 
**File**: `src/pages/HealthPanelOrder.tsx`

#### One-Time Payment ($249.00)
```html
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
  <input type="hidden" name="cmd" value="_xclick" />
  <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
  <input type="hidden" name="item_name" value="Platinum Health Kit (13-Panel) - One Time" />
  <input type="hidden" name="amount" value="249.00" />
  <input type="hidden" name="no_shipping" value="2" />
  <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
</form>
```

#### Subscription Payment ($224.10/quarter - Save 10%)
```html
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
  <input type="hidden" name="cmd" value="_xclick-subscriptions" />
  <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
  <input type="hidden" name="item_name" value="Platinum Health Kit - Auto-Ship (Quarterly)" />
  <input type="hidden" name="no_shipping" value="2" />
  <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
  <input type="hidden" name="a3" value="224.10" />
  <input type="hidden" name="p3" value="3" />
  <input type="hidden" name="t3" value="M" />
  <input type="hidden" name="src" value="1" />
</form>
```

**Features**:
- Radio button selector (One-Time vs Subscription)
- Subscription defaults with green highlight + "BEST VALUE" badge
- Trust text: "Billed quarterly • Kit ships automatically every 90 days • Cancel anytime"

---

### 2. **Lab-Certified 10-Panel Toxicology**
**File**: `src/pages/ToxicologyKitOrder.tsx`

#### One-Time Payment ($129.00)
```html
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
  <input type="hidden" name="cmd" value="_xclick" />
  <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
  <input type="hidden" name="item_name" value="Safety Tox Kit (10-Panel) - One Time" />
  <input type="hidden" name="amount" value="129.00" />
  <input type="hidden" name="no_shipping" value="2" />
  <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
</form>
```

#### Subscription Payment ($116.10/quarter - Save 10%)
```html
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
  <input type="hidden" name="cmd" value="_xclick-subscriptions" />
  <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
  <input type="hidden" name="item_name" value="Safety Tox Kit - Auto-Ship (Quarterly)" />
  <input type="hidden" name="no_shipping" value="2" />
  <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
  <input type="hidden" name="a3" value="116.10" />
  <input type="hidden" name="p3" value="3" />
  <input type="hidden" name="t3" value="M" />
  <input type="hidden" name="src" value="1" />
</form>
```

**Features**:
- Radio button selector (One-Time vs Subscription)
- Subscription defaults with green highlight + "BEST VALUE" badge
- Trust text: "Billed quarterly • Kit ships automatically every 90 days • Cancel anytime"

---

### 3. **Membership Tiers** (Homepage)
**File**: `src/components/PricingSection.tsx`

#### Single Member - Quarterly ($39/3 months)
```html
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
  <input type="hidden" name="cmd" value="_xclick-subscriptions" />
  <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
  <input type="hidden" name="item_name" value="Cloud Hosting - Single (Quarterly)" />
  <input type="hidden" name="a3" value="39.00" />
  <input type="hidden" name="p3" value="3" />
  <input type="hidden" name="t3" value="M" />
  <input type="hidden" name="src" value="1" />
  <input type="hidden" name="no_shipping" value="2" />
  <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
</form>
```

#### Joint/Couple - Quarterly ($69/3 months)
```html
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
  <input type="hidden" name="cmd" value="_xclick-subscriptions" />
  <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
  <input type="hidden" name="item_name" value="Cloud Hosting - Joint (Quarterly)" />
  <input type="hidden" name="a3" value="69.00" />
  <input type="hidden" name="p3" value="3" />
  <input type="hidden" name="t3" value="M" />
  <input type="hidden" name="src" value="1" />
  <input type="hidden" name="no_shipping" value="2" />
  <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
</form>
```

#### Single Member - Annual ($129/year - Save 20%)
```html
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
  <input type="hidden" name="cmd" value="_xclick-subscriptions" />
  <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
  <input type="hidden" name="item_name" value="Cloud Hosting - Single (Annual)" />
  <input type="hidden" name="a3" value="129.00" />
  <input type="hidden" name="p3" value="12" />
  <input type="hidden" name="t3" value="M" />
  <input type="hidden" name="src" value="1" />
  <input type="hidden" name="no_shipping" value="2" />
  <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
</form>
```

#### Joint/Couple - Annual ($219/year - Save 20%)
```html
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
  <input type="hidden" name="cmd" value="_xclick-subscriptions" />
  <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
  <input type="hidden" name="item_name" value="Cloud Hosting - Joint (Annual)" />
  <input type="hidden" name="a3" value="219.00" />
  <input type="hidden" name="p3" value="12" />
  <input type="hidden" name="t3" value="M" />
  <input type="hidden" name="src" value="1" />
  <input type="hidden" name="no_shipping" value="2" />
  <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
</form>
```

**Features**:
- Standard PayPal Subscribe buttons (image-based)
- Four pricing tiers total
- Annual plans show 20% savings

---

## 🎯 User Flow

1. **User fills delivery form** (Name, Email, Phone, Address, City, State, ZIP)
2. **Clicks "Continue to Payment"**
3. **Payment selector appears** with radio buttons:
   - Option 1: One-Time Order (Standard Price)
   - Option 2: Subscribe & Save 10% (Discounted - **defaults selected**)
4. **User selects preferred option**
5. **PayPal button renders** based on selection
6. **User clicks button** → Redirects to PayPal
7. **After payment** → Returns to `/payment-success`

---

## 🔐 Security & Integration Tasks (For Later)

### Phase 1: PayPal SDK Integration
- [ ] Add PayPal Client ID to secrets
- [ ] Replace HTML forms with PayPal SDK buttons
- [ ] Implement proper error handling

### Phase 2: Webhook Configuration
- [ ] Set up PayPal webhook endpoint
- [ ] Add PayPal Secret Key to secrets
- [ ] Create edge function: `verify-paypal-webhook`
- [ ] Update database on successful payment
- [ ] Send confirmation emails via Resend

### Phase 3: Order Tracking
- [ ] Create lab kit orders in database on payment
- [ ] Generate barcode for each order
- [ ] Send tracking/shipping notification emails

---

## 📝 Notes

- All subscription payments are **quarterly (every 3 months)**
- PayPal parameters: `p3=3`, `t3=M`, `src=1` (recurring)
- Subscription discount: **10% off** standard price
- Payment selector UI uses:
  - Green border/background for subscription (recommended)
  - Blue border/background for one-time
  - Full-width mobile buttons (h-14, text-lg)

---

## 🚀 Next Steps When You Return

1. Verify all payment button locations listed above
2. Collect PayPal credentials (Client ID, Secret Key)
3. Add secrets to Supabase via secrets tool
4. Implement PayPal SDK integration
5. Test payment flows (sandbox first, then production)
6. Set up webhook verification edge function
7. Test subscription cancellation flow

---

**Last Updated**: December 2025
**Status**: Ready for PayPal configuration
