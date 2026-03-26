import { SocialPlatform, Sentiment } from '../../../features/social/social.model';

export const PLATFORM_ICONS: Record<SocialPlatform, string> = {
  facebook: 'facebook',
  twitter: 'twitter',
  instagram: 'instagram',
  linkedin: 'linkedin',
  youtube: 'youtube',
  other: 'share'
};

export const SENTIMENT_ICONS: Record<Sentiment, string> = {
  positive: 'sentiment_satisfied',
  neutral: 'sentiment_neutral',
  negative: 'sentiment_dissatisfied'
};

export const SENTIMENT_COLORS: Record<Sentiment, string> = {
  positive: '#2e7d32',
  neutral: '#757575',
  negative: '#d32f2f'
};
