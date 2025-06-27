import { promises as fs } from 'fs';
import { join } from 'path';
import type { ChannelRSSInfo, ExtendedExport, ExportMetadata } from '../types/index.js';
import { CONFIG } from '../config/config.js';

export class Exporter {
  async export(data: ChannelRSSInfo[]): Promise<string> {
    await this.ensureOutputDirectory();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `slack-rss-export-${timestamp}`;

    switch (CONFIG.output.format) {
      case 'json':
        return this.exportJSON(data, filename);
      case 'csv':
        return this.exportCSV(data, filename);
      case 'opml':
        return this.exportOPML(data, filename);
      default:
        throw new Error(`Unsupported export format: ${CONFIG.output.format}`);
    }
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.access(CONFIG.output.dir);
    } catch {
      await fs.mkdir(CONFIG.output.dir, { recursive: true });
    }
  }

  private async exportJSON(data: ChannelRSSInfo[], filename: string): Promise<string> {
    const filepath = join(CONFIG.output.dir, `${filename}.json`);
    
    const totalFeeds = data.reduce((sum, channel) => sum + channel.rssFeeds.length, 0);
    const metadata: ExportMetadata = {
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0',
      totalChannels: data.length,
      totalFeeds,
      exportFormat: 'json',
    };

    const extendedExport: ExtendedExport = {
      metadata,
      channels: data,
    };

    const content = JSON.stringify(extendedExport, null, 2);
    await fs.writeFile(filepath, content, 'utf-8');
    return filepath;
  }

  private async exportCSV(data: ChannelRSSInfo[], filename: string): Promise<string> {
    const filepath = join(CONFIG.output.dir, `${filename}.csv`);
    
    const rows = ['Channel ID,Channel Name,RSS URL'];
    
    for (const channel of data) {
      for (const feed of channel.rssFeeds) {
        const row = [
          this.escapeCSV(channel.channelId),
          this.escapeCSV(channel.channelName),
          this.escapeCSV(feed.url),
        ].join(',');
        rows.push(row);
      }
    }

    const content = rows.join('\n');
    await fs.writeFile(filepath, content, 'utf-8');
    return filepath;
  }

  private async exportOPML(data: ChannelRSSInfo[], filename: string): Promise<string> {
    const filepath = join(CONFIG.output.dir, `${filename}.opml`);
    const timestamp = new Date().toISOString();
    
    const opmlContent = this.generateOPML(data, timestamp);
    await fs.writeFile(filepath, opmlContent, 'utf-8');
    return filepath;
  }

  private generateOPML(data: ChannelRSSInfo[], timestamp: string): string {
    const outline = data
      .map((channel) => {
        const channelFeeds = channel.rssFeeds
          .map((feed) => 
            `    <outline type="rss" text="${this.escapeXML(feed.url)}" title="${this.escapeXML(feed.url)}" xmlUrl="${this.escapeXML(feed.url)}" />`
          )
          .join('\n');
        
        return `  <outline text="${this.escapeXML(channel.channelName)}" title="Slack Channel: ${this.escapeXML(channel.channelName)}">\n${channelFeeds}\n  </outline>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
<head>
  <title>Slack RSS Export</title>
  <dateCreated>${timestamp}</dateCreated>
  <dateModified>${timestamp}</dateModified>
</head>
<body>
${outline}
</body>
</opml>`;
  }

  private escapeXML(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}