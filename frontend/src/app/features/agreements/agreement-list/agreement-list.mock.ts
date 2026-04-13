import { AgreementStatusType, Agreement } from '../types';

export interface AgreementListItem {
  id: string;
  contractId: string;
  title: string;
  clientName: string;
  status: AgreementStatusType;
  totalValue: number;
  currency: string;
  effectiveDate: Date;
  expirationDate: Date;
  productCategory: string;
  riskLevel: string;
  tags: string[];
}

export const mockAgreements: AgreementListItem[] = [
  {
    id: 'agr-001',
    contractId: 'SUB-SMB-2024-002-M',
    title: 'CRM Subscription - Startup Package',
    clientName: 'SmallShop GmbH',
    status: 'ACTIVE',
    totalValue: 299,
    currency: 'EUR',
    effectiveDate: new Date('2023-10-01'),
    expirationDate: new Date('2024-10-01'),
    productCategory: 'SOFTWARE_LICENSE',
    riskLevel: 'LOW',
    tags: ['crm', 'monthly', 'small-business']
  },
  {
    id: 'agr-002',
    contractId: 'ENT-2024-015-A',
    title: 'Enterprise Support Agreement',
    clientName: 'TechCorp Industries',
    status: 'ACTIVE',
    totalValue: 15000,
    currency: 'PLN',
    effectiveDate: new Date('2024-01-15'),
    expirationDate: new Date('2025-01-15'),
    productCategory: 'SERVICE',
    riskLevel: 'MEDIUM',
    tags: ['enterprise', 'support', 'annual']
  },
  {
    id: 'agr-003',
    contractId: 'HW-2024-008-S',
    title: 'Hardware Lease Agreement',
    clientName: 'Logistics Plus Sp. z o.o.',
    status: 'PENDING',
    totalValue: 8500,
    currency: 'PLN',
    effectiveDate: new Date('2024-03-01'),
    expirationDate: new Date('2026-03-01'),
    productCategory: 'HARDWARE',
    riskLevel: 'HIGH',
    tags: ['hardware', 'lease', 'logistics']
  },
  {
    id: 'agr-004',
    contractId: 'SUB-2023-042-M',
    title: 'Cloud Storage Subscription',
    clientName: 'Design Studio XYZ',
    status: 'EXPIRED',
    totalValue: 49,
    currency: 'EUR',
    effectiveDate: new Date('2023-06-01'),
    expirationDate: new Date('2024-06-01'),
    productCategory: 'SUBSCRIPTION',
    riskLevel: 'LOW',
    tags: ['cloud', 'storage', 'monthly']
  },
  {
    id: 'agr-005',
    contractId: 'SRV-2024-023-A',
    title: 'Consulting Services Agreement',
    clientName: 'FinanceFlow Ltd',
    status: 'DRAFT',
    totalValue: 25000,
    currency: 'PLN',
    effectiveDate: new Date('2024-04-01'),
    expirationDate: new Date('2024-12-31'),
    productCategory: 'SERVICE',
    riskLevel: 'MEDIUM',
    tags: ['consulting', 'finance', 'quarterly']
  },
  {
    id: 'agr-006',
    contractId: 'SUB-2024-067-M',
    title: 'Marketing Automation Platform',
    clientName: 'E-Commerce Solutions',
    status: 'ACTIVE',
    totalValue: 599,
    currency: 'EUR',
    effectiveDate: new Date('2024-02-01'),
    expirationDate: new Date('2025-02-01'),
    productCategory: 'SOFTWARE_LICENSE',
    riskLevel: 'LOW',
    tags: ['marketing', 'automation', 'saas']
  }
];
