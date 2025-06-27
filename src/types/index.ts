export interface ChannelRSSInfo {
  channelId: string;
  channelName: string;
  channelType?: 'public' | 'private';
  memberCount?: number;
  rssFeeds: RSSFeed[];
}

export interface RSSFeed {
  url: string;
  title?: string;
  addedBy?: string;
  addedAt?: string;
  lastChecked?: string;
  isValid?: boolean;
}

export interface ExportMetadata {
  exportedAt: string;
  exportVersion: string;
  slackWorkspace?: string;
  totalChannels: number;
  totalFeeds: number;
  exportFormat: string;
}

export interface ExtendedExport {
  metadata: ExportMetadata;
  channels: ChannelRSSInfo[];
}