#!/usr/bin/env bun

import { validateConfig } from './config/config.js';
import { SlackClient } from './slack/client.js';
import { RSSScanner } from './rss/scanner.js';
import { Exporter } from './utils/exporter.js';

async function main() {
  try {
    console.log('Slack RSS Exporter');
    console.log('==================\n');

    // Validate configuration
    validateConfig();

    // Initialize components
    const slackClient = new SlackClient();
    const scanner = new RSSScanner(slackClient);
    const exporter = new Exporter();

    // Scan all channels for RSS feeds
    const results = await scanner.scanAllChannels();

    if (results.length === 0) {
      console.log('\nNo RSS feeds found in any channels.');
      return;
    }

    // Export results
    const outputPath = await exporter.export(results);
    console.log(`\nResults exported to: ${outputPath}`);

    // Print summary
    const totalFeeds = results.reduce((sum, channel) => sum + channel.rssFeeds.length, 0);
    console.log(`\nSummary:`);
    console.log(`- Channels with RSS feeds: ${results.length}`);
    console.log(`- Total RSS feeds found: ${totalFeeds}`);

  } catch (error) {
    console.error('\nError:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the main function
await main();