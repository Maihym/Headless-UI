# Booking Modal Enhancement - Implementation Guide

## Overview

The booking wizard has been transformed into a modal-based system with enhanced features including:
- ✅ Modal popup with confirmation on close
- ✅ Split first name and last name fields with validation
- ✅ Phone number formatting and validation (10 digits)
- ✅ Google Places autocomplete for service address
- ✅ Optional apartment/suite/unit field
- ✅ Email validation
- ✅ Smart auto-scrolling that brings active fields into view
- ✅ Responsive design (full-screen on mobile, centered modal on desktop)
- ✅ Real-time validation with error messages

## What Was Changed

### New Files Created

1. **`lib/google-maps-context.tsx`**
   - Google Maps API provider wrapper
   - Loads Google Places API
   - Handles API key configuration

2. **`components/booking/BookingModal.tsx`**
   - Modal wrapper using Headless UI Dialog
   - Handles open/close state
   - Confirmation dialog when closing with unsaved changes
   - Responsive sizing

3. **`components/booking/BookingTrigger.tsx`**
   - Reusable button component to trigger the booking modal
   - Customizable variants (primary, secondary, outline)
   - Customizable sizes (sm, md, lg)
   - Can be placed anywhere on the site

### Modified Files

1. **`types/booking.ts`**
   - Changed `CustomerInfo.name` to `firstName` and `lastName`
   - Added optional `aptSuite` field

2. **`components/booking/CustomerForm.tsx`**
   - Split name into firstName and lastName fields
   - Added comprehensive validation for all fields
   - Integrated Google Places Autocomplete for address
   - Added apartment/suite/unit field
   - Auto-focus on first field when mounted
   - Real-time validation with error messages
   - Phone validation for 10 digits

3. **`components/booking/MobileBookingWizard.tsx`**
   - Added auto-scroll behavior using `scrollIntoView`
   - Added `onStepChange` callback for modal integration
   - Updated validation logic for customer form
   - Added ref for scroll target
   - Updated to use firstName/lastName instead of name

4. **`components/booking/BookingReview.tsx`**
   - Updated to display firstName + lastName
   - Shows apt/suite if provided
   - Maintains edit functionality

5. **`app/calendar-test/page.tsx`**
   - Replaced inline wizard with BookingTrigger button
   - Simplified testing interface

6. **`app/api/booking/route.ts`**
   - Updated to accept firstName/lastName (with legacy name support)
   - Added aptSuite handling
   - Combines fields for calendar and email

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in your project root with:

```env
# Google Maps API Key (REQUIRED for address autocomplete)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Email Service (Resend) - for confirmation emails
RESEND_API_KEY=your_resend_api_key_here

# Google Calendar API - for availability and bookings
GOOGLE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
```

### Getting Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key and add it to `.env.local`
6. (Recommended) Restrict the API key:
   - Application restrictions: HTTP referrers
   - Add your domains (localhost:3000, your-domain.com)
   - API restrictions: Only allow Maps JavaScript API and Places API

## Usage

### Basic Usage - Add Booking Button Anywhere

```tsx
import BookingTrigger from '@/components/booking/BookingTrigger';

export default function MyPage() {
  return (
    <BookingTrigger
      variant="primary"
      size="lg"
      text="Book an Appointment"
      onComplete={(booking) => {
        console.log('Booking completed:', booking);
        // Optionally redirect or show success message
      }}
    />
  );
}
```

### Advanced Usage - Pre-select Service

```tsx
<BookingTrigger
  variant="primary"
  size="md"
  text="Book Service Call"
  preSelectedService="service"
  onComplete={(booking) => {
    // Handle completion
    router.push('/thank-you');
  }}
/>
```

### Variant Options

- `primary` - Blue background (default)
- `secondary` - Dark background
- `outline` - White with border

### Size Options

- `sm` - Small button
- `md` - Medium button (default)
- `lg` - Large button

## Features Explained

### 1. Name Validation

- First name: Required, minimum 2 characters
- Last name: Required, minimum 2 characters
- Shows error messages on blur or when user tries to advance

### 2. Phone Validation

- Automatically formats as `(XXX) XXX-XXXX`
- Validates for exactly 10 digits
- Shows error if incomplete

