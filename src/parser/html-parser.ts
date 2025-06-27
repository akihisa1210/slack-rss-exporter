import type { ChannelRSSInfo } from '../types/index.js';

export interface ParsedRSSFeed {
  feedId: string;
  feedUrl: string;
  feedTitle: string;
  channelName: string;
  channelId: string;
  lastFetched: string;
}

export class SlackRSSHTMLParser {
  parse(html: string): ParsedRSSFeed[] {
    const feeds: ParsedRSSFeed[] = [];
    
    // Create a temporary div to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all feed divs
    const feedDivs = doc.querySelectorAll('div[id^="feed_"]');
    
    feedDivs.forEach((feedDiv) => {
      try {
        // Extract feed ID
        const feedId = feedDiv.id.replace('feed_', '');
        
        // Extract feed URL and title from the link
        const feedLink = feedDiv.querySelector('a[href]:not(.remove_link)');
        if (!feedLink) return;
        
        const feedUrl = feedLink.getAttribute('href') || '';
        const feedTitle = feedLink.getAttribute('title') || feedLink.textContent?.trim() || '';
        
        // Extract channel name
        const channelElement = feedDiv.querySelector('.overflow_ellipsis strong');
        const channelName = channelElement?.textContent?.replace('#', '') || '';
        
        // Extract channel ID from delete button onclick
        const deleteButton = feedDiv.querySelector('.remove_link');
        const onclickAttr = deleteButton?.getAttribute('onclick') || '';
        const channelIdMatch = onclickAttr.match(/'([A-Z0-9]+)'\);$/);
        const channelId = channelIdMatch ? channelIdMatch[1] : '';
        
        // Extract last fetched time
        const timeElement = feedDiv.querySelector('.mini.subtle_silver');
        const lastFetched = timeElement?.textContent?.trim() || '';
        
        if (feedUrl && channelName) {
          feeds.push({
            feedId,
            feedUrl,
            feedTitle,
            channelName,
            channelId,
            lastFetched
          });
        }
      } catch (error) {
        console.error('Error parsing feed entry:', error);
      }
    });
    
    return feeds;
  }
  
  // For Node.js environment without DOM
  parseWithRegex(html: string): ParsedRSSFeed[] {
    const feeds: ParsedRSSFeed[] = [];
    
    // Match each feed div
    const feedDivPattern = /<div id="feed_(\d+)"[^>]*>[\s\S]*?(?=<div id="feed_|$)/g;
    const feedMatches = html.matchAll(feedDivPattern);
    
    for (const match of feedMatches) {
      try {
        const feedId = match[1];
        const feedContent = match[0];
        
        // Extract feed URL and title
        const urlMatch = feedContent.match(/<a href="([^"]+)"[^>]*title="([^"]*)"[^>]*><strong>([^<]+)<\/strong>/);
        if (!urlMatch) continue;
        
        const feedUrl = urlMatch[1];
        const feedTitle = urlMatch[2] || urlMatch[3];
        
        // Extract channel name - look for pattern like "#rss-local-news"
        // Try multiple patterns to catch both mobile and desktop layouts
        const channelMatch = feedContent.match(/<strong>#([^<]+)<\/strong>/) ||
                           feedContent.match(/<strong>#([^に]+)に投稿します<\/strong>/) ||
                           feedContent.match(/overflow_ellipsis"><strong>#([^<]+)<\/strong>/);
        let channelName = channelMatch ? channelMatch[1] : '';
        
        // Clean up channel name - remove "に投稿します" if present
        channelName = channelName.replace(/に投稿します$/, '');
        
        // Extract channel ID from onclick
        const channelIdMatch = feedContent.match(/deleteFeed\('\d+',\s*'([A-Z0-9]+)'\)/);
        const channelId = channelIdMatch ? channelIdMatch[1] : '';
        
        // Extract last fetched time
        const timeMatch = feedContent.match(/<span[^>]*class="[^"]*mini subtle_silver[^"]*"[^>]*>([^<]+前)[^<]*<\/span>/);
        const lastFetched = timeMatch ? timeMatch[1].trim() : '';
        
        if (feedUrl && channelName) {
          feeds.push({
            feedId,
            feedUrl,
            feedTitle,
            channelName,
            channelId,
            lastFetched
          });
        }
      } catch (error) {
        console.error('Error parsing feed entry:', error);
      }
    }
    
    return feeds;
  }
  
  // Convert to ChannelRSSInfo format for compatibility
  convertToChannelRSSInfo(parsedFeeds: ParsedRSSFeed[]): ChannelRSSInfo[] {
    const channelMap = new Map<string, ChannelRSSInfo>();
    
    for (const feed of parsedFeeds) {
      const key = `${feed.channelId}-${feed.channelName}`;
      
      if (!channelMap.has(key)) {
        channelMap.set(key, {
          channelId: feed.channelId,
          channelName: feed.channelName,
          rssFeeds: []
        });
      }
      
      channelMap.get(key)!.rssFeeds.push({
        url: feed.feedUrl,
        title: feed.feedTitle
      });
    }
    
    return Array.from(channelMap.values());
  }
}