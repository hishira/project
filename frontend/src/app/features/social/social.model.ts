export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'other';
export type MentionType = 'post' | 'comment' | 'message';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type PostStatus = 'draft' | 'published' | 'scheduled';

export interface SocialProfile {
  id: string;
  platform: SocialPlatform;
  profileId: string;
  profileName: string;
  profileUrl: string;
  avatarUrl?: string;
  connected: boolean;
  lastSync?: Date;
}

export interface ContactSocialLink {
  contactId: string;
  contactName: string;
  profileId: string;
  platform: SocialPlatform;
  profileName: string;
  profileUrl: string;
}

export interface Mention {
  id: string;
  platform: SocialPlatform;
  type: MentionType;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  contentSnippet?: string;
  postedAt: Date;
  url: string;
  sentiment: Sentiment;
  sentimentScore?: number; // -1..1
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  isRead: boolean;
  isFlagged: boolean;
  tags?: string[];
  assignedTo?: string; // ID użytkownika CRM
  relatedContactId?: string; // powiązany klient (jeśli zidentyfikowany)
}

export interface ScheduledPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  mediaUrls?: string[];
  scheduledAt: Date;
  status: PostStatus;
  publishedAt?: Date;
  createdBy: string;
  createdAt: Date;
}

export interface SentimentStats {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  trend: 'up' | 'down' | 'stable';
  period: 'day' | 'week' | 'month';
}