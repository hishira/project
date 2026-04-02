import { OfferStatus } from './offer.model';

export interface OfferStatusColorConfig {
  [key: string]: string;
}

export interface OfferStatusLabelConfig {
  [key: string]: string;
}

export const OFFER_STATUS_COLORS: OfferStatusColorConfig = {
  draft: '#e2e8f0',
  sent: '#dbeafe',
  accepted: '#d1fae5',
  rejected: '#fee2e2',
  expired: '#f1f5f9',
};

export const OFFER_STATUS_TEXT_COLORS: OfferStatusColorConfig = {
  draft: '#334155',
  sent: '#1e3a8a',
  accepted: '#065f46',
  rejected: '#b91c1c',
  expired: '#64748b',
};

export const OFFER_STATUS_LABELS: OfferStatusLabelConfig = {
  draft: 'Szkic',
  sent: 'Wysłana',
  accepted: 'Zaakceptowana',
  rejected: 'Odrzucona',
  expired: 'Wygasła',
};

export const OFFER_STATUS_OPTIONS: { value: OfferStatus; label: string }[] = [
  { value: 'draft', label: 'Szkic' },
  { value: 'sent', label: 'Wysłana' },
  { value: 'accepted', label: 'Zaakceptowana' },
  { value: 'rejected', label: 'Odrzucona' },
  { value: 'expired', label: 'Wygasła' }
];

/**
 * Returns the background color for a given offer status
 */
export function getOfferStatusColor(status: OfferStatus | string): string {
  return OFFER_STATUS_COLORS[status] || '#e2e8f0';
}

/**
 * Returns the text color for a given offer status
 */
export function getOfferStatusTextColor(status: OfferStatus | string): string {
  return OFFER_STATUS_TEXT_COLORS[status] || '#334155';
}

/**
 * Returns the CSS class for a given offer status
 */
export function getOfferStatusClass(status: OfferStatus | string): string {
  return `status-${status}`;
}

/**
 * Returns the label for a given offer status
 */
export function getOfferStatusLabel(status: OfferStatus | string): string {
  return OFFER_STATUS_LABELS[status] || status;
}
