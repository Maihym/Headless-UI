const fs = require('fs');

const data = JSON.parse(fs.readFileSync('ai/reviews.json', 'utf8'));

const authors = {};
data.forEach((r, i) => {
    const key = r.author.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!authors[key]) {
        authors[key] = [];
    }
    authors[key].push({
        idx: i,
        author: r.author,
        source: r.source,
        platforms: r.platforms,
        textStart: r.text.substring(0, 60)
    });
});

const dupes = Object.entries(authors).filter(([k, v]) => v.length > 1);

console.log('Found', dupes.length, 'potential duplicate authors:\n');

dupes.forEach(([key, reviews]) => {
    console.log('--- ' + reviews[0].author + ' ---');
    reviews.forEach(r => {
        const platforms = r.platforms ? ` (platforms: ${r.platforms.join('+')})` : '';
        console.log(`  Line ${r.idx + 1}: ${r.source}${platforms}`);
        console.log(`    Text: ${r.textStart}...`);
    });
    console.log('');
});

console.log(`\nTotal reviews: ${data.length}`);
console.log(`Unique authors: ${Object.keys(authors).length}`);
console.log(`Duplicate authors: ${dupes.length}`);

