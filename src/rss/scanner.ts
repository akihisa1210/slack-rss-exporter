import { SlackClient } from '../slack/client.js';
import type { ChannelRSSInfo } from '../types/index.js';

export class RSSScanner {
  private slackClient: SlackClient;

  constructor(slackClient: SlackClient) {
    this.slackClient = slackClient;
  }

  async scanAllChannels(): Promise<ChannelRSSInfo[]> {
    console.log('Fetching all channels...');
    const channels = await this.slackClient.getAllChannels();
    console.log(`Found ${channels.length} channels`);

    const results: ChannelRSSInfo[] = [];
    let processedCount = 0;

    for (const channel of channels) {
      processedCount++;
      console.log(`Processing channel ${processedCount}/${channels.length}: ${channel.name}`);

      try {
        const rssUrls = await this.slackClient.getChannelRSSFeeds(channel.id);
        
        if (rssUrls.length > 0) {
          results.push({
            channelId: channel.id,
            channelName: channel.name,
            rssFeeds: rssUrls.map((url) => ({ url })),
          });
          console.log(`  Found ${rssUrls.length} RSS feeds`);
        }
      } catch (error) {
        console.error(`  Error scanning channel ${channel.name}:`, error);
      }

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(`\nScan complete. Found RSS feeds in ${results.length} channels`);
    return results;
  }
}