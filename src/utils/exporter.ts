import { promises as fs } from 'fs';
import { join } from 'path';
import type { ChannelRSSInfo } from '../types/index.js';
import { CONFIG } from '../config/config.js';

export class Exporter {
  async export(data: ChannelRSSInfo[]): Promise<string> {
    await this.ensureOutputDirectory();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `slack-rss-export-${timestamp}`;

    return this.exportOPML(data, filename);
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.access(CONFIG.output.dir);
    } catch {
      await fs.mkdir(CONFIG.output.dir, { recursive: true });
    }
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

}