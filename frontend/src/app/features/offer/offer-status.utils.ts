import { OfferStatus, ApprovalStatus } from './offer.model';

const statusLabelMap: Record<OfferStatus, string> = {
  draft: 'Szkic',
  sent: 'Wysłana',
  accepted: 'Zaakceptowana',
  rejected: 'Odrzucona',
  expired: 'Wygasła'
};

const statusClassMap: Record<OfferStatus, string> = {
  draft: 'status-draft',
  sent: 'status-sent',
  accepted: 'status-accepted',
  rejected: 'status-rejected',
  expired: 'status-expired'
};

const approvalStatusClassMap: Record<ApprovalStatus, string> = {
  pending: 'status-pending',
  approved: 'status-approved',
  rejected: 'status-rejected'
};

export function getStatusLabel(status: OfferStatus): string {
  return statusLabelMap[status] || status;
}

export function getStatusClass(status: OfferStatus): string {
  return statusClassMap[status] || '';
}

export function getApprovalStatusClass(status: ApprovalStatus): string {
  return approvalStatusClassMap[status] || '';
}
