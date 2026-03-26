import { SocialPlatform } from '../social.model';

export interface PlatformInfo {
  icon: string;
  label: string;
  color: string;
}

export const PLATFORM_INFO: Record<SocialPlatform, PlatformInfo> = {
  facebook: { icon: 'facebook', label: 'Facebook', color: '#1877f2' },
  twitter: { icon: 'twitter', label: 'Twitter', color: '#1da1f2' },
  instagram: { icon: 'instagram', label: 'Instagram', color: '#e4405f' },
  linkedin: { icon: 'linkedin', label: 'LinkedIn', color: '#0a66c2' },
  youtube: { icon: 'youtube', label: 'YouTube', color: '#cd201f' },
  other: { icon: 'public', label: 'Inne', color: '#757575' }
};
