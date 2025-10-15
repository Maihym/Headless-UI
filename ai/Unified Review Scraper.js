// ==UserScript==
// @name         Unified Review Scraper (Yelp + Google Maps)
// @namespace    http://tampermonkey.net/
// @version      2025-10-12-v5
// @description  Scrape reviews from Yelp (recommended & not recommended), Google Maps with unified storage
// @author       You
// @match        https://www.yelp.com/biz/*
// @match        https://www.yelp.com/not_recommended_reviews/*
// @match        https://www.google.com/maps/*
// @match        https://maps.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // --- Platform Detection ---
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const isYelp = hostname.includes('yelp.com') && (pathname.startsWith('/biz/') || pathname.startsWith('/not_recommended_reviews/'));
    const isYelpNotRecommended = pathname.startsWith('/not_recommended_reviews/');
    const isGoogle = hostname.includes('google.com') || hostname.includes('maps.google.com');
    const platform = isYelp ? 'yelp' : isGoogle ? 'google' : null;

    // Exit if not on supported platform
    if (!platform) {
        console.log('[Review Scraper] Not on a supported platform');
        return;
    }

    console.log(`[Review Scraper] Detected platform: ${platform}`);

    // --- UI Setup ---
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '80px';
    container.style.right = '24px';
    container.style.zIndex = '99999';
    container.style.background = 'rgba(255,255,255,0.95)';
    container.style.border = '1px solid #aaa';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    container.style.padding = '12px 10px 10px 10px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';

    // Toast helper
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.position = 'fixed';
        toast.style.bottom = '32px';
        toast.style.right = '32px';
        toast.style.background = '#222';
        toast.style.color = '#fff';
        toast.style.padding = '10px 18px';
        toast.style.borderRadius = '6px';
        toast.style.fontSize = '16px';
        toast.style.zIndex = '100000';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    // --- Duplicate Detection Helpers ---
    function normalizeAuthor(author) {
        // Remove punctuation, lowercase, remove extra spaces
        return author.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    
    function normalizeText(text) {
        // Remove extra whitespace, punctuation, and truncation markers
        return text.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .replace(/\s+/g, ' ')
            .replace(/…+$/g, '') // Remove ellipsis at end
            .trim();
    }
    
    function textSimilarity(text1, text2) {
        const t1 = normalizeText(text1).substring(0, 150);
        const t2 = normalizeText(text2).substring(0, 150);
        
        // Exact match
        if (t1 === t2) return 1.0;
        
        // One is truncated version of the other
        const shorter = t1.length < t2.length ? t1 : t2;
        const longer = t1.length < t2.length ? t2 : t1;
        
        if (longer.startsWith(shorter.substring(0, Math.min(80, shorter.length)))) {
            return 0.95;
        }
        
        // Check if first 60 chars match (very likely same review)
        if (t1.substring(0, 60) === t2.substring(0, 60)) {
            return 0.9;
        }
        
        return 0;
    }
    
    function isDuplicateReview(review, existingReview) {
        // Same source and exact match - definitely duplicate
        if (review.source === existingReview.source &&
            normalizeAuthor(review.author) === normalizeAuthor(existingReview.author) &&
            review.text === existingReview.text) {
            return true;
        }
        
        // Cross-platform duplicate check
        if (review.source !== existingReview.source) {
            const authorMatch = normalizeAuthor(review.author) === normalizeAuthor(existingReview.author);
            const textSim = textSimilarity(review.text, existingReview.text);
            
            // Same author + very similar text = duplicate
            if (authorMatch && textSim >= 0.85) {
                return true;
            }
        }
        
        return false;
    }

    // --- Persistent Review Array ---
    const STORAGE_KEY = 'unified_reviews_collected';
    function getReviews() {
        return GM_getValue(STORAGE_KEY, []);
    }
    function setReviews(arr) {
        GM_setValue(STORAGE_KEY, arr);
    }
    function addReviews(newReviews) {
        const existing = getReviews();
        let addedCount = 0;
        let duplicateCount = 0;
        let mergedCount = 0;
        
        for (const newReview of newReviews) {
            let isDupe = false;
            
            // Check against all existing reviews
            for (let i = 0; i < existing.length; i++) {
                if (isDuplicateReview(newReview, existing[i])) {
                    isDupe = true;
                    duplicateCount++;
                    
                    // If cross-platform duplicate, merge them
                    if (newReview.source !== existing[i].source) {
                        const existingPlatforms = existing[i].platforms || [existing[i].source];
                        
                        // Only merge if not already merged
                        if (!existingPlatforms.includes(newReview.source)) {
                            existingPlatforms.push(newReview.source);
                            existing[i].platforms = existingPlatforms.sort();
                            existing[i].source = existingPlatforms.join('+');
                            
                            // Keep the longer text version
                            if (newReview.text.length > existing[i].text.length) {
                                existing[i].text = newReview.text;
                                existing[i].profilePic = newReview.profilePic || existing[i].profilePic;
                            }
                            
                            mergedCount++;
                            console.log(`[Review Scraper] Merged cross-platform duplicate: ${newReview.author}`);
                        }
                    }
                    break;
                }
            }
            
            if (!isDupe) {
                existing.push(newReview);
                addedCount++;
            }
        }
        
        setReviews(existing);
        
        if (mergedCount > 0) {
            console.log(`[Review Scraper] Added ${addedCount} new, merged ${mergedCount} cross-platform duplicates, skipped ${duplicateCount - mergedCount} exact duplicates`);
        }
        
        return addedCount;
    }
    function clearReviews() {
        GM_setValue(STORAGE_KEY, []);
    }

    // --- Yelp Review Extraction Logic ---
    function extractYelpReviewsFromDOM() {
        const reviews = [];
        
        // Regular Yelp business page reviews
        document.querySelectorAll('ul.list__09f24__ynIEd > li.y-css-1sqelp2').forEach(el => {
            // Reviewer profile picture
            const profilePic = el.querySelector('img.y-css-1lq2n1z')?.src || null;
            // Reviewer name
            const author = el.querySelector('a.y-css-1x1e1r2')?.textContent.trim() || '';
            // Reviewer location
            let location = '';
            const passport = el.querySelector('.user-passport-info');
            if (passport) {
                const locSpan = passport.querySelector('span.y-css-1541nhh');
                if (locSpan) location = locSpan.textContent.trim();
            }
            // Review rating (e.g., aria-label="5 star rating")
            let rating = null;
            const ratingDiv = el.querySelector('div[role="img"][aria-label$="star rating"]');
            if (ratingDiv) {
                const ratingText = ratingDiv.getAttribute('aria-label');
                const match = ratingText && ratingText.match(/([0-9.]+) star/);
                if (match && match[1]) rating = parseFloat(match[1]);
            }
            // Review text
            const text = el.querySelector('span.raw__09f24__T4Ezm')?.textContent.trim() || '';
            // Review date
            const date = el.querySelector('span.y-css-1vi7y4e')?.textContent.trim() || '';
            // Add service (empty for now)
            const service = '';
            // Skip empty reviews (author, text, and date all empty)
            if (!author && !text && !date) return;
            reviews.push({ 
                source: 'yelp',
                recommended: true,
                author, 
                profilePic, 
                location, 
                rating, 
                text, 
                date, 
                service 
            });
        });
        
        return reviews;
    }

    // --- Yelp "Not Recommended" Review Extraction Logic ---
    function extractYelpNotRecommendedReviewsFromDOM() {
        const reviews = [];
        console.log('[Review Scraper] Extracting not recommended Yelp reviews...');
        
        // Not recommended reviews are in: ul.ylist.ylist-bordered.reviews > li
        const reviewElements = document.querySelectorAll('ul.ylist.ylist-bordered.reviews > li, ul.ylist-bordered.reviews > li');
        console.log(`[Review Scraper] Found ${reviewElements.length} review elements on not recommended page`);
        
        reviewElements.forEach((el, index) => {
            try {
                // Reviewer profile picture
                const profilePic = el.querySelector('img.photo-box-img')?.src || null;
                
                // Reviewer name - in .user-display-name span
                const author = el.querySelector('.user-display-name')?.textContent.trim() || '';
                
                // Reviewer location - in .user-location b
                let location = '';
                const locationEl = el.querySelector('.user-location b');
                if (locationEl) location = locationEl.textContent.trim();
                
                // Review rating - in .i-stars with title attribute
                let rating = null;
                const ratingDiv = el.querySelector('.i-stars');
                if (ratingDiv) {
                    const titleText = ratingDiv.getAttribute('title');
                    const match = titleText && titleText.match(/([0-9.]+)\s*star/i);
                    if (match && match[1]) rating = parseFloat(match[1]);
                }
                
                // Review text - in <p lang="en">
                let text = '';
                const textEl = el.querySelector('p[lang="en"]') || 
                             el.querySelector('.review-content p');
                if (textEl) text = textEl.textContent.trim();
                
                // Review date - in .rating-qualifier span
                let date = '';
                const dateEl = el.querySelector('.rating-qualifier');
                if (dateEl) {
                    // Get just the date text, not the "Updated review" part
                    const dateText = dateEl.textContent.trim().split('\n')[0].trim();
                    date = dateText;
                }
                
                const service = '';
                
                // Debug first review
                if (index === 0) {
                    console.log('[Review Scraper] First not recommended review:', {
                        author, location, rating, textLength: text.length, date
                    });
                }
                
                // Skip if missing critical data
                if (!author || !text) {
                    console.log(`[Review Scraper] Skipping review ${index} - missing author or text`);
                    return;
                }
                
                reviews.push({
                    source: 'yelp',
                    recommended: false,
                    author,
                    profilePic,
                    location,
                    rating,
                    text,
                    date,
                    service
                });
            } catch (err) {
                console.error('[Review Scraper] Error extracting not recommended review:', err);
            }
        });
        
        console.log(`[Review Scraper] Successfully extracted ${reviews.length} not recommended reviews`);
        return reviews;
    }

    // --- Google Maps Review Extraction Logic ---
    function extractGoogleReviewsFromDOM() {
        const reviews = [];
        
        console.log('[Review Scraper] Attempting to extract Google reviews...');
        
        // Google Maps reviews - updated selectors for 2025
        const reviewSelectors = [
            'div.jftiEf',                  // Current main review container
            'div.fontBodyMedium.wiI7pd',   // Alternative container
            'div[data-review-id]',         // Data attribute selector
            'div.jxjCjc',                  // Backup selector
            'div[jsaction*="review"]',     // JS action based
        ];
        
        let reviewElements = [];
        for (const selector of reviewSelectors) {
            reviewElements = document.querySelectorAll(selector);
            if (reviewElements.length > 0) {
                console.log(`[Review Scraper] Found ${reviewElements.length} reviews using selector: ${selector}`);
                break;
            }
        }

        if (reviewElements.length === 0) {
            console.warn('[Review Scraper] No review elements found. The page may not have loaded yet.');
            showToast('No reviews found. Try scrolling to reviews section first.');
            return reviews;
        }

        reviewElements.forEach((el, index) => {
            try {
                // Reviewer name - updated selectors
                let author = '';
                const authorEl = el.querySelector('div.d4r55') || 
                               el.querySelector('button.WEBjve') ||
                               el.querySelector('div.TSUbDb a') ||
                               el.querySelector('button[data-review-id]') ||
                               el.querySelector('.d4r55');
                if (authorEl) author = authorEl.textContent.trim();

                // Profile picture
                let profilePic = null;
                const imgEl = el.querySelector('img.NBa7we') || 
                            el.querySelector('img[src*="googleusercontent"]') ||
                            el.querySelector('button img') ||
                            el.querySelector('img[alt*="Profile"]');
                if (imgEl) profilePic = imgEl.src;

                // Rating (aria-label like "5 stars" or star count)
                let rating = null;
                const ratingEl = el.querySelector('span[role="img"][aria-label*="star"]') ||
                               el.querySelector('span.kvMYJc[role="img"]') ||
                               el.querySelector('span[aria-label*="Star"]') ||
                               el.querySelector('div.DU9Pgb span[role="img"]');
                if (ratingEl) {
                    const ariaLabel = ratingEl.getAttribute('aria-label');
                    const match = ariaLabel && ariaLabel.match(/([0-9.]+)\s*star/i);
                    if (match && match[1]) rating = parseFloat(match[1]);
                }

                // Review text - look for expandable or static text
                let text = '';
                const textEl = el.querySelector('span.wiI7pd') || 
                             el.querySelector('div.MyEned span') ||
                             el.querySelector('span.MyEned') ||
                             el.querySelector('div.GHT2ce') ||
                             el.querySelector('span[jsan]') ||
                             el.querySelector('div[class*="review"] span[class*="text"]');
                if (textEl) text = textEl.textContent.trim();

                // Review date - updated selectors
                let date = '';
                const dateEl = el.querySelector('span.rsqaWe') ||
                             el.querySelector('span.DZSIDd') ||
                             el.querySelector('span.xRkPPb') ||
                             el.querySelector('div.DU9Pgb span:not([role="img"])');
                if (dateEl) date = dateEl.textContent.trim();

                // Reviewer location/contribution info
                let location = '';
                const locationEl = el.querySelector('div.RfnDt') ||
                                 el.querySelector('div.e5ovRc') ||
                                 el.querySelector('div[class*="location"]') ||
                                 el.querySelector('button ~ div.RfnDt');
                if (locationEl) {
                    const locText = locationEl.textContent.trim();
                    const parts = locText.split('·');
                    location = parts[0].trim();
                }

                const service = '';

                // Debug log for first review
                if (index === 0) {
                    console.log('[Review Scraper] Sample review data:', {
                        author, rating, date, textLength: text.length, hasProfilePic: !!profilePic
                    });
                }

                // Skip if missing critical data
                if (!author && !text) {
                    console.log(`[Review Scraper] Skipping review ${index} - no author or text`);
                    return;
                }

                reviews.push({
                    source: 'google',
                    recommended: true, // Google doesn't filter reviews
                    author,
                    profilePic,
                    location,
                    rating,
                    text,
                    date,
                    service
                });
            } catch (err) {
                console.error('[Review Scraper] Error extracting review:', err);
            }
        });

        console.log(`[Review Scraper] Successfully extracted ${reviews.length} Google reviews`);
        return reviews;
    }

    // --- Platform-specific extraction ---
    function extractReviewsFromDOM() {
        if (platform === 'yelp') {
            if (isYelpNotRecommended) {
                return extractYelpNotRecommendedReviewsFromDOM();
            } else {
                return extractYelpReviewsFromDOM();
            }
        } else if (platform === 'google') {
            return extractGoogleReviewsFromDOM();
        }
        return [];
    }

    // --- Platform-specific scrolling ---
    function scrollToPagination() {
        if (platform === 'yelp') {
            const paginator = document.querySelector('.pagination__09f24__VRjN4[aria-label="Pagination navigation"]');
            if (paginator) paginator.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (platform === 'google') {
            // For Google Maps, scroll the reviews panel to load more
            const reviewsPanel = document.querySelector('div.m6QErb.DxyBCb.kA9KIf.dS8AEf') ||
                               document.querySelector('div[role="main"]') ||
                               document.querySelector('div.m6QErb');
            if (reviewsPanel) {
                reviewsPanel.scrollTop = reviewsPanel.scrollHeight;
            }
        }
    }

    // --- Button 1: Fetch Reviews on This Page ---
    const fetchBtn = document.createElement('button');
    let platformName = platform === 'yelp' ? 'Yelp' : 'Google';
    if (isYelpNotRecommended) {
        platformName = 'Yelp (Not Recommended)';
    }
    fetchBtn.textContent = `Fetch ${platformName} Reviews`;
    fetchBtn.style.marginBottom = '4px';
    fetchBtn.style.padding = '8px 12px';
    fetchBtn.style.fontSize = '15px';
    fetchBtn.style.background = platform === 'yelp' ? '#d32323' : '#4285f4';
    fetchBtn.style.color = '#fff';
    fetchBtn.style.border = 'none';
    fetchBtn.style.borderRadius = '4px';
    fetchBtn.style.cursor = 'pointer';
    fetchBtn.onclick = () => {
        const found = extractReviewsFromDOM();
        const added = addReviews(found);
        showToast(`Fetched ${found.length} reviews, added ${added} new.`);
        scrollToPagination();
    };
    container.appendChild(fetchBtn);

    // --- Button 2: Export All Reviews to Clipboard and Clear ---
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export All Reviews to Clipboard';
    exportBtn.style.padding = '8px 12px';
    exportBtn.style.fontSize = '15px';
    exportBtn.style.background = '#0073bb';
    exportBtn.style.color = '#fff';
    exportBtn.style.border = 'none';
    exportBtn.style.borderRadius = '4px';
    exportBtn.style.cursor = 'pointer';
    exportBtn.onclick = () => {
        const reviews = getReviews();
        if (reviews.length === 0) {
            showToast('No reviews to export.');
            return;
        }
        
        // Reviews are already deduplicated during fetch
        const json = JSON.stringify(reviews, null, 2);
        GM_setClipboard(json);
        clearReviews();
        
        const mergedCount = reviews.filter(r => r.platforms && r.platforms.length > 1).length;
        showToast(`Exported ${reviews.length} reviews (${mergedCount} cross-platform) and cleared storage!`);
    };
    container.appendChild(exportBtn);

    // --- Review Count Display ---
    const countDisplay = document.createElement('div');
    countDisplay.style.fontSize = '12px';
    countDisplay.style.color = '#666';
    countDisplay.style.textAlign = 'center';
    countDisplay.style.marginTop = '4px';
    countDisplay.style.lineHeight = '1.4';
    function updateCount() {
        const reviews = getReviews();
        const yelpRec = reviews.filter(r => r.source === 'yelp' && r.recommended === true).length;
        const yelpNotRec = reviews.filter(r => r.source === 'yelp' && r.recommended === false).length;
        const googleCount = reviews.filter(r => r.source === 'google').length;
        countDisplay.innerHTML = `Total: ${reviews.length}<br>` +
                                `Yelp: ${yelpRec} | Not Rec: ${yelpNotRec}<br>` +
                                `Google: ${googleCount}`;
    }
    updateCount();
    container.appendChild(countDisplay);

    // Update count after each action
    fetchBtn.addEventListener('click', () => setTimeout(updateCount, 100));

    // Initialize UI - wait for body to be ready
    function initUI() {
        if (document.body) {
            document.body.appendChild(container);
            console.log('[Review Scraper] UI initialized successfully');
        } else {
            setTimeout(initUI, 100);
        }
    }

    // For Google Maps, wait a bit longer for dynamic content
    if (platform === 'google') {
        setTimeout(initUI, 1000);
    } else {
        initUI();
    }
})();

