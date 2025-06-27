import { WebClient } from '@slack/web-api';
import { CONFIG } from '../config/config.js';

export class SlackClient {
  private client: WebClient;

  constructor() {
    this.client = new WebClient(CONFIG.slack.botToken);
  }

  async getAllChannels(): Promise<Array<{ id: string; name: string }>> {
    const channels: Array<{ id: string; name: string }> = [];
    let cursor: string | undefined;

    do {
      const response = await this.client.conversations.list({
        exclude_archived: true,
        types: 'public_channel,private_channel',
        limit: 1000,
        cursor,
      });

      if (response.channels) {
        channels.push(
          ...response.channels
            .filter((channel) => channel.id && channel.name)
            .map((channel) => ({
              id: channel.id!,
              name: channel.name!,
            }))
        );
      }

      cursor = response.response_metadata?.next_cursor;
    } while (cursor);

    return channels;
  }

  async getChannelRSSFeeds(channelId: string): Promise<string[]> {
    const rssUrls: string[] = [];
    let cursor: string | undefined;

    try {
      do {
        const response = await this.client.conversations.history({
          channel: channelId,
          limit: 1000,
          cursor,
        });

        if (response.messages) {
          for (const message of response.messages) {
            if (message.text && message.subtype === 'bot_message') {
              const rssMatches = this.extractRSSUrls(message.text);
              rssUrls.push(...rssMatches);
            }

            if (message.attachments) {
              for (const attachment of message.attachments) {
                if (attachment.title_link && this.isRSSUrl(attachment.title_link)) {
                  rssUrls.push(attachment.title_link);
                }
              }
            }
          }
        }

        cursor = response.response_metadata?.next_cursor;
      } while (cursor);
    } catch (error: any) {
      if (error?.data?.error === 'not_in_channel') {
        // Botがチャンネルに参加していない場合はスキップ
        return [];
      }
      console.error(`Error fetching messages for channel ${channelId}:`, error);
    }

    return [...new Set(rssUrls)];
  }

  private extractRSSUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s<>]+(?:\.rss|\.xml|\/rss|\/feed|\/atom)(?:\?[^\s<>]*)?)/gi;
    const matches = text.match(urlRegex) || [];
    return matches.filter((url) => this.isRSSUrl(url));
  }

  private isRSSUrl(url: string): boolean {
    const rssPatterns = [
      /\.rss$/i,
      /\.xml$/i,
      /\/rss(?:\/|$)/i,
      /\/feed(?:\/|$)/i,
      /\/atom(?:\/|$)/i,
      /\/feeds?\//i,
      /format=rss/i,
      /type=rss/i,
    ];

    return rssPatterns.some((pattern) => pattern.test(url));
  }
}