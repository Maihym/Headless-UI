<!-- 2fd6cc9f-4f89-4a26-a258-1c615af47b6b b2a8a534-12b1-40b2-bbb7-df38f2644c91 -->
# First Electric Website Build Plan

## Overview

Build a production-ready, SEO-optimized multi-page website using Next.js 14 (App Router) that meets all Google SEO requirements, integrates with Google Calendar for bookings, and deploys to Vercel.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with React 18
- **Styling:** Tailwind CSS for responsive design
- **Forms:** React Hook Form + Google Calendar API + Gmail SMTP
- **SEO:** next-seo, next-sitemap for automated sitemap generation
- **Deployment:** Vercel (free tier)
- **Performance:** Optimized images, fonts, Core Web Vitals compliance

## Site Structure

```
/                    → Home page
/services            → Services page
/contact             → Contact page
/sitemap.xml         → Auto-generated sitemap
/robots.txt          → Crawl rules
```

## Key SEO Features (from checklist)

- LocalBusiness JSON-LD structured data
- Breadcrumb navigation with schema
- Meta tags optimized for target keywords
- Mobile-first responsive design
- Core Web Vitals optimized (LCP, INP, CLS)
- Clean, semantic HTML with proper heading hierarchy
- Accessibility compliance (WCAG 2.1)
- Sitemap and robots.txt auto-generation

## Integration Requirements

- Google Calendar API for booking appointments
- Gmail SMTP for contact form submissions
- Environment variables for API credentials (will need from user)

## Implementation Steps

### 1. Project Setup

- Initialize Next.js 14 project with TypeScript
- Install dependencies: Tailwind, next-seo, next-sitemap, react-hook-form, nodemailer, googleapis
- Configure Tailwind with brand colors from CONTENT.md
- Set up project structure with app router

### 2. Core Components

- Layout component with header/footer
- Navigation with mobile menu
- CTA buttons (phone, email, booking)
- Breadcrumbs component
- Service card components

### 3. Pages Implementation

**Home Page (`/`)**

- Hero section with headline/subheadline from CONTENT.md
- Trust/credential highlights section
- Services overview (cards linking to /services)
- Company introduction (3 paragraphs)
- Testimonials section
- CTA section
- LocalBusiness + Organization schema

**Services Page (`/services`)**

- Service category sections (Residential, Commercial, Specialty)
- Each service with description from CONTENT.md
- Internal linking structure
- Breadcrumb schema
- Service schema markup

**Contact Page (`/contact`)**

- Service area description
- Phone/email display with click-to-call/email
- Custom booking form (Google Calendar integration)
- Email contact form (Gmail SMTP)
- Business hours
- Embedded service area map concept
- ContactPage schema

### 4. Forms Implementation

**Booking Form**

- Fields: Name, Phone, Email, Service Type, Preferred Date/Time, Message
- Validates input with react-hook-form
- Creates Google Calendar event via API
- Sends confirmation email
- Success/error states

**Contact Form**

- Fields: Name, Phone, Email, Subject, Message
- Sends email via Gmail SMTP
- Success/error states

### 5. SEO Configuration

- Implement meta tags per page (title, description, OG tags)
- Generate sitemap.xml with next-sitemap
- Create robots.txt with sitemap reference
- Add canonical URLs
- Implement proper heading hierarchy (H1, H2, H3)
- Add JSON-LD structured data to all pages

### 6. Performance Optimization

- Optimize fonts (next/font with Google Fonts)
- Lazy load below-fold content
- Minimize JavaScript bundles
- Implement proper image sizing (even without photos)
- Reduce layout shift with CSS
- Preconnect to critical origins

### 7. Mobile & Accessibility

- Mobile-first responsive breakpoints
- Touch-friendly buttons (min 44x44px)
- Proper ARIA labels
- Keyboard navigation support
- Focus styles
- Skip links

### 8. Configuration Files

- `next.config.js` with security headers
- `.env.example` template for API keys
- `next-sitemap.config.js` for sitemap generation
- `vercel.json` for deployment configuration

### 9. Documentation

- README.md with setup instructions
- Environment variables documentation
- Deployment guide
- Google Calendar API setup guide
- Gmail SMTP setup guide

### 10. Deployment

- Connect to Vercel
- Configure environment variables
- Deploy to production
- Verify SEO elements in production
- Submit sitemap to Google Search Console

## Environment Variables Needed (User will provide)

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=
GMAIL_USER=
GMAIL_APP_PASSWORD=
NEXT_PUBLIC_SITE_URL=
```

## Files to Create

- `app/layout.tsx` - Root layout with metadata
- `app/page.tsx` - Home page
- `app/services/page.tsx` - Services page
- `app/contact/page.tsx` - Contact page
- `app/api/booking/route.ts` - Booking API endpoint
- `app/api/contact/route.ts` - Contact form API endpoint
- `components/Header.tsx` - Site header
- `components/Footer.tsx` - Site footer
- `components/BookingForm.tsx` - Calendar booking form
- `components/ContactForm.tsx` - Email contact form
- `lib/google-calendar.ts` - Calendar API utilities
- `lib/email.ts` - Email sending utilities
- `lib/schema.ts` - JSON-LD schema generators
- `public/robots.txt` - Crawl rules
- `next-sitemap.config.js` - Sitemap configuration
- `tailwind.config.js` - Tailwind with brand colors
- `README.md` - Setup documentation

## Content Source

All copy will be pulled from `CONTENT.md` file in the current directory.

## Success Criteria

- All pages load with LCP < 2.5s
- Mobile-responsive on all screen sizes
- All SEO checklist items implemented
- Forms functional (will need API credentials for full testing)
- Deploys successfully to Vercel
- Passes Lighthouse audit (90+ scores)
- Valid HTML and structured data

### To-dos

- [ ] Initialize Next.js 14 project with Tailwind CSS and required dependencies
- [ ] Build root layout with Header, Footer, and global SEO metadata
- [ ] Create Home page with hero, intro, trust badges, services overview, and CTAs
- [ ] Create Services page with all residential, commercial, and specialty services
- [ ] Create Contact page with business details and form placeholders
- [ ] Build booking form API route with Google Calendar integration
- [ ] Build email contact form API route with Gmail SMTP
- [ ] Implement LocalBusiness, BreadcrumbList, and Service schemas on all pages
- [ ] Generate dynamic sitemap.xml and robots.txt
- [ ] Add meta tags, Open Graph, canonical URLs, and ensure mobile-first responsiveness
- [ ] Create deployment configuration, environment variable template, and setup documentation