import { LevelColorConfig, LevelIconConfig } from './loyalty.model';

export const LEVEL_COLORS: LevelColorConfig = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  platinum: '#e5e4e2',
};

export const LEVEL_ICONS: LevelIconConfig = {
  bronze: 'emoji_events',
  silver: 'emoji_events',
  gold: 'emoji_events',
  platinum: 'workspace_premium',
};

/**
 * Returns the color for a given loyalty level
 */
export function getLevelColor(level: string): string {
  return LEVEL_COLORS[level.toLowerCase()] || '#757575';
}

/**
 * Returns the icon for a given loyalty level
 */
export function getLevelIcon(level: string): string {
  return LEVEL_ICONS[level.toLowerCase()] || 'stars';
}

/**
 * Calculates the progress bar width percentage
 */
export function getProgressWidth(points: number, nextThreshold: number | undefined): number {
  if (!nextThreshold) return 100;
  return Math.min(100, (points / nextThreshold) * 100);
}
