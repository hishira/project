import { Mention, Sentiment, SocialPlatform } from '../social.model';

export const DISPLAYED_COLUMNS: string[] = [
  'platform',
  'author',
  'content',
  'sentiment',
  'engagement',
  'postedAt',
  'actions'
];

export const PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'other', label: 'Inne' }
];

export const SENTIMENTS: { value: Sentiment; label: string }[] = [
  { value: 'positive', label: 'Pozytywny' },
  { value: 'neutral', label: 'Neutralny' },
  { value: 'negative', label: 'Negatywny' }
];
