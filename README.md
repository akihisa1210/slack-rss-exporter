# Slack RSS HTML Parser

A specialized tool to extract RSS feed configurations from Slack's RSS app settings HTML and export them to various formats for easy migration to other RSS readers.

## Features

- **Fast HTML Parsing**: Extract RSS feed data directly from Slack's settings page HTML
- **OPML Export**: Direct export to OPML format for RSS reader import
- **Complete Data Extraction**: Captures feed URLs, titles, channel names, and metadata
- **Migration Ready**: OPML output works with most RSS readers
- **No API Limits**: No rate limiting or authentication required

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd slack-rss-html-parser

# Install dependencies
bun install
# or
npm install
```

### 2. Get Slack RSS Settings HTML

1. Open your Slack workspace in a web browser
2. Navigate to: **Apps** → **RSS** → **Settings**
3. Right-click on the page and select **"View Page Source"** or **"Inspect Element"**
4. Find the `<div id="feeds">` section containing all RSS feeds
5. Copy the entire feeds section and save it to a file (e.g., `my-rss-feeds.html`)

### 3. Parse and Export

```bash
# Parse HTML and export to OPML
bun run parse my-rss-feeds.html

# Or using npm
npm run parse my-rss-feeds.html
```

## Usage Examples

### Basic Usage
```bash
bun run parse slack-rss-feeds.html
```

### Custom Output Directory
```bash
# Set output directory in .env file
echo "OUTPUT_DIR=./my-exports" > .env
bun run parse slack-rss-feeds.html
```

## Output Format

### OPML
The tool exports to OPML format, which is compatible with most RSS readers:
- Feedly, Inoreader, NewsBlur
- Thunderbird, Outlook
- Most RSS aggregators

```xml
<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
<head>
  <title>Slack RSS Export</title>
</head>
<body>
  <outline text="tech-news" title="Slack Channel: tech-news">
    <outline type="rss" text="https://example.com/feed.xml" 
             title="https://example.com/feed.xml" 
             xmlUrl="https://example.com/feed.xml" />
  </outline>
</body>
</opml>
```

## Configuration

Create or modify `.env` file:

```env
# Output directory (default: ./output)
OUTPUT_DIR=./exports
```

## Project Structure

```
slack-rss-html-parser/
├── src/
│   ├── commands/
│   │   └── parse.ts            # Main parsing command
│   ├── parser/
│   │   └── html-parser.ts      # HTML parsing logic
│   ├── utils/
│   │   └── exporter.ts         # Export functionality
│   ├── types/
│   │   └── index.ts            # Type definitions
│   ├── config/
│   │   └── config.ts           # Configuration
│   └── index.ts                # Entry point (help message)
├── output/                     # Generated exports
├── .env                        # Configuration file
└── README.md                   # This file
```

## Troubleshooting

### No RSS feeds found
- Ensure the HTML file contains the complete `<div id="feeds">` section
- Check that the file is saved with UTF-8 encoding
- Verify that RSS feeds exist in your Slack workspace

### Parsing errors
- Make sure you copied the HTML from the correct section
- Try refreshing the Slack RSS settings page and copying again
- Check that the HTML structure hasn't changed (open an issue if needed)

### Export issues
- Verify the output directory exists and is writable
- Ensure sufficient disk space

## Migration to RSS Readers

### Feedly
1. Export as OPML
2. Go to Feedly → Add Content → Import OPML
3. Upload the generated .opml file

### Inoreader
1. Export as OPML
2. Go to Settings → Import/Export → Import from OPML file
3. Upload the generated .opml file

### Other RSS Readers
Most RSS readers support OPML import. Look for:
- "Import OPML"
- "Import feeds"
- "Import subscriptions"

## License

MIT License - see LICENSE file for details.

## Contributing

Issues and pull requests are welcome! Please see the contributing guidelines for more details.