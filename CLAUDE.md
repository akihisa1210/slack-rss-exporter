# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Slack RSS Exporter project that aims to export Slack data to RSS format. The project is currently in its initial stage with no implementation yet.

## Development Setup

Since the project is not yet implemented, the following are suggested conventions based on the project name and common practices for Node.js projects:

### Suggested Project Structure
```
slack-rss-exporter/
├── src/
│   ├── index.js        # Main entry point
│   ├── slack/          # Slack API integration
│   ├── rss/            # RSS generation logic
│   └── utils/          # Utility functions
├── tests/              # Test files
├── package.json        # Node.js project configuration
└── .env.example        # Environment variables template
```

### Environment Variables
When implementing, ensure to use environment variables for:
- Slack API tokens
- Slack workspace ID
- RSS feed configuration

## Architecture Considerations

### Slack Integration
- Use the official Slack SDK (@slack/web-api) for API interactions
- Implement proper authentication and error handling
- Consider rate limiting when fetching messages

### RSS Generation
- Follow RSS 2.0 specification
- Include proper XML encoding for special characters
- Consider using an RSS library for Node.js

### Data Flow
1. Authenticate with Slack API
2. Fetch messages from specified channels
3. Transform Slack messages to RSS items
4. Generate valid RSS XML
5. Serve or save the RSS feed

## Security Notes
- Never commit Slack tokens or sensitive credentials
- Use environment variables for all sensitive configuration
- Validate and sanitize all data from Slack before including in RSS