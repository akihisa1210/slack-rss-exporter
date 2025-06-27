import { config } from 'dotenv';

config();

export const CONFIG = {
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN || '',
  },
  output: {
    dir: process.env.OUTPUT_DIR || './output',
    format: (process.env.EXPORT_FORMAT || 'json') as 'json' | 'csv' | 'opml',
  },
} as const;

export function validateConfig(): void {
  if (!CONFIG.slack.botToken) {
    throw new Error('SLACK_BOT_TOKEN is required. Please set it in your .env file.');
  }

  if (!['json', 'csv', 'opml'].includes(CONFIG.output.format)) {
    throw new Error('EXPORT_FORMAT must be either "json", "csv", or "opml"');
  }
}