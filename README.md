# First Electric Website

Professional, SEO-optimized website for First Electric - Licensed electrical contractor serving La Mirada, CA and surrounding areas.

## Tech Stack

- **Framework:** Next.js 15.5 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3 + Headless UI
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Email:** Resend API
- **Calendar:** Google Calendar API
- **Deployment:** Vercel

## Features

- ✅ 3 main pages (Home, Services, Contact)
- ✅ SEO-optimized with metadata API & structured data (JSON-LD)
- ✅ Mobile-responsive design
- ✅ Contact form with email notifications
- ✅ Booking form with Google Calendar integration
- ✅ Automatic sitemap generation
- ✅ Security headers configured
- ✅ Core Web Vitals optimized
- ✅ Accessibility compliant (WCAG 2.1)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Resend API account (for email)
- Google Cloud project (for Calendar API)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd first-electric-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual credentials (see Environment Variables section below).

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

### Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://firstelectric.pro

# Google Calendar API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_CALENDAR_ID=your_calendar_id@gmail.com

# Resend Email API
RESEND_API_KEY=re_your_resend_api_key
```

### Setting Up Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs: `http://localhost:3000` (for dev)
6. Download the credentials JSON
7. Use the OAuth 2.0 Playground to generate a refresh token:
   - Go to https://developers.google.com/oauthplayground/
   - Click settings (gear icon), check "Use your own OAuth credentials"
   - Enter your Client ID and Client Secret
   - Select "Calendar API v3" and authorize
   - Exchange authorization code for tokens
   - Copy the refresh token

### Setting Up Resend API

1. Sign up at [resend.com](https://resend.com/)
2. Verify your domain (or use their test domain)
3. Generate an API key
4. Add the API key to your `.env.local` file
5. Update the `from` email in `lib/email.ts` to match your verified domain

## Available Scripts

```bash
npm run dev       # Start development server with Turbopack
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Project Structure

```
first-electric-website/
├── app/
│   ├── api/
│   │   ├── booking/route.ts    # Booking API endpoint
│   │   └── contact/route.ts    # Contact form API endpoint
│   ├── services/page.tsx       # Services page
│   ├── contact/page.tsx        # Contact page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   ├── Header.tsx              # Site header
│   ├── Footer.tsx              # Site footer
│   ├── BookingForm.tsx         # Appointment booking form
│   └── ContactForm.tsx         # Contact form
├── lib/
│   ├── schema.ts               # JSON-LD schema generators
│   ├── email.ts                # Email utilities (Resend)
│   └── google-calendar.ts      # Calendar API utilities
├── public/
│   └── Logo.svg                # Company logo
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── next-sitemap.config.js      # Sitemap generation config
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically:
- Build your site
- Generate sitemap.xml
- Set up custom domain
- Enable automatic HTTPS

### Environment Variables in Vercel

In Vercel dashboard, go to Settings → Environment Variables and add all variables from your `.env.local` file.

### Post-Deployment

1. Verify sitemap at `https://yourdomain.com/sitemap.xml`
2. Submit sitemap to Google Search Console
3. Test forms with real data
4. Check Core Web Vitals in Lighthouse

## SEO Features

- **Structured Data:** LocalBusiness, BreadcrumbList, and Service schemas
- **Meta Tags:** Title, description, Open Graph, Twitter cards
- **Sitemap:** Auto-generated with next-sitemap
- **Robots.txt:** Configured for search engine crawling
- **Canonical URLs:** Prevent duplicate content issues
- **Mobile-First:** Responsive design optimized for all devices
- **Performance:** Optimized for Core Web Vitals (LCP, INP, CLS)

## Customization

### Updating Content

All business information is currently hardcoded. To update:

- **Business info:** Edit `components/Header.tsx` and `components/Footer.tsx`
- **Services:** Edit `app/services/page.tsx`
- **Testimonials:** Edit `app/page.tsx`
- **Structured data:** Edit `lib/schema.ts`

### Changing Colors

Brand colors are defined in `tailwind.config.ts`:

```typescript
colors: {
  primary: "#CAA657",   // Gold
  secondary: "#010001", // Near-Black
  accent: "#D7BC81",    // Light Gold
}
```

## Support

For issues or questions:
- Email: contact@firstelectric.pro
- Phone: (657) 239-6331

## License

© 2024 First Electric. All rights reserved.

