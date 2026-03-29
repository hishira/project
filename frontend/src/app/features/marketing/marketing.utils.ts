export interface StatusColorConfig {
  [key: string]: string;
}

export interface TypeIconConfig {
  [key: string]: string;
}

export const CAMPAIGN_STATUS_COLORS: StatusColorConfig = {
  draft: '#f1f5f9',
  scheduled: '#fef3c7',
  active: '#dbeafe',
  paused: '#ffe4e6',
  completed: '#dcfce7',
  archived: '#e2e8f0',
};

export const CAMPAIGN_STATUS_TEXT_COLORS: StatusColorConfig = {
  draft: '#334155',
  scheduled: '#92400e',
  active: '#1e3a8a',
  paused: '#9f1239',
  completed: '#166534',
  archived: '#475569',
};

export const CAMPAIGN_TYPE_ICONS: TypeIconConfig = {
  email: 'email',
  sms: 'sms',
  social: 'share',
  push: 'notifications',
};

export const CAMPAIGN_TYPE_COLORS: TypeIconConfig = {
  email: '#2563eb',
  sms: '#7c3aed',
  social: '#db2777',
  push: '#ea580c',
};

/**
 * Returns the background color for a given campaign status
 */
export function getCampaignStatusColor(status: string): string {
  return CAMPAIGN_STATUS_COLORS[status.toLowerCase()] || '#e2e8f0';
}

/**
 * Returns the text color for a given campaign status
 */
export function getCampaignStatusTextColor(status: string): string {
  return CAMPAIGN_STATUS_TEXT_COLORS[status.toLowerCase()] || '#475569';
}

/**
 * Returns the CSS class for a given campaign status
 */
export function getCampaignStatusClass(status: string): string {
  const map: Record<string, string> = {
    draft: 'status-draft',
    scheduled: 'status-scheduled',
    active: 'status-active',
    paused: 'status-paused',
    completed: 'status-completed',
    archived: 'status-archived',
  };
  return map[status.toLowerCase()] || '';
}

/**
 * Returns the icon for a given campaign type
 */
export function getCampaignTypeIcon(type: string): string {
  return CAMPAIGN_TYPE_ICONS[type.toLowerCase()] || 'campaign';
}

/**
 * Returns the color for a given campaign type
 */
export function getCampaignTypeColor(type: string): string {
  return CAMPAIGN_TYPE_COLORS[type.toLowerCase()] || '#64748b';
}

/**
 * Calculates the open rate percentage
 */
export function calculateOpenRate(opened: number, recipients: number): number {
  if (!recipients) return 0;
  return Math.round((opened / recipients) * 100 * 10) / 10;
}

/**
 * Calculates the click rate percentage
 */
export function calculateClickRate(clicked: number, opened: number): number {
  if (!opened) return 0;
  return Math.round((clicked / opened) * 100 * 10) / 10;
}
