// raports.utils.ts

import {
  DEFAULT_AVATAR_COLOR,
  DEFAULT_AVATAR_LETTER,
  DEFAULT_ICON,
  EXPIRING_SOON_DAYS,
  REPORT_TYPE_AVATAR_COLORS,
  REPORT_TYPE_AVATAR_LETTERS,
  REPORT_TYPE_ICONS,
  SOURCE_SYSTEM_DISPLAY_NAMES
} from './raports.constants';
import { ReportType } from './types';

/**
 * Gets the icon for a given report type
 */
export function getIconForType(type: ReportType): string {
  return REPORT_TYPE_ICONS[type] || DEFAULT_ICON;
}

/**
 * Gets the avatar letter for a given report type
 */
export function getAvatarLetter(type: ReportType): string {
  return REPORT_TYPE_AVATAR_LETTERS[type] || DEFAULT_AVATAR_LETTER;
}

/**
 * Gets the avatar color for a given report type
 */
export function getAvatarColor(type: ReportType): string {
  return REPORT_TYPE_AVATAR_COLORS[type] || DEFAULT_AVATAR_COLOR;
}

/**
 * Formats the source system name for display
 */
export function formatSourceSystem(system: string): string {
  return SOURCE_SYSTEM_DISPLAY_NAMES[system] || system;
}

/**
 * Checks if a report is expiring soon (within EXPIRING_SOON_DAYS days)
 */
export function isExpiringSoon(expiresAt: Date): boolean {
  const now = new Date();
  const diffDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= EXPIRING_SOON_DAYS && diffDays >= 0;
}

/**
 * Checks if data is suitable for table display
 */
export function isTableData(data: any): boolean {
  return Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';
}

/**
 * Gets table column names from data
 */
export function getTableColumns(data: any[]): string[] {
  if (data.length === 0) return [];
  return Object.keys(data[0]);
}

/**
 * Checks if data is a summary object (not an array)
 */
export function isSummaryObject(data: any): boolean {
  return data && typeof data === 'object' && !Array.isArray(data);
}