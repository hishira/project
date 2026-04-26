// raports.constants.ts

import { ReportFormat, ReportType } from './types';

/** Mapping of report types to their display icons */
export const REPORT_TYPE_ICONS: Record<ReportType, string> = {
  dashboard: 'dashboard',
  tabular: 'table_rows',
  summary: 'summarize',
  detailed: 'list_alt',
  custom: 'extension'
};

/** Mapping of report types to their avatar letters */
export const REPORT_TYPE_AVATAR_LETTERS: Record<ReportType, string> = {
  dashboard: 'D',
  tabular: 'T',
  summary: 'S',
  detailed: 'Sz',
  custom: 'C'
};

/** Mapping of report types to their avatar colors */
export const REPORT_TYPE_AVATAR_COLORS: Record<ReportType, string> = {
  dashboard: '#bbdefb',
  tabular: '#fff9c4',
  summary: '#c8e6c9',
  detailed: '#d1c4e9',
  custom: '#ffccbc'
};

/** Mapping of source systems to their display names */
export const SOURCE_SYSTEM_DISPLAY_NAMES: Record<string, string> = {
  'crm': 'CRM',
  'product-management': 'Product',
  'other': 'Inne'
};

/** Default avatar color for unknown types */
export const DEFAULT_AVATAR_COLOR = '#e0e0e0';

/** Default icon for unknown types */
export const DEFAULT_ICON = 'description';

/** Default avatar letter for unknown types */
export const DEFAULT_AVATAR_LETTER = 'R';

/** Number of days to consider a report as expiring soon */
export const EXPIRING_SOON_DAYS = 7;