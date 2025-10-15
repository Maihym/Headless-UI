# First Electric Website - Setup Guide

## 🎉 Build Complete!

Your website has been successfully built with Next.js 15.5, React 19, and Tailwind CSS. All pages, components, and features are ready to go.

## ✅ What's Been Built

### Pages
- ✅ **Home Page** (`/`) - Hero, services overview, testimonials, company intro
- ✅ **Services Page** (`/services`) - All residential, commercial, and specialty services
- ✅ **Contact Page** (`/contact`) - Booking form and contact form

### Components
- ✅ **Header** - Responsive navigation with mobile menu
- ✅ **Footer** - Contact info and service areas
- ✅ **Booking Form** - Google Calendar integration
- ✅ **Contact Form** - Email via Resend

### Features
- ✅ SEO-optimized with structured data (LocalBusiness, Breadcrumb schemas)
- ✅ Mobile-responsive design
- ✅ Tailwind CSS with brand colors
- ✅ Sitemap auto-generation
- ✅ Security headers configured
- ✅ Lucide React icons
- ✅ React Hook Form validation

## 🚀 Next Steps

### 1. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then edit `.env.local` and add your API credentials:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Get these from Google Cloud Console
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_CALENDAR_ID=your_calendar_id@gmail.com

# Get this from resend.com
RESEND_API_KEY=re_your_api_key_here
```

### 2. Get Resend API Key (5 minutes)

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email
3. Add your domain OR use their test domain for development
4. Click "API Keys" → "Create API Key"
5. Copy the key and paste it into `.env.local`
6. Update `lib/email.ts` if needed to use your verified domain

**Free tier includes 3,000 emails/month** - perfect to start!

### 3. Set Up Google Calendar API (15 minutes)

#### Step 1: Create Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (e.g., "First Electric Website")
3. Enable the **Google Calendar API**

#### Step 2: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://firstelectric.pro` (for production)
5. Download the JSON file with your credentials

#### Step 3: Get Refresh Token
1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the settings icon (⚙️) → Check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. In Step 1: Select "Calendar API v3" → `https://www.googleapis.com/auth/calendar`
5. Click "Authorize APIs"
6. In Step 2: Click "Exchange authorization code for tokens"
7. Copy the **Refresh token** and add it to `.env.local`

#### Step 4: Get Calendar ID
1. Go to [Google Calendar](https://calendar.google.com)
2. Click the 3 dots next to your calendar → "Settings and sharing"
3. Scroll down to "Integrate calendar"
4. Copy the **Calendar ID** (looks like an email)
5. Add it to `.env.local`

### 4. Test the Forms

Once environment variables are set:

```bash
npm run dev
```

1. Open [http://localhost:3000/contact](http://localhost:3000/contact)
2. Fill out the booking form
3. Check your Google Calendar for the event
4. Check your email for the confirmation

### 5. Deploy to Vercel

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - First Electric website"
git remote add origin <your-github-repo>
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add environment variables in Vercel:
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`
   - Make sure to use your production domain for `NEXT_PUBLIC_SITE_URL`

4. Deploy! 🚀

### 6. Post-Deployment

1. **Submit sitemap to Google Search Console:**
   - Add your site at [search.google.com/search-console](https://search.google.com/search-console)
   - Submit sitemap: `https://firstelectric.pro/sitemap.xml`

2. **Test Core Web Vitals:**
   - Run Lighthouse in Chrome DevTools
   - Aim for 90+ scores

3. **Update Google verification code:**
   - Get verification code from Search Console
   - Add to `app/layout.tsx` in metadata.verification.google

## 📁 Project Structure

```
first-electric-website/
├── app/
│   ├── api/
│   │   ├── booking/route.ts     # Booking API (Calendar + Email)
│   │   └── contact/route.ts     # Contact API (Email only)
│   ├── services/page.tsx        # Services page
│   ├── contact/page.tsx         # Contact page
│   ├── layout.tsx               # Root layout + SEO
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── Header.tsx               # Site header
│   ├── Footer.tsx               # Site footer
│   ├── BookingForm.tsx          # Appointment form
│   └── ContactForm.tsx          # Contact form
├── lib/
│   ├── schema.ts                # JSON-LD schemas
│   ├── email.ts                 # Resend email functions
│   └── google-calendar.ts       # Calendar API functions
├── public/
│   ├── Logo.svg                 # Your logo
│   └── robots.txt               # SEO crawl rules
└── .env.local                   # Environment variables (create this!)
```

## 🎨 Customization

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: "#CAA657",   // Gold (buttons, highlights)
  secondary: "#010001", // Near-Black (text, headers)
  accent: "#D7BC81",    // Light Gold (hover states)
}
```

### Update Content

- **Business info:** `components/Header.tsx` and `components/Footer.tsx`
- **Services:** `app/services/page.tsx`
- **Testimonials:** `app/page.tsx`
- **Structured data:** `lib/schema.ts`

### Add More Pages

With Next.js App Router, just create new files:

```bash
# Example: Add an about page
mkdir app/about
# Create app/about/page.tsx
```

## 🆘 Troubleshooting

### Forms not working?
- Check `.env.local` exists and has all variables
- Restart dev server after adding environment variables
- Check browser console for errors

### Build failing?
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run build`

### Styling issues?
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`

## 📞 Support

- **Business Phone:** (657) 239-6331
- **Email:** contact@firstelectric.pro

---

**Built with:**
- Next.js 15.5
- React 19
- Tailwind CSS v3
- TypeScript
- Resend (Email)
- Google Calendar API
- Headless UI
- Lucide React (Icons)

