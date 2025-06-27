# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Slack RSS HTML Parser that extracts RSS feed configurations from Slack's RSS app settings page HTML and exports them to OPML format for easy migration to other RSS readers.

## Current Project Structure
```
slack-rss-exporter/
├── src/
│   ├── index.ts                # Entry point (help message)
│   ├── commands/
│   │   └── parse.ts            # Main parsing command
│   ├── parser/
│   │   └── html-parser.ts      # HTML parsing logic
│   ├── utils/
│   │   └── exporter.ts         # OPML export functionality
│   ├── types/
│   │   └── index.ts            # Type definitions
│   └── config/
│       └── config.ts           # Configuration
├── output/                     # Generated exports
├── package.json                # Bun/TypeScript project configuration
└── README.md                   # Documentation
```

### Environment Variables
The project uses minimal environment variables:
- `OUTPUT_DIR`: Directory for generated OPML exports (default: ./output)

## Architecture

### HTML Parsing
- Parses Slack RSS app settings page HTML using regex patterns
- Extracts RSS feed URLs, titles, and associated channel names
- No API calls or authentication required

### Data Export
- Exports to OPML format for RSS reader compatibility
- Generates timestamped files in the output directory
- Proper XML escaping for special characters

### Data Flow
1. Read HTML file containing Slack RSS settings
2. Parse HTML using regex to extract feed information
3. Convert to structured data format
4. Export as OPML file for RSS reader import

## Security Notes
- No sensitive credentials required
- All data processing is local
- HTML content should be validated before processing