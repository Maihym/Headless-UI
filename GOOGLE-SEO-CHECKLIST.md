# Google SEO Requirements Checklist

Comprehensive, do-it-right-the-first-time checklist to maximize chances of ranking at the top. Work through it top-to-bottom.

---

## Eligibility & Risk Controls (Do These First)

- [ ] **Comply with Google Search Essentials** (technical basics + spam policies)
  - [Google Search Essentials Documentation](https://developers.google.com/search/docs/essentials)

- [ ] **Robots.txt**
  - Exists at `/robots.txt`
  - Valid UTF-8
  - Doesn't block assets (CSS/JS) or pages you want indexed
  - Add `Sitemap:` line(s)
  - [Robots.txt Guide](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)

- [ ] **Indexability**
  - No unintended `noindex` (meta or HTTP header) on pages you want ranked
  - Use `noindex` only to keep pages out intentionally
  - [Robots.txt Introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)

- [ ] **Spam-Safe**
  - No cloaking
  - No link schemes
  - No doorway/thin pages
  - No expired-domain abuse
  - No **site reputation abuse** ("parasite SEO")
  - [Spam Policies Documentation](https://developers.google.com/search/docs/essentials/spam-policies)

---

## Technical Foundation

- [ ] **HTTPS Everywhere**
  - Fix mixed content
  - Core part of page experience
  - [Google Search Essentials](https://developers.google.com/search/docs/essentials)

- [ ] **Correct Status Codes**
  - 200 for live pages
  - 301 for permanent moves
  - 404/410 for gone pages
  - Avoid soft-404s

- [ ] **Canonicalization**
  - One canonical URL per page (`rel="canonical"` or HTTP header)
  - Avoid cross-domain duplicates unless intended
  - List only canonicals in sitemaps
  - [Canonical URL Guide](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

- [ ] **Clean URLs**
  - Human-readable
  - Stable
  - Lowercase
  - Minimize parameters on indexable pages

- [ ] **Sitemaps**
  - XML sitemap(s) with only canonical, 200-status URLs
  - Submit in Search Console
  - Keep fresh
  - [Build and Submit Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

- [ ] **Crawl Management**
  - Control infinite/filter URLs (facets, calendars, sort orders) with robots.txt rules and internal linking
  - Keep a crawlable "all products/all posts" list page
  - [Managing Faceted Navigation](https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation)

- [ ] **Pagination**
  - Ensure logical next/prev internal links
  - Don't rely on `rel=prev/next` (Google doesn't use it)
  - Provide discoverable "view-all" where it benefits users
  - [Yoast: Google doesn't use rel=prev/next](https://yoast.com/google-doesnt-use-rel-prev-next-for-pagination/)

- [ ] **Mobile-First Rendering**
  - Same primary content, links, and structured data on mobile as desktop
  - Don't block necessary JS/CSS
  - [Google Search Essentials](https://developers.google.com/search/docs/essentials)

---

## Core Web Vitals & Performance (Competitive Must-Haves)

- [ ] **Hit "Good" CWV Thresholds** (field data)
  - **LCP ≤ 2.5s** (Largest Contentful Paint)
  - **INP ≤ 200ms** (Interaction to Next Paint)
  - **CLS ≤ 0.1** (Cumulative Layout Shift)
  - Track in Search Console's CWV report for key templates (home, category, product/article)
  - [Core Web Vitals Guide](https://developers.google.com/search/docs/appearance/core-web-vitals)

- [ ] **Performance Hygiene**
  - Optimize images (modern formats, proper dimensions)
  - Lazy-load below-the-fold
  - Preconnect to critical origins
  - Minimize JS
  - Defer non-critical JS
  - Split CSS
  - Reduce layout shift (reserve space for media, fonts)
  - [Core Web Vitals Guide](https://developers.google.com/search/docs/appearance/core-web-vitals)

---

## Information Architecture & Internal Linking

- [ ] **Flat, Sensible IA**
  - Priority pages ≤3 clicks from home
  - Categories roll up logically

- [ ] **Contextual Internal Links**
  - From high-authority pages to key targets with descriptive anchors
  - Avoid orphan pages

- [ ] **Breadcrumbs**
  - Implement UI + `BreadcrumbList` schema
  - [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

---

## Content Quality (People-First, Intent-Matched)

- [ ] **Purposeful Pages**
  - Each indexable page answers a clear search intent
  - Original, substantial content (not boilerplate)
  - [Google Search Essentials](https://developers.google.com/search/docs/essentials)

- [ ] **Demonstrate E-E-A-T**
  - Real expertise
  - Clear authorship/credentials where appropriate
  - Especially for YMYL (Your Money or Your Life) topics
  - [Google Search Essentials](https://developers.google.com/search/docs/essentials)

- [ ] **Titles & Meta**
  - Unique, descriptive `<title>`
  - Compelling meta description (for CTR)
  - Avoid keyword stuffing
  - [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

- [ ] **Headings**
  - One H1 that states the topic
  - Logical H2/H3 hierarchy

- [ ] **Media**
  - High-quality images near relevant text
  - Proper `alt` text
  - Descriptive filenames
  - Use `<img>`/`<picture>`, not CSS background images for indexable media
  - Consider image sitemaps if many images
  - [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

- [ ] **Video**
  - Allow Google to fetch video files (no hotlink blocking)
  - Provide transcripts/captions
  - Use video structured data
  - Video sitemap if you have lots of videos
  - [Video SEO Best Practices](https://developers.google.com/search/docs/appearance/video)

- [ ] **Avoid Thin/Near-Duplicate Landing Pages**
  - E.g., mass programmatic city pages with boilerplate
  - Consolidate or customize meaningfully
  - [Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies)

---

## Structured Data (For Rich Results & Clarity)

- [ ] **Implement Relevant Schema** via JSON-LD
  - Organization/LocalBusiness
  - Article/NewsArticle
  - Product/Offer/Review
  - FAQ
  - HowTo
  - Breadcrumb
  - VideoObject
  - ImageObject
  - Validate with Rich Results Test / URL Inspection
  - [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

- [ ] **Parity with UI**
  - Markup must reflect visible content
  - No spammy or hidden schema
  - [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

---

## Local SEO (If Applicable)

- [ ] **Google Business Profile**
  - Accurate NAP (Name, Address, Phone)
  - Categories
  - Hours
  - Photos
  - Services
  - Posts
  - Manage reviews

- [ ] **Location Pages**
  - Unique local content (service area, projects, testimonials, FAQs)
  - Embedded map
  - LocalBusiness schema
  - Consistent NAP site-wide
  - [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

---

## E-commerce (If Applicable)

- [ ] **Indexable Product Pages**
  - Unique descriptions
  - Canonicalize variants
  - Manage filters/facets with crawl rules

- [ ] **Product/Offer/Review Schema**
  - Price
  - Availability
  - Ratings
  - [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

- [ ] **Media**
  - Multiple real-world images
  - Proper attributes
  - Keep image URLs stable (don't churn file URLs)
  - [Google Image SEO Best Practices](https://www.searchenginejournal.com/google-updates-image-seo-best-practices-use-consistent-urls/546552/)

---

## International (If Applicable)

- [ ] **Hreflang**
  - Implement reciprocal `hreflang` between language/region variants (including self-ref)
  - Optional `x-default` for global selector
  - [Localized Versions Guide](https://developers.google.com/search/docs/specialty/international/localized-versions)

- [ ] **Geo UX**
  - Local currency
  - Shipping
  - Legal notices
  - Content per locale

---

## Accessibility & UX Signals

- [ ] **Accessible Markup**
  - Proper labels
  - Contrast
  - Keyboard navigation
  - Focus styles
  - Skip links
  - ARIA where needed
  - Good UX aligns with what search systems try to reward
  - [Google Search Essentials](https://developers.google.com/search/docs/essentials)

- [ ] **No Intrusive Interstitials** (especially on mobile)
  - [Google Search Essentials](https://developers.google.com/search/docs/essentials)

---

## Backlinks, Reputation & PR (Earn, Don't Scheme)

- [ ] **Earned Coverage**
  - Original research
  - Data tools
  - PRable assets
  - Pursue relevant editorial links

- [ ] **No Link Schemes**
  - Don't buy/sell links
  - Don't exchange at scale
  - Don't use automated link building
  - Use `rel="sponsored"`/`nofollow` as appropriate for paid/UGC links
  - [Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies)

- [ ] **Brand Signals**
  - Consistent entity info (About/Contact, authors, social profiles)
  - Press page with citations

---

## Monitoring & Feedback Loops

- [ ] **Google Search Console**
  - Verify
  - Submit sitemaps
  - Monitor Indexing
  - Monitor Page Experience
  - Monitor CWV
  - Monitor Enhancements
  - Monitor Manual Actions
  - Use URL Inspection when publishing/diagnosing
  - [Manage Sitemaps](https://support.google.com/webmasters/answer/7451001)

- [ ] **Log Analysis**
  - Sample server logs to confirm Googlebot crawl of priority URLs
  - Detect crawl traps

- [ ] **Analytics**
  - Track organic landings by page template and intent
  - Monitor conversion targets (leads/sales)

- [ ] **Alerts**
  - Notify on spikes in 404/500
  - CWV regressions
  - Indexing drops

---

## Change Management & Migrations

- [ ] **Redirect Maps**
  - For any URL changes, ship 301s in tandem with:
    - Updated canonicals
    - Internal links
    - Sitemaps
  - [Canonical URL Guide](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

- [ ] **Staging Discipline**
  - `noindex` + auth on staging
  - Remove before launch

- [ ] **Deploy Playbook**
  - Pre-/post-launch checks:
    - Status codes
    - Canonicals
    - Robots/sitemaps
    - CWV spot-checks

---

## Page-Type Checklists (Copy/Paste for QA)

### Homepage

- [ ] Clear value prop above the fold
- [ ] Primary CTAs
- [ ] Crawlable links to top categories/services and latest content
- [ ] Organization schema
- [ ] Logo file stable
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

### Category / Listing

- [ ] Unique intro copy
- [ ] Internal links to evergreen guides
- [ ] Pagination UX
- [ ] Avoid infinite scroll without paginated URLs
- [ ] Keep filters crawl-controlled
- [ ] Provide an "all items" listing
- [Managing Faceted Navigation](https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation)

### Product / Service

- [ ] Unique description, specs, FAQs, reviews, UGC
- [ ] Product/Offer/Review schema
- [ ] Price and availability visible in HTML
- [ ] Stable media URLs
- [ ] Descriptive filenames/alt
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Image SEO Best Practices](https://www.searchenginejournal.com/google-updates-image-seo-best-practices-use-consistent-urls/546552/)

### Blog / Article

- [ ] Original reporting/insight
- [ ] Byline with author bio/credentials
- [ ] Article schema
- [ ] Proper headline and date metadata
- [ ] Related articles module for internal discovery
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

### Image & Video

- [ ] `<img>`/`<picture>` (not CSS) with `alt`
- [ ] Responsive images
- [ ] Image sitemap if large library
- [ ] Allow Google to fetch video bytes
- [ ] Include VideoObject markup
- [ ] Consider video sitemaps
- [Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images)
- [Video SEO Best Practices](https://developers.google.com/search/docs/appearance/video)

---

## Ongoing Content & Growth

- [ ] **Intent Map**
  - List target queries
  - Map to pages
  - Avoid cannibalization

- [ ] **Topic Clusters**
  - Pillars + supporting content with strong internal links

- [ ] **Update Cadence**
  - Refresh high-value pages
  - Maintain "last updated" where appropriate

---

## Extra Credit (Often the Tie-Breakers)

- [ ] **Helpful FAQs/How-To**
  - With proper schema where it genuinely benefits users
  - [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

- [ ] **Author Pages**
  - With expertise signals
  - Links to credentials/publications

- [ ] **Entity Alignment**
  - Consistent org details across:
    - Site
    - Schema
    - Google Business Profile
    - Major profiles

---

## What "Done" Looks Like

✅ Priority templates and top pages pass CWV (field data) and have no critical GSC errors
- [Core Web Vitals Report](https://support.google.com/webmasters/answer/9205520)

✅ Every indexable URL is unique, purposeful, canonical, and internally promoted
- [Canonical URL Guide](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

✅ Robots/sitemaps are clean; crawl waste from facets/pagination is under control
- [Managing Faceted Navigation](https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation)

✅ No spam policy risks; links are earned, not manipulated
- [Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies)

---

## Key Resources

1. [Google Search Essentials](https://developers.google.com/search/docs/essentials)
2. [Robots.txt Guide](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)
3. [Robots.txt Introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
4. [Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies)
5. [Canonical URL Guide](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
6. [Build and Submit Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
7. [Managing Faceted Navigation](https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation)
8. [Yoast: Google doesn't use rel=prev/next](https://yoast.com/google-doesnt-use-rel-prev-next-for-pagination/)
9. [Core Web Vitals Guide](https://developers.google.com/search/docs/appearance/core-web-vitals)
10. [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
11. [Video SEO Best Practices](https://developers.google.com/search/docs/appearance/video)
12. [Google Image SEO Best Practices](https://www.searchenginejournal.com/google-updates-image-seo-best-practices-use-consistent-urls/546552/)
13. [Localized Versions Guide](https://developers.google.com/search/docs/specialty/international/localized-versions)
14. [Manage Sitemaps in Search Console](https://support.google.com/webmasters/answer/7451001)
15. [Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images)
16. [Core Web Vitals Report](https://support.google.com/webmasters/answer/9205520)

---

*If you share your site (or staging) and your target markets, this checklist can be turned into a prioritized punch-list for your exact setup and flag any hidden blockers.*

