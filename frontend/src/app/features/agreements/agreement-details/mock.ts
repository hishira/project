export const agreement = {
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