const fs = require('fs');

const data = JSON.parse(fs.readFileSync('ai/reviews.json', 'utf8'));

function normalizeText(text) {
    return text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/…+$/g, '')
        .trim();
}

function normalizeAuthor(author) {
    return author.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Group by normalized author
const byAuthor = {};
data.forEach((r, i) => {
    const key = normalizeAuthor(r.author);
    if (!byAuthor[key]) byAuthor[key] = [];
    byAuthor[key].push({ ...r, originalIndex: i });
});

console.log('Checking for cross-platform duplicates...\n');

let foundDupes = 0;

Object.entries(byAuthor).forEach(([authorKey, reviews]) => {
    if (reviews.length > 1) {
        // Check if different sources
        const sources = [...new Set(reviews.map(r => r.source))];
        if (sources.length > 1) {
            // Check text similarity
            for (let i = 0; i < reviews.length; i++) {
                for (let j = i + 1; j < reviews.length; j++) {
                    if (reviews[i].source !== reviews[j].source) {
                        const text1 = normalizeText(reviews[i].text).substring(0, 150);
                        const text2 = normalizeText(reviews[j].text).substring(0, 150);
                        
                        // Check similarity
                        const shorter = text1.length < text2.length ? text1 : text2;
                        const longer = text1.length < text2.length ? text2 : text1;
                        
                        if (longer.startsWith(shorter.substring(0, Math.min(80, shorter.length))) ||
                            text1.substring(0, 60) === text2.substring(0, 60)) {
                            foundDupes++;
                            console.log(`CROSS-PLATFORM DUPLICATE FOUND:`);
                            console.log(`  Author: ${reviews[i].author} / ${reviews[j].author}`);
                            console.log(`  Line ${reviews[i].originalIndex + 1}: ${reviews[i].source}`);
                            console.log(`    "${reviews[i].text.substring(0, 80)}..."`);
                            console.log(`  Line ${reviews[j].originalIndex + 1}: ${reviews[j].source}`);
                            console.log(`    "${reviews[j].text.substring(0, 80)}..."`);
                            console.log('');
                        }
                    }
                }
            }
        }
    }
});

// Check for merged reviews
const merged = data.filter(r => r.platforms && r.platforms.length > 1);
console.log(`\nMerged cross-platform reviews: ${merged.length}`);
merged.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.author} (${r.platforms.join(' + ')})`);
});

console.log(`\nTotal unmerged cross-platform duplicates found: ${foundDupes}`);