### 3. Email Validation

- Standard email format validation
- Shows error for invalid format

### 4. Google Places Autocomplete

- Start typing an address and see suggestions
- Select from dropdown to auto-fill
- Restricted to US addresses
- Fallback: If Google Maps API key is missing, shows warning in console but form still works with manual entry

### 5. Apartment/Suite Field

- Optional field below address
- Included in booking submission
- Displayed in review and confirmation

### 6. Auto-Scrolling

- Automatically scrolls to center the active step content
- Smooth animation
- Reduces finger movement on mobile
- 100ms delay ensures DOM has updated before scrolling

### 7. Modal Behavior

- Full-screen on mobile for better UX
- Centered modal on desktop
- Backdrop blur effect
- Click outside or X to close
- Confirmation prompt if booking in progress

## Data Flow

### When User Completes Booking

```typescript
{
  service: {
    id: 'service',
    name: 'Service Call',
    price: '$189',
    description: '...',
    duration: 120
  },
  selectedDate: Date object,
  selectedTimeSlot: {
    id: 'unique-id',
    start: Date object,
    end: Date object,
    time: '9:00 AM'
  },
  customerInfo: {
    firstName: 'John',
    lastName: 'Smith',
    phone: '(555) 123-4567',
    email: 'john@example.com',
    address: '123 Main St, La Mirada, CA 90638',
    aptSuite: 'Apt 4B', // optional
    notes: 'Additional notes...' // optional
  }
}
```

### API Submission

The booking data is sent to `/api/booking` with the following payload:

```typescript
{
  firstName: 'John',
  lastName: 'Smith',
  phone: '(555) 123-4567',
  email: 'john@example.com',
  address: '123 Main St, La Mirada, CA 90638',
  aptSuite: 'Apt 4B',
  serviceType: 'service',
  serviceName: 'Service Call',
  servicePrice: '$189',
  slotStart: '2025-10-14T09:00:00.000Z',
  slotEnd: '2025-10-14T11:00:00.000Z',
  notes: 'Additional notes...'
}
```

The API route combines `firstName + lastName` → `fullName` and `address + aptSuite` → `fullAddress` for calendar and email.

## Testing

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/calendar-test`

3. Click "Open Booking Modal"

4. Test each feature:
   - Try submitting without filling fields (should show validation errors)
   - Enter partial phone number (should show error)
   - Enter invalid email (should show error)
   - Type address and select from autocomplete
   - Enter apt/suite
   - Navigate between steps and observe auto-scroll
   - Try closing modal mid-booking (should show confirmation)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Requires Google Maps API for autocomplete

## Performance Notes

- Google Maps API loaded on-demand via LoadScript
- Only loads 'places' library (not full Maps)
- Auto-scroll uses smooth CSS transitions
- Modal animations use Headless UI Transition
- No impact on initial page load (modal code loaded on trigger)

## Troubleshooting

### Google Places not working

1. Check browser console for errors
2. Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`
3. Ensure Places API is enabled in Google Cloud Console
4. Check API key restrictions allow your domain

### Validation not working

1. Check browser console for React errors
2. Ensure CustomerForm receives `onValidationChange` prop
3. Verify MobileBookingWizard has `isCustomerFormValid` state

### Auto-scroll not smooth

1. Check `globals.css` has `scroll-behavior: smooth` on html element
2. Verify browser supports smooth scrolling
3. Try increasing timeout in `scrollToContent()` function

### Modal not closing

1. Check for JavaScript errors in console
2. Verify Headless UI Dialog is properly implemented
3. Ensure `isOpen` state is being updated

## Future Enhancements

Potential improvements for future iterations:

- [ ] Address verification (confirm address is valid)
- [ ] Save address history for returning customers
- [ ] International phone number support
- [ ] Multiple address suggestions
- [ ] Real-time availability checking while typing
- [ ] Keyboard navigation for accessibility
- [ ] Save draft bookings to localStorage
- [ ] Multi-step progress indicator with clickable steps

## Support

For issues or questions:
1. Check browser console for errors
2. Verify environment variables are set
3. Test with Google Maps API key
4. Check this documentation
5. Review component props and types

