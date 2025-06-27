import { config } from 'dotenv';

config();

export const CONFIG = {
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN || '',
    // Rate limiting configuration
    requestDelay: parseInt(process.env.SLACK_REQUEST_DELAY || '1000', 10), // Default 1 second
    maxRequestDelay: parseInt(process.env.SLACK_MAX_REQUEST_DELAY || '60000', 10), // Max 60 seconds
    rateLimitRetries: parseInt(process.env.SLACK_RATE_LIMIT_RETRIES || '3', 10), // Retry 3 times
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