import { SlackClient } from '../slack/client.js';
import type { ChannelRSSInfo } from '../types/index.js';
import { CONFIG } from '../config/config.js';

export class RSSScanner {
  private slackClient: SlackClient;
  private currentDelay: number;
  private rateLimitEncountered: boolean = false;

  constructor(slackClient: SlackClient) {
    this.slackClient = slackClient;
    this.currentDelay = CONFIG.slack.requestDelay;
  }

  async scanAllChannels(): Promise<ChannelRSSInfo[]> {
    console.log('Fetching all channels...');
    const channels = await this.slackClient.getAllChannels();
    console.log(`Found ${channels.length} channels`);

    const results: ChannelRSSInfo[] = [];
    let processedCount = 0;
    let skippedCount = 0;

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
        } else if (rssUrls.length === 0) {
          // getChannelRSSFeedsが空配列を返した場合（Botがチャンネルに参加していないまたはRSSがない）
          skippedCount++;
        }
      } catch (error: any) {
        if (error?.message?.includes('rate limit')) {
          console.warn(`  Rate limit hit. Increasing delay to ${this.currentDelay * 2}ms`);
          this.rateLimitEncountered = true;
          this.currentDelay = Math.min(this.currentDelay * 2, CONFIG.slack.maxRequestDelay);
          // Wait longer after rate limit
          await new Promise((resolve) => setTimeout(resolve, this.currentDelay));
        } else {
          console.error(`  Error scanning channel ${channel.name}:`, error);
        }
      }

      // Dynamic delay based on rate limit status
      await new Promise((resolve) => setTimeout(resolve, this.currentDelay));
      
      // Gradually reduce delay if no rate limit errors
      if (!this.rateLimitEncountered && processedCount % 10 === 0) {
        this.currentDelay = Math.max(CONFIG.slack.requestDelay, this.currentDelay * 0.9);
      }
    }

    console.log(`\nScan complete. Found RSS feeds in ${results.length} channels`);
    if (skippedCount > 0) {
      console.log(`Note: ${skippedCount} channels were skipped (Bot not invited or no RSS feeds)`);
      console.log(`Please invite the bot to channels using: /invite @<bot-name>`);
    }
    if (this.rateLimitEncountered) {
      console.log(`\nRate limiting was encountered during scan. Consider adjusting SLACK_REQUEST_DELAY.`);
    }
    return results;
  }
}