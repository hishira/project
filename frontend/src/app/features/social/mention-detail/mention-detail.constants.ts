import { Sentiment } from '../social.model';

export interface SentimentInfo {
  value: Sentiment;
  label: string;
  icon: string;
  color: string;
}

export const SENTIMENT_INFO: Record<Sentiment, SentimentInfo> = {
  positive: {
    value: 'positive',
    label: 'Pozytywny',
    icon: 'sentiment_satisfied',
    color: '#2e7d32'
  },
  neutral: {
    value: 'neutral',
    label: 'Neutralny',
    icon: 'sentiment_neutral',
    color: '#757575'
  },
  negative: {
    value: 'negative',
    label: 'Negatywny',
    icon: 'sentiment_dissatisfied',
    color: '#d32f2f'
  }
};

export const PLATFORM_ICONS: Record<string, string> = {
  facebook: 'facebook',
  twitter: 'twitter',
  instagram: 'instagram',
  linkedin: 'linkedin',
  youtube: 'youtube',
  other: 'share'
};
