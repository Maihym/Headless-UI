# Unified Review Scraper - Usage Guide

## Overview
This Tampermonkey script scrapes reviews from **Yelp** (both recommended and not recommended) and **Google Maps** with unified storage and export functionality.

## Supported Pages

### Yelp
- ✅ Regular business pages: `https://www.yelp.com/biz/[business-name]`
- ✅ Not recommended reviews: `https://www.yelp.com/not_recommended_reviews/[business-name]`

### Google Maps
- ✅ Business pages: `https://www.google.com/maps/place/[business-name]`
- ✅ Alternative: `https://maps.google.com/*`

## Data Structure

Each review contains:
```json
{
  "source": "yelp" | "google",
  "recommended": true | false,
  "author": "Reviewer Name",
  "profilePic": "https://...",
  "location": "City, State",
  "rating": 5,
  "text": "Review text...",
  "date": "Jan 1, 2025",
  "service": ""
}
```

### New Field: `recommended`
- **Yelp regular reviews**: `recommended: true`
- **Yelp not recommended**: `recommended: false`
- **Google reviews**: `recommended: true` (Google doesn't filter reviews)

## How to Use

### 1. Install the Script
1. Copy the contents of `ai/Unified Review Scraper.js`
2. Open Tampermonkey dashboard
3. Create new script
4. Paste and save

### 2. Scrape Yelp Recommended Reviews
1. Go to: `https://www.yelp.com/biz/first-electric-la-mirada-4`
2. Click "Fetch Yelp Reviews"
3. Navigate to next page, repeat
4. Reviews are stored with `recommended: true`

### 3. Scrape Yelp Not Recommended Reviews
1. Go to: `https://www.yelp.com/not_recommended_reviews/first-electric-la-mirada-4`
2. Click "Fetch Yelp (Not Recommended) Reviews"
3. Reviews are stored with `recommended: false`

### 4. Scrape Google Maps Reviews
1. Go to Google Maps business page
2. Scroll to reviews section
3. Click "Fetch Google Reviews"
4. Scroll down to load more reviews, repeat

### 5. Export All Reviews
1. Click "Export All Reviews to Clipboard"
2. **Duplicates are already merged** (happens during fetch automatically)
3. Reviews are copied as JSON
4. Toast shows: "Exported X reviews (Y cross-platform)"
5. Storage is automatically cleared
6. Paste into `reviews.json` or wherever needed

**Note:** Duplicate detection now happens in real-time as you fetch! Watch the console for merge notifications.

## UI Features

### Status Display
Shows breakdown of collected reviews:
```
Total: 58
Yelp: 48 | Not Rec: 10
Google: 0
```

### Button Colors
- **Yelp**: Red (#d32323)
- **Google**: Blue (#4285f4)

### Console Debugging
Open Developer Console (F12) to see:
- `[Review Scraper] Detected platform: yelp`
- `[Review Scraper] Found 10 reviews using selector: ...`
- Sample review data for troubleshooting

## Duplicate Detection

### How It Works
The script automatically detects and merges cross-platform duplicates **during fetch** (real-time):

1. **Author Matching:**
   - Normalizes author names (removes punctuation, case-insensitive)
   - Matches variations: "Jay Lewis" = "Jay L." = "jay lewis"

2. **Text Similarity:**
   - Compares first 150 characters of review text (normalized)
   - 85%+ similarity threshold
   - Handles truncated reviews (removes ellipsis, extra spaces)
   - Matches if first 60 chars are identical

3. **Merging Strategy (Real-Time):**
   - Detects duplicates when adding new reviews (during fetch)
   - Automatically merges cross-platform duplicates immediately
   - Keeps review with longer/more complete text
   - Adds `platforms` array: `["google", "yelp"]`
   - Updates `source` field: `"google+yelp"`
   - Console logs each merge: `"Merged cross-platform duplicate: [author]"`

### Example Output

**Before Export (2 separate reviews):**
```json
{
  "source": "google",
  "author": "Jay Lewis",
  "text": "Working with Michael was an absolute breeze from start to finish. He responded to …"
},
{
  "source": "yelp",
  "author": "Jay L.",
  "text": "Working with Michael was an absolute breeze from start to finish. He responded to my request promptly, took my call right away..."
}
```

**After Export (merged):**
```json
{
  "source": "google+yelp",
  "platforms": ["google", "yelp"],
  "author": "Jay L.",
  "text": "Working with Michael was an absolute breeze from start to finish. He responded to my request promptly, took my call right away..."
}
```

### On Your Website
You can display merged reviews with a badge:
```javascript
{review.platforms && review.platforms.length > 1 && (
  <span className="badge">
    Reviewed on {review.platforms.join(' & ')}
  </span>
)}
```

## Tips

### Yelp
- Some pages may require scrolling before reviews load
- Navigate through pagination to get all reviews
- Not recommended reviews are on a separate page (link at bottom of business page)

### Google Maps
- Scroll the reviews panel to load more
- Google's DOM changes frequently - check console if issues occur
- Script waits 1 second for page to load

### Filtering on Your Website
You can filter reviews in your code:
```javascript
// Only 5-star recommended Yelp reviews
const testimonials = reviews.filter(r => 
  r.source === 'yelp' && 
  r.recommended === true && 
  r.rating === 5
);

// All reviews except not recommended
const allVisible = reviews.filter(r => r.recommended === true);

// Only not recommended (for internal review)
const filtered = reviews.filter(r => r.recommended === false);
```

## Troubleshooting

### No Reviews Found
1. Check console for error messages (F12)
2. Make sure you've scrolled to the reviews section
3. Try refreshing the page and waiting a moment
4. Check if page structure has changed (Yelp/Google update layouts)

### Selectors Not Working
The script includes fallback selectors. If still failing:
1. Open Developer Console
2. Right-click a review → Inspect
3. Note the class names
4. Update selectors in the script

### Duplicates
The script automatically prevents duplicates in multiple ways:

**Same-platform duplicates:**
- Exact match: `source + author + text`
- Can safely click "Fetch" multiple times on same page

**Cross-platform duplicates:**
- Normalized author matching (case-insensitive, no punctuation)
- 85%+ text similarity (handles truncated reviews)
- Automatically merges and adds `platforms` array
- Keeps longer/more complete version

## Version History
- **2025-10-12-v5**: IMPROVED duplicate detection - now happens in real-time during fetch with better text normalization and 85% similarity threshold
- **2025-10-12-v4**: Added smart duplicate detection & merging at export time with `platforms` array
- **2025-10-12-v3**: Fixed selectors for Yelp "not recommended" reviews based on actual HTML structure
- **2025-10-12-v2**: Added support for Yelp "not recommended" reviews, added `recommended` field
- **2025-10-12**: Initial unified scraper for Yelp and Google Maps

