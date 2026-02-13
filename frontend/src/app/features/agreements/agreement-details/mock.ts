type AgreementStatus = 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'DRAFT' | 'PENDING';
type ProductCategory = 'SOFTWARE_LICENSE' | 'HARDWARE' | 'SERVICE' | 'SUBSCRIPTION';
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';

// Główne interfejsy
export interface Agreement {
  id: string;
  contractId: string;
  title: string;
  description: string;
  status: AgreementStatus;            // np. 'EXPIRED'
  version: Version;
  product: Product;
  primaryParties: PrimaryParties;
  totalValue: number;
  currency: string;                   // np. 'EUR', 'USD'
  effectiveDate: Date;
  expirationDate: Date;
  signatures: Signature[];
  tags: string[];
  riskAssessment: RiskAssessment;
  paymentSchedule: PaymentScheduleItem[];
}

export interface Version {
  version: string;                    // np. '1.0.0'
  versionNumber: number;               // np. 1
}

export interface Product {
  name: string;                        // np. 'CRM Basic Monthly'
  category: ProductCategory;            // np. 'SOFTWARE_LICENSE'
  price: number;                        // np. 299
  specifications: Specifications;
}

export interface Specifications {
  applications: string[];               // np. ['CRM Basic']
  userLicenses: number;                 // np. 5
}

export interface PrimaryParties {
  partyA: Party;
  partyB: Party;
}

export interface Party {
  name: string;                         // np. 'SmallShop GmbH'
  email: string;                         // np. 'owner@smallshop.de'
}

export interface Signature {
  userId: string;                        // np. 'usr_smb_001'
  signedAt: Date;                         // np. new Date('2023-10-01')
}

export interface RiskAssessment {
  level: RiskLevel;                       // np. 'LOW'
  score: number;                           // np. 15
}

export interface PaymentScheduleItem {
  installmentNumber: number;               // np. 1
  dueDate: Date;                             // np. new Date('2023-10-01')
  amount: number;                             // np. 299
  status: PaymentStatus;                       // np. 'PAID'
}

export const agreement: Agreement = {
    id: '2',
    contractId: 'SUB-SMB-2024-002-M',
    title: 'Monthly CRM Subscription - Startup Package',
    description: 'Basic CRM for small business customer management',
    status: 'EXPIRED',
    version: {
        version: '1.0.0',
        versionNumber: 1
    },
    product: {
        name: 'CRM Basic Monthly',
        category: 'SOFTWARE_LICENSE',
        price: 299,
        specifications: {
            applications: ['CRM Basic'],
            userLicenses: 5
        }
    },
    primaryParties: {
        partyA: {
            name: 'SmallShop GmbH',
            email: 'owner@smallshop.de'
        },
        partyB: {
            name: 'CRM Vendor Inc',
            email: 'sales@crmvendor.com'
        }
    },
    totalValue: 299,
    currency: 'EUR',
    effectiveDate: new Date('2023-10-01'),
    expirationDate: new Date('2023-12-31'),
    signatures: [
        { userId: 'usr_smb_001', signedAt: new Date('2023-10-01') }
    ],
    tags: ['crm', 'monthly', 'small-business'],
    riskAssessment: {
        level: 'LOW',
        score: 15
    },
    paymentSchedule: [
        { installmentNumber: 1, dueDate: new Date('2023-10-01'), amount: 299, status: 'PAID' }
    ]
};