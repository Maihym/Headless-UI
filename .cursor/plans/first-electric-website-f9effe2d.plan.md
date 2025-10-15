<!-- f9effe2d-656e-48e2-a96d-899a8e5c4604 736112ac-ccd1-4af7-b26c-5a33174a640a -->
# First Electric Website Build Plan

## Tech Stack

- **Framework:** Next.js 15.5 (App Router) with React 19
- **Styling:** Tailwind CSS v3 for responsive design
- **Forms:** React Hook Form + Google Calendar API + Resend (email)
- **SEO:** Built-in Metadata API, next-sitemap for automated sitemap generation
- **Deployment:** Vercel (free tier)
- **Performance:** Turbopack builds, optimized images, fonts, Core Web Vitals compliance

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
- Meta tags optimized for target keywords (built-in Metadata API)
- Mobile-first responsive design
- Core Web Vitals optimized (LCP, INP, CLS)
- Clean, semantic HTML with proper heading hierarchy
- Accessibility compliance (WCAG 2.1)
- Sitemap and robots.txt auto-generation

## Integration Requirements

- Google Calendar API for booking appointments
- Resend API for contact form submissions
- Environment variables for API credentials (will need from user)

## Implementation Steps

### 1. Project Setup

- Initialize Next.js 15 project with TypeScript and Turbopack
- Install dependencies: Tailwind CSS v3, next-sitemap, react-hook-form, resend, googleapis
- Configure Tailwind with brand colors from CONTENT.md (#CAA657, #010001, #D7BC81)
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
- LocalBusiness + Organization schema (JSON-LD in metadata)

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
- Email contact form (Resend API)
- Business hours
- Embedded service area map concept
- ContactPage schema

### 4. Forms Implementation

**Booking Form**

- Fields: Name, Phone, Email, Service Type, Preferred Date/Time, Message
- Validates input with react-hook-form
- Creates Google Calendar event via API
- Sends confirmation email via Resend
- Success/error states

**Contact Form**

- Fields: Name, Phone, Email, Subject, Message
- Sends email via Resend API
- Success/error states

### 5. SEO Configuration

- Implement metadata using Next.js 15 built-in Metadata API
- Generate sitemap.xml with next-sitemap
- Create robots.txt with sitemap reference
- Add canonical URLs
- Implement proper heading hierarchy (H1, H2, H3)
- Add JSON-LD structured data to all pages (in metadata)

### 6. Performance Optimization

- Use Turbopack for faster builds
- Optimize fonts (next/font with Google Fonts)
- Lazy load below-fold content
- Minimize JavaScript bundles (React Server Components)
- Implement proper image sizing with next/image
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

- `next.config.js` with Turbopack and security headers
- `.env.example` template for API keys
- `next-sitemap.config.js` for sitemap generation
- `vercel.json` for deployment configuration

### 9. Documentation

- README.md with setup instructions
- Environment variables documentation
- Deployment guide
- Google Calendar API setup guide
- Resend API setup guide

### 10. Deployment

- Connect to Vercel
- Configure environment variables
- Deploy to production with Turbopack builds
- Verify SEO elements in production
- Submit sitemap to Google Search Console

## Environment Variables Needed (User will provide)

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

## Files to Create

- `app/layout.tsx` - Root layout with metadata API
- `app/page.tsx` - Home page with metadata
- `app/services/page.tsx` - Services page with metadata
- `app/contact/page.tsx` - Contact page with metadata
- `app/api/booking/route.ts` - Booking API endpoint (Calendar + Resend)
- `app/api/contact/route.ts` - Contact form API endpoint (Resend)
- `components/Header.tsx` - Site header
- `components/Footer.tsx` - Site footer
- `components/BookingForm.tsx` - Calendar booking form
- `components/ContactForm.tsx` - Email contact form
- `lib/google-calendar.ts` - Calendar API utilities
- `lib/email.ts` - Resend email utilities
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

- [ ] Initialize Next.js 15 project with Tailwind CSS v3 and required dependencies (react-hook-form, next-sitemap, resend, googleapis)
- [ ] Build root layout with Header, Footer, and global SEO metadata using Metadata API
- [ ] Create Home page with hero, intro, trust badges, services overview, testimonials, and CTAs
- [ ] Create Services page with all residential, commercial, and specialty services
- [ ] Create Contact page with business details and form placeholders
- [ ] Build booking form API route with Google Calendar integration and Resend confirmation emails
- [ ] Build email contact form API route with Resend
- [ ] Implement LocalBusiness, BreadcrumbList, and Service schemas on all pages using JSON-LD in metadata
- [ ] Generate dynamic sitemap.xml and robots.txt
- [ ] Add meta tags via Metadata API, Open Graph, canonical URLs, and ensure mobile-first responsiveness
- [ ] Create deployment configuration, environment variable template (.env.example), and setup documentation (README.md)