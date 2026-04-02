export type OfferStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface OfferItem {
  id: string;
  productId?: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  netPrice: number;
  discountPercent?: number; // rabat %
  vatRate: number;
  netAmount: number;        // quantity * netPrice * (1 - discountPercent/100)
  vatAmount: number;
  grossAmount: number;
}

export interface OfferVersion {
  version: number;
  createdAt: Date;
  createdBy: string;
  changes: string;
  data: Partial<Offer>;
}

export interface Approval {
  id: string;
  status: ApprovalStatus;
  requestedBy: string;
  requestedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  comments?: string;
}

export interface Offer {
  id: string;
  number: string;
  title: string;
  description?: string;
  clientId: string;
  clientName: string;
  issueDate: Date;
  validUntil: Date;
  status: OfferStatus;
  items: OfferItem[];
  totalNet: number;
  totalVat: number;
  totalGross: number;
  currency: string;
  notes?: string;
  tags?: string[];
  currentVersion: number;
  versions: OfferVersion[];
  approvals: Approval[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}