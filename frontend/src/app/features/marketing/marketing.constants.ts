import { CampaignStatus, CampaignType } from './marketing.models';

// --------------------------------------------
// Campaign Status Mappings
// --------------------------------------------

export const campaignStatusLabelMap: Record<CampaignStatus, string> = {
  draft: 'Szkic',
  scheduled: 'Zaplanowana',
  active: 'Aktywna',
  paused: 'Wstrzymana',
  completed: 'Zakończona',
  archived: 'Zarchiwizowana'
};

export const campaignStatusClassMap: Record<CampaignStatus, string> = {
  draft: 'status-draft',
  scheduled: 'status-scheduled',
  active: 'status-active',
  paused: 'status-paused',
  completed: 'status-completed',
  archived: 'status-archived'
};

export const campaignStatusColorMap: Record<CampaignStatus, string> = {
  draft: '#e2e8f0',
  scheduled: '#dbeafe',
  active: '#d1fae5',
  paused: '#fef3c7',
  completed: '#e0e0e0',
  archived: '#f1f5f9'
};

export const campaignStatusTextColorMap: Record<CampaignStatus, string> = {
  draft: '#334155',
  scheduled: '#1e3a8a',
  active: '#065f46',
  paused: '#92400e',
  completed: '#424242',
  archived: '#64748b'
};

// --------------------------------------------
// Campaign Type Mappings
// --------------------------------------------

export const campaignTypeIconMap: Record<CampaignType, string> = {
  email: 'email',
  sms: 'sms',
  social: 'share',
  push: 'notifications'
};

export const campaignTypeColorMap: Record<CampaignType, string> = {
  email: '#2563eb',
  sms: '#7c3aed',
  social: '#db2777',
  push: '#ea580c'
};

export const campaignTypeLabelMap: Record<CampaignType, string> = {
  email: 'Email',
  sms: 'SMS',
  social: 'Social Media',
  push: 'Push Notification'
};

// --------------------------------------------
// Filter Options
// --------------------------------------------

export const campaignStatusOptions: { value: CampaignStatus | ''; label: string }[] = [
  { value: '', label: 'Wszystkie' },
  { value: 'draft', label: 'Szkic' },
  { value: 'scheduled', label: 'Zaplanowana' },
  { value: 'active', label: 'Aktywna' },
  { value: 'paused', label: 'Wstrzymana' },
  { value: 'completed', label: 'Zakończona' },
  { value: 'archived', label: 'Zarchiwizowana' }
];

export const campaignTypeOptions: { value: CampaignType | ''; label: string }[] = [
  { value: '', label: 'Wszystkie typy' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'social', label: 'Social Media' },
  { value: 'push', label: 'Push Notification' }
];

// --------------------------------------------
// Table Column Definitions
// --------------------------------------------

export const campaignListColumns: string[] = ['name', 'type', 'status', 'scheduledAt', 'stats', 'actions'];
export const segmentListColumns: string[] = ['name', 'criteria', 'contactsCount', 'updatedAt', 'actions'];
export const templateListColumns: string[] = ['name', 'type', 'updatedAt', 'actions'];

// --------------------------------------------
// Utility Functions
// --------------------------------------------

export function getCampaignStatusLabel(status: CampaignStatus): string {
  return campaignStatusLabelMap[status] || status;
}

export function getCampaignStatusClass(status: CampaignStatus): string {
  return campaignStatusClassMap[status] || '';
}

export function getCampaignTypeIcon(type: CampaignType): string {
  return campaignTypeIconMap[type] || 'campaign';
}

export function getCampaignTypeLabel(type: CampaignType): string {
  return campaignTypeLabelMap[type] || type;
}

// --------------------------------------------
// Date Formatting
// --------------------------------------------

export const polishLocale = 'pl-PL';

export function formatDatePolish(date: Date): string {
  return new Intl.DateTimeFormat(polishLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function formatDateTimePolish(date: Date): string {
  return new Intl.DateTimeFormat(polishLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// --------------------------------------------
// Rate Calculations
// --------------------------------------------

export function calculateOpenRate(opened: number, recipients: number): number {
  if (recipients === 0) return 0;
  return Math.round((opened / recipients) * 100);
}

export function calculateClickRate(clicked: number, opened: number): number {
  if (opened === 0) return 0;
  return Math.round((clicked / opened) * 100);
}

export function calculateBounceRate(bounced: number, recipients: number): number {
  if (recipients === 0) return 0;
  return Math.round((bounced / recipients) * 100);
}
