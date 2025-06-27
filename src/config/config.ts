import { config } from 'dotenv';

config();

export const CONFIG = {
  output: {
    dir: process.env.OUTPUT_DIR || './output',
  },
} as const;

export function validateConfig(): void {
  // No validation needed for simplified config
}