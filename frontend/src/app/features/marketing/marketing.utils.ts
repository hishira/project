// Re-export all constants and utilities from the centralized constants file
export {
  // Status mappings
  campaignStatusLabelMap,
  campaignStatusClassMap,
  campaignStatusColorMap,
  campaignStatusTextColorMap,
  campaignStatusOptions,

  // Type mappings
  campaignTypeIconMap,
  campaignTypeColorMap,
  campaignTypeLabelMap,
  campaignTypeOptions,

  // Table columns
  campaignListColumns,
  segmentListColumns,
  templateListColumns,

  // Utility functions
  getCampaignStatusLabel,
  getCampaignStatusClass,
  getCampaignTypeIcon,
  getCampaignTypeLabel,

  // Date formatting
  polishLocale,
  formatDatePolish,
  formatDateTimePolish,

  // Rate calculations
  calculateOpenRate,
  calculateClickRate,
  calculateBounceRate
} from './marketing.constants';

// Legacy backward compatibility - deprecated
export function getCampaignStatusColor(status: string): string {
  const { campaignStatusColorMap } = require('./marketing.constants');
  return campaignStatusColorMap[status.toLowerCase() as keyof typeof campaignStatusColorMap] || '#e2e8f0';
}

export function getCampaignStatusTextColor(status: string): string {
  const { campaignStatusTextColorMap } = require('./marketing.constants');
  return campaignStatusTextColorMap[status.toLowerCase() as keyof typeof campaignStatusTextColorMap] || '#475569';
}

export function getCampaignTypeColor(type: string): string {
  const { campaignTypeColorMap } = require('./marketing.constants');
  return campaignTypeColorMap[type.toLowerCase() as keyof typeof campaignTypeColorMap] || '#64748b';
}
