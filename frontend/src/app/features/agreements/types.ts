export enum AgreementStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    DRAFT = 'DRAFT',
    SUSPENDED = 'SUSPENDED',
}
export type AgreementStatusColor = 'accent' | 'warn' | 'primary' | 'basic';

export enum AgreementRiskStatus {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

// Agreement interfaces
export type AgreementStatusType = 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'DRAFT' | 'PENDING';
export type ProductCategory = 'SOFTWARE_LICENSE' | 'HARDWARE' | 'SERVICE' | 'SUBSCRIPTION';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';

export interface Agreement {
  id: string;
  contractId: string;
  title: string;
  description: string;
  status: AgreementStatusType;
  version: Version;
  product: Product;
  primaryParties: PrimaryParties;
  totalValue: number;
  currency: string;
  effectiveDate: Date;
  expirationDate: Date;
  signatures: Signature[];
  tags: string[];
  riskAssessment: RiskAssessment;
  paymentSchedule: PaymentScheduleItem[];
}

export interface Version {
  version: string;
  versionNumber: number;
}

export interface Product {
  name: string;
  category: ProductCategory;
  price: number;
  specifications: Specifications;
}

export interface Specifications {
  applications: string[];
  userLicenses: number;
}

export interface PrimaryParties {
  partyA: Party;
  partyB: Party;
}

export interface Party {
  name: string;
  email: string;
}

export interface Signature {
  userId: string;
  signedAt: Date;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
}

export interface PaymentScheduleItem {
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  status: PaymentStatus;
}

