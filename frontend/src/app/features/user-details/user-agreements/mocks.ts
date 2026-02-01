/* eslint-disable max-lines */

import { AgreementTableItem, Contract } from './types';

// Helper do generowania dat
const generateDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};
const uuidv4 = ()=>'2344-3455-345345-345-34-53-45-4';

  function getSampleData(index: number): any {
        const sampleData = [
            {
                id: '1',
                contractId: 'SUB-ENT-2024-001-EU',
                title: 'Enterprise Subscription Agreement - Analytics Pro Suite',
                description: 'Comprehensive analytics platform for enterprise data processing',
                status: 'ACTIVE',
                version: {
                    version: '3.2.1',
                    versionNumber: 5
                },
                product: {
                    name: 'Analytics Pro Suite Enterprise',
                    category: 'SOFTWARE_LICENSE',
                    price: 45000,
                    specifications: {
                        applications: ['Data Analytics Pro', 'BI Dashboard', 'Predictive Models', 'ETL Tools'],
                        userLicenses: 250
                    }
                },
                primaryParties: {
                    partyA: {
                        name: 'GlobalCorp Europe GmbH',
                        email: 'procurement@globalcorp.eu'
                    },
                    partyB: {
                        name: 'SaaS Vendor Solutions',
                        email: 'contracts@saasvendor.com'
                    }
                },
                totalValue: 540000,
                currency: 'EUR',
                effectiveDate: new Date('2023-01-15'),
                expirationDate: new Date('2025-01-14'),
                signatures: [
                    { userId: 'usr_corp_001', signedAt: new Date('2023-01-14') },
                    { userId: 'usr_vendor_001', signedAt: new Date('2023-01-15') }
                ],
                tags: ['enterprise', 'analytics', 'multi-year', 'high-value'],
                riskAssessment: {
                    level: 'LOW',
                    score: 23
                },
                paymentSchedule: [
                    { installmentNumber: 1, dueDate: new Date('2023-02-14'), amount: 45000, status: 'PAID' }
                ]
            },
            {
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
            },
            {
                id: '3',
                contractId: 'SUB-MID-2024-003-P',
                title: 'Project Management Suite - Team Edition',
                description: 'Advanced project management tools for mid-size team',
                status: 'PENDING_APPROVAL',
                version: {
                    version: '2.1.0',
                    versionNumber: 3
                },
                product: {
                    name: 'Project Management Team Edition',
                    category: 'SOFTWARE_LICENSE',
                    price: 1250,
                    specifications: {
                        applications: ['PM Pro', 'Time Tracking', 'Resource Planning'],
                        userLicenses: 25
                    }
                },
                primaryParties: {
                    partyA: {
                        name: 'Tech Agency LLC',
                        email: 'director@techagency.com'
                    },
                    partyB: {
                        name: 'PM Solutions Corp',
                        email: 'enterprise@pmvendor.com'
                    }
                },
                totalValue: 15000,
                currency: 'EUR',
                effectiveDate: new Date('2024-01-30'),
                expirationDate: new Date('2024-12-31'),
                signatures: [],
                tags: ['pending', 'project-management', 'annual'],
                riskAssessment: {
                    level: 'MEDIUM',
                    score: 35
                },
                paymentSchedule: []
            },
            {
                id: '4',
                contractId: 'SUB-BUNDLE-2024-004-A',
                title: 'Productivity Bundle - Monthly Subscription',
                description: 'Bundle of 3 applications: Email Marketing, CRM Lite, and Analytics Basic',
                status: 'ACTIVE',
                version: {
                    version: '1.0.0',
                    versionNumber: 1
                },
                product: {
                    name: 'Productivity Bundle Monthly',
                    category: 'SOFTWARE_LICENSE',
                    price: 89,
                    specifications: {
                        applications: ['Email Marketing Basic', 'CRM Lite', 'Analytics Basic'],
                        userLicenses: 1
                    }
                },
                primaryParties: {
                    partyA: {
                        name: 'Jane Doe - Freelancer',
                        email: 'freelancer@example.com'
                    },
                    partyB: {
                        name: 'SaaS Bundle Provider',
                        email: 'vendor@saasbundle.com'
                    }
                },
                totalValue: 89,
                currency: 'EUR',
                effectiveDate: new Date('2023-11-10'),
                expirationDate: new Date('2024-01-31'),
                signatures: [
                    { userId: 'usr_freelancer_001', signedAt: new Date('2023-11-10') }
                ],
                tags: ['bundle', 'monthly', 'multiple-apps'],
                riskAssessment: {
                    level: 'LOW',
                    score: 12
                },
                paymentSchedule: [
                    { installmentNumber: 1, dueDate: new Date('2023-11-10'), amount: 89, status: 'PAID' }
                ]
            },
            {
                id: '5',
                contractId: 'SUB-STRAT-2024-005-L',
                title: 'Strategic Partnership - Full Platform Access',
                description: 'Full access to all vendor applications for enterprise partnership',
                status: 'ACTIVE',
                version: {
                    version: '4.0.0',
                    versionNumber: 7
                },
                product: {
                    name: 'Full Platform Enterprise',
                    category: 'SOFTWARE_LICENSE',
                    price: 125000,
                    specifications: {
                        applications: ['CRM Enterprise', 'ERP Suite', 'HR Management', 'Accounting Pro'],
                        userLicenses: 'Unlimited'
                    }
                },
                primaryParties: {
                    partyA: {
                        name: 'LargeCorp International',
                        email: 'cio@largecorp.eu'
                    },
                    partyB: {
                        name: 'Platform Vendor Global',
                        email: 'ceo@platformvendor.com'
                    }
                },
                totalValue: 4500000,
                currency: 'EUR',
                effectiveDate: new Date('2022-01-15'),
                expirationDate: new Date('2024-12-31'),
                signatures: [
                    { userId: 'usr_enterprise_001', signedAt: new Date('2022-01-15') },
                    { userId: 'usr_vendor_strategic', signedAt: new Date('2022-01-15') }
                ],
                tags: ['strategic', 'enterprise', 'partnership'],
                riskAssessment: {
                    level: 'MEDIUM',
                    score: 45,
                    mitigationPlan: 'Regular architecture reviews and exit strategy planning'
                },
                paymentSchedule: [
                    { installmentNumber: 9, dueDate: new Date('2023-12-15'), amount: 125000, status: 'PAID' }
                ]
            }
        ];

        return sampleData[index];
    }
  

 const smnallSamples = [
        {
            id: '1',
            contractId: 'SUB-ENT-2024-001-EU',
            title: 'Enterprise Subscription Agreement - Analytics Pro Suite',
            status: 'ACTIVE',
            statusDisplay: 'Active',
            productName: 'Analytics Pro Suite Enterprise',
            customer: 'GlobalCorp Europe GmbH',
            vendor: 'SaaS Vendor Solutions',
            effectiveDate: new Date('2023-01-15'),
            expirationDate: new Date('2025-01-14'),
            totalValue: 540000,
            currency: 'EUR',
            riskLevel: 'LOW',
            riskScore: 23,
            signaturesCount: 2,
            requiredSignatures: 2,
            fullData: getSampleData(0)
        },
        {
            id: '2',
            contractId: 'SUB-SMB-2024-002-M',
            title: 'Monthly CRM Subscription - Startup Package',
            status: 'EXPIRED',
            statusDisplay: 'Expired',
            productName: 'CRM Basic Monthly',
            customer: 'SmallShop GmbH',
            vendor: 'CRM Vendor Inc',
            effectiveDate: new Date('2023-10-01'),
            expirationDate: new Date('2023-12-31'),
            totalValue: 299,
            currency: 'EUR',
            riskLevel: 'LOW',
            riskScore: 15,
            signaturesCount: 1,
            requiredSignatures: 1,
            fullData: getSampleData(1)
        },
        {
            id: '3',
            contractId: 'SUB-MID-2024-003-P',
            title: 'Project Management Suite - Team Edition',
            status: 'PENDING_APPROVAL',
            statusDisplay: 'Pending Approval',
            productName: 'Project Management Team Edition',
            customer: 'Tech Agency LLC',
            vendor: 'PM Solutions Corp',
            effectiveDate: new Date('2024-01-30'),
            expirationDate: new Date('2024-12-31'),
            totalValue: 15000,
            currency: 'EUR',
            riskLevel: 'MEDIUM',
            riskScore: 35,
            signaturesCount: 0,
            requiredSignatures: 2,
            fullData: getSampleData(2)
        },
        {
            id: '4',
            contractId: 'SUB-BUNDLE-2024-004-A',
            title: 'Productivity Bundle - Monthly Subscription',
            status: 'ACTIVE',
            statusDisplay: 'Active',
            productName: 'Productivity Bundle Monthly',
            customer: 'Jane Doe - Freelancer',
            vendor: 'SaaS Bundle Provider',
            effectiveDate: new Date('2023-11-10'),
            expirationDate: new Date('2024-01-31'),
            totalValue: 89,
            currency: 'EUR',
            riskLevel: 'LOW',
            riskScore: 12,
            signaturesCount: 1,
            requiredSignatures: 1,
            fullData: getSampleData(3)
        },
        {
            id: '5',
            contractId: 'SUB-STRAT-2024-005-L',
            title: 'Strategic Partnership - Full Platform Access',
            status: 'ACTIVE',
            statusDisplay: 'Active',
            productName: 'Full Platform Enterprise',
            customer: 'LargeCorp International',
            vendor: 'Platform Vendor Global',
            effectiveDate: new Date('2022-01-15'),
            expirationDate: new Date('2024-12-31'),
            totalValue: 4500000,
            currency: 'EUR',
            riskLevel: 'MEDIUM',
            riskScore: 45,
            signaturesCount: 2,
            requiredSignatures: 2,
            fullData: getSampleData(4)
        }
    ];


// Eksport tablicy
export {  smnallSamples };