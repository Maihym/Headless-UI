// ==UserScript==
// @name         Yelp Review Scraper
// @namespace    http://tampermonkey.net/
// @version      2025-06-03
// @description  Scrape Yelp reviews with two popup buttons: fetch reviews on page, export all to clipboard and clear.
// @author       You
// @match        https://www.yelp.com/biz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

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

    // --- Persistent Review Array ---
    const STORAGE_KEY = 'yelp_reviews_collected';
    function getReviews() {
        return GM_getValue(STORAGE_KEY, []);
    }
    function setReviews(arr) {
        GM_setValue(STORAGE_KEY, arr);
    }
    function addReviews(newReviews) {
        const existing = getReviews();
        // Avoid duplicates by text+date+author
        const key = r => `${r.author}|${r.date}|${r.text}`;
        const existingKeys = new Set(existing.map(key));
        const filtered = newReviews.filter(r => !existingKeys.has(key(r)));
        const combined = existing.concat(filtered);
        setReviews(combined);
        return filtered.length;
    }
    function clearReviews() {
        GM_setValue(STORAGE_KEY, []);
    }

    // --- Review Extraction Logic ---
    function extractReviewsFromDOM() {
        const reviews = [];
        // Each review is in a <li> with a specific class
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
            reviews.push({ author, profilePic, location, rating, text, date, service });
        });
        return reviews;
    }

    // --- Button 1: Fetch Reviews on This Page ---
    const fetchBtn = document.createElement('button');
    fetchBtn.textContent = 'Fetch Reviews on This Page';
    fetchBtn.style.marginBottom = '4px';
    fetchBtn.style.padding = '8px 12px';
    fetchBtn.style.fontSize = '15px';
    fetchBtn.style.background = '#d32323';
    fetchBtn.style.color = '#fff';
    fetchBtn.style.border = 'none';
    fetchBtn.style.borderRadius = '4px';
    fetchBtn.style.cursor = 'pointer';
    fetchBtn.onclick = () => {
        const found = extractReviewsFromDOM();
        const added = addReviews(found);
        showToast(`Fetched ${found.length} reviews, added ${added} new.`);
        // Scroll to pagination navigator
        const paginator = document.querySelector('.pagination__09f24__VRjN4[aria-label="Pagination navigation"]');
        if (paginator) paginator.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        const json = JSON.stringify(reviews, null, 2);
        GM_setClipboard(json);
        clearReviews();
        showToast(`Exported and cleared ${reviews.length} reviews!`);
    };
    container.appendChild(exportBtn);

    document.body.appendChild(container);
})();
