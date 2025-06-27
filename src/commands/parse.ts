#!/usr/bin/env bun

import { readFile } from 'fs/promises';
import { SlackRSSHTMLParser } from '../parser/html-parser.js';
import { Exporter } from '../utils/exporter.js';
import { validateConfig, CONFIG } from '../config/config.js';

async function main() {
  try {
    console.log('Slack RSS HTML Parser');
    console.log('====================\n');

    // Validate configuration for export settings
    validateConfig();

    const htmlFilePath = process.argv[2];
    
    if (!htmlFilePath) {
      console.error('Usage: bun run parse <path-to-html-file>');
      console.error('');
      console.error('Instructions:');
      console.error('1. Go to your Slack RSS app settings page in browser');
      console.error('2. Right-click on the page and select "View Page Source" or "Inspect Element"');
      console.error('3. Find the <div id="feeds"> section containing all RSS feeds');
      console.error('4. Copy the HTML content and save it to a file');
      console.error('5. Run this command with the file path');
      process.exit(1);
    }

    console.log(`Reading HTML file: ${htmlFilePath}`);
    
    // Read the HTML file
    const htmlContent = await readFile(htmlFilePath, 'utf-8');
    
    // Parse the HTML
    const parser = new SlackRSSHTMLParser();
    const parsedFeeds = parser.parseWithRegex(htmlContent);
    
    if (parsedFeeds.length === 0) {
      console.log('No RSS feeds found in the HTML file.');
      console.log('');
      console.log('Make sure the HTML contains the RSS feeds section from Slack.');
      return;
    }

    console.log(`Found ${parsedFeeds.length} RSS feeds`);
    
    // Group by channel for summary
    const channelMap = new Map<string, number>();
    parsedFeeds.forEach(feed => {
      const count = channelMap.get(feed.channelName) || 0;
      channelMap.set(feed.channelName, count + 1);
    });

    console.log(`\\nChannels with RSS feeds: ${channelMap.size}`);
    channelMap.forEach((count, channelName) => {
      console.log(`  #${channelName}: ${count} feeds`);
    });

    // Convert to standard format for export
    const channelRSSInfo = parser.convertToChannelRSSInfo(parsedFeeds);
    
    // Export results
    const exporter = new Exporter();
    const outputPath = await exporter.export(channelRSSInfo);
    
    console.log(`\\nOPML file exported to: ${outputPath}`);
    
    console.log(`\\nSummary:`);
    console.log(`- Total RSS feeds: ${parsedFeeds.length}`);
    console.log(`- Channels with feeds: ${channelMap.size}`);

  } catch (error) {
    console.error('\\nError:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}