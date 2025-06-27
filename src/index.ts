#!/usr/bin/env bun

console.log('Slack RSS HTML Parser');
console.log('=====================\n');

console.log('This tool has been converted to HTML-only parsing.');
console.log('Please use the parse command instead:\n');

console.log('Usage:');
console.log('  bun run parse <path-to-html-file>');
console.log('  npm run parse <path-to-html-file>\n');

console.log('Instructions:');
console.log('1. Go to your Slack RSS app settings page in browser');
console.log('2. Right-click and select "View Page Source" or "Inspect Element"');
console.log('3. Find the <div id="feeds"> section containing all RSS feeds');
console.log('4. Copy the HTML content and save it to a file');
console.log('5. Run: bun run parse your-file.html\n');

console.log('For more details, see README-HTML-IMPORT.md');