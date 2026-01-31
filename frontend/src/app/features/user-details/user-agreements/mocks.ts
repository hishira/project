/* eslint-disable max-lines */
import { v4 as uuidv4 } from 'uuid';

// Helper do generowania dat
const generateDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

// Tablica 5 przykładowych agreementów
const sampleAgreements = [

// ==================== AGREEMENT 1 ====================
// Aktywna, wieloletnia umowa enterprise
{
  id: uuidv4(),
  contractId: "SUB-ENT-2024-001-EU",
  title: "Enterprise Subscription Agreement - Analytics Pro Suite",
  description: "Comprehensive analytics platform for enterprise data processing",
  
  // Timestamps
  createdAt: generateDate(-400),
  updatedAt: generateDate(-30),
  deletedAt: undefined,
  
  // Versioning
  version: {
    version: "3.2.1",
    versionNumber: 5,
    previousVersionId: uuidv4(),
    isCurrent: true,
    releasedAt: generateDate(-60),
    releasedBy: "usr_mgr_001",
    breakingChanges: false,
    releaseNotes: "Added GDPR compliance module and enhanced reporting"
  },
  
  allVersions: [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()],
  isMasterContract: true,
  
  // Parties
  primaryParties: {
    partyA: {
      user: {
        id: "usr_corp_001",
        email: "procurement@globalcorp.eu",
        name: "GlobalCorp Europe GmbH",
        systemRoles: ["EXTERNAL"],
        department: "IT Procurement",
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      signingAuthority: { level: "FULL" },
      contactInfo: {
        email: "it.contracts@globalcorp.eu",
        phone: "+491234567890",
        address: "Berlin, Germany"
      },
      isPrimary: true,
      joinedAt: generateDate(-400),
      responsibilities: ["License management", "Payment approval", "User provisioning"]
    },
    partyB: {
      user: {
        id: "usr_vendor_001",
        email: "contracts@saasvendor.com",
        name: "SaaS Vendor Solutions",
        systemRoles: ["EXTERNAL"],
        department: "Sales",
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      signingAuthority: { level: "FULL" },
      contactInfo: {
        email: "support@saasvendor.com",
        phone: "+441234567890",
        address: "London, UK"
      },
      isPrimary: true,
      joinedAt: generateDate(-400),
      responsibilities: ["Technical support", "SLA compliance", "Updates delivery"]
    }
  },
  
  additionalParties: [
    {
      user: {
        id: "usr_finance_001",
        email: "finance@globalcorp.eu",
        name: "Anna Schmidt",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "FINANCE",
      signingAuthority: { level: "LIMITED" },
      contactInfo: { email: "finance@globalcorp.eu" },
      isPrimary: false,
      joinedAt: generateDate(-390),
      responsibilities: ["Payment processing"],
      addedBy: "usr_corp_001",
      addedAt: generateDate(-390),
      permissions: ["VIEW_FINANCIALS", "SEND_NOTIFICATIONS"],
      accessLevel: "LIMITED"
    }
  ],
  
  allParties: [], // Would be computed
  
  // Product & Value
  product: {
    id: "prod_analytics_ent",
    name: "Analytics Pro Suite Enterprise",
    category: "SOFTWARE_LICENSE",
    sku: "APS-ENT-EU-2024",
    
    pricingModel: "RECURRING",
    price: 45000,
    currency: "EUR",
    vatRate: 19,
    
    specifications: {
      applications: ["Data Analytics Pro", "BI Dashboard", "Predictive Models", "ETL Tools"],
      userLicenses: 250,
      storage: "10TB",
      apiCalls: "Unlimited",
      integrations: ["Salesforce", "SAP", "Oracle", "Custom APIs"]
    },
    
    sla: {
      uptimePercentage: 99.95,
      responseTime: 1,
      resolutionTime: 4,
      supportHours: "24/7/365",
      penalties: [
        {
          condition: "Uptime < 99.9%",
          penaltyAmount: 0.1,
          penaltyType: "PERCENTAGE"
        },
        {
          condition: "Critical bug resolution > 8h",
          penaltyAmount: 500,
          penaltyType: "FIXED"
        }
      ]
    },
    
    deliveryTerms: {
      implementationTime: "30 days",
      trainingIncluded: true,
      migrationSupport: true
    },
    
    tags: ["analytics", "enterprise", "bi", "data-processing"],
    customFields: {
      compliance: ["GDPR", "ISO27001", "SOC2"],
      deployment: "Private Cloud",
      dataResidency: "EU"
    }
  },
  
  totalValue: 540000, // 45000 * 12 miesięcy
  currency: "EUR",
  
  // Terms & Conditions
  clauses: [
    {
      id: "clause_sla_001",
      clauseNumber: "4.1",
      title: "Service Level Agreement",
      content: "Vendor guarantees 99.95% monthly uptime excluding scheduled maintenance.",
      type: "STANDARD",
      isMandatory: true,
      isNegotiable: false,
      category: "LIABILITY",
      variables: [
        {
          name: "uptimePercentage",
          value: 99.95,
          type: "NUMBER",
          isEditable: false
        }
      ]
    },
    {
      id: "clause_penalty_001",
      clauseNumber: "7.3",
      title: "Penalty for SLA Breach",
      content: "For each 0.1% below guaranteed uptime, 0.1% of monthly fee is credited.",
      type: "CUSTOM",
      isMandatory: true,
      isNegotiable: true,
      category: "PAYMENT",
      variables: []
    }
  ],
  
  specialConditions: [
    "Price freeze for 24 months",
    "Quarterly business reviews required",
    "90-day termination for convenience after year 2"
  ],
  
  termination: {
    noticePeriodDays: 90,
    terminationReason: ["Breach of SLA", "Non-payment", "Insolvency", "Convenience after year 2"],
    penalties: [
      {
        type: "REMAINING_VALUE",
        amount: 0.5, // 50% of remaining value
        conditions: ["Termination without cause before minimum term"]
      }
    ],
    autoRenewal: true,
    renewalNoticeDays: 60
  },
  
  // Dates
  effectiveDate: generateDate(-365),
  expirationDate: generateDate(730), // 2-year contract
  renewalDate: generateDate(670),
  signatureDeadline: generateDate(-380),
  
  // Status & Lifecycle
  status: "ACTIVE",
  statusHistory: [
    {
      from: "DRAFT",
      to: "UNDER_REVIEW",
      changedAt: generateDate(-400),
      changedBy: "usr_corp_001",
      reason: "Initial creation"
    },
    {
      from: "UNDER_REVIEW",
      to: "ACTIVE",
      changedAt: generateDate(-365),
      changedBy: "system",
      reason: "All signatures collected"
    }
  ],
  
  nextAction: {
    action: "Annual review meeting",
    dueDate: generateDate(30),
    assignedTo: "usr_mgr_001"
  },
  
  // Approvals
  currentWorkflow: {
    id: "wf_enterprise_001",
    name: "Enterprise Subscription Approval",
    steps: [
      {
        id: "step_legal",
        stepNumber: 1,
        name: "Legal Review",
        approvers: ["usr_legal_001"],
        minApprovalsRequired: 1,
        isParallel: false,
        timeoutHours: 48
      }
    ],
    isActive: true,
    version: "1.0",
    applicableTo: ["ENTERPRISE_CONTRACTS"]
  },
  
  approvals: [
    {
      id: uuidv4(),
      stepId: "step_legal",
      contractId: "SUB-ENT-2024-001-EU",
      approvedBy: "usr_legal_001",
      approvedAt: generateDate(-370),
      status: "APPROVED",
      comments: "SLA terms acceptable, penalty clauses standard"
    }
  ],
  
  // Signatures
  signatures: [
    {
      userId: "usr_corp_001",
      signedAt: generateDate(-366),
      signatureHash: "a1b2c3d4e5f6",
      signingMethod: "DIGITAL_CERTIFICATE",
      ipAddress: "192.168.1.100",
      location: { city: "Berlin", country: "DE" }
    },
    {
      userId: "usr_vendor_001",
      signedAt: generateDate(-365),
      signatureHash: "f6e5d4c3b2a1",
      signingMethod: "DIGITAL_CERTIFICATE",
      ipAddress: "10.0.0.50",
      location: { city: "London", country: "GB" }
    }
  ],
  
  requiredSignatures: 2,
  signatureOrder: ["usr_corp_001", "usr_vendor_001"],
  
  // Attachments
  attachments: [
    {
      id: uuidv4(),
      name: "SLA_Attachment.pdf",
      type: "ANNEX",
      fileUrl: "/attachments/sla_2024_001.pdf",
      mimeType: "application/pdf",
      size: 2048576,
      uploadedBy: "usr_vendor_001",
      uploadedAt: generateDate(-380),
      version: "1.0",
      isSigned: true
    }
  ],
  
  subContracts: [],
  
  // Notifications
  notificationSettings: {
    reminders: {
      daysBeforeExpiry: [90, 60, 30, 7],
      notifyRoles: ["CONTRACT_OWNER", "FINANCE"]
    },
    escalations: {
      maxResponseTimeHours: 24,
      escalationPath: ["usr_mgr_001", "usr_admin_001"]
    },
    digestSchedule: "WEEKLY"
  },
  
  pendingNotifications: [
    {
      id: uuidv4(),
      type: "REMINDER",
      recipient: "usr_corp_001",
      title: "Annual Review Approaching",
      message: "Annual contract review scheduled in 30 days",
      priority: "MEDIUM",
      isRead: false,
      createdAt: generateDate(-1),
      actionRequired: true,
      actionUrl: "/contracts/SUB-ENT-2024-001-EU/review",
      dueDate: generateDate(30)
    }
  ],
  
  // Risk & Compliance
  riskAssessment: {
    level: "LOW",
    score: 23,
    factors: [
      {
        category: "FINANCIAL",
        description: "Large contract value",
        impact: 7,
        probability: 0.3
      }
    ],
    lastAssessed: generateDate(-30),
    mitigationPlan: "Regular review meetings and performance monitoring"
  },
  
  complianceChecklist: [
    {
      requirement: "GDPR Data Processing Agreement",
      isCompliant: true,
      checkedBy: "usr_legal_001",
      checkedAt: generateDate(-350),
      evidence: "dpa_attachment_001.pdf"
    }
  ],
  
  // Financials
  paymentSchedule: [
    {
      installmentNumber: 1,
      dueDate: generateDate(-335),
      amount: 45000,
      status: "PAID",
      paidAt: generateDate(-330)
    },
    {
      installmentNumber: 2,
      dueDate: generateDate(-10),
      amount: 45000,
      status: "PENDING",
      paidAt: undefined
    }
  ],
  
  invoices: [
    {
      invoiceId: "INV-2024-001",
      amount: 45000,
      issueDate: generateDate(-340),
      dueDate: generateDate(-335),
      status: "PAID",
      url: "/invoices/INV-2024-001.pdf"
    }
  ],
  
  // Reporting
  tags: ["enterprise", "analytics", "multi-year", "high-value"],
  categories: ["Software", "Subscription", "B2B"],
  
  customFields: {
    businessUnit: "EMEA",
    costCenter: "CC-IT-001",
    procurementMethod: "RFP",
    vendorTier: "Strategic"
  },
  
  // Metadata
  metadata: {
    internalNotes: "Key strategic vendor, relationship manager: John Doe",
    renewalProbability: 0.9,
    csatScore: 4.7
  },
  
  auditLog: [
    {
      id: uuidv4(),
      action: "CONTRACT_CREATED",
      performedBy: "usr_corp_001",
      performedAt: generateDate(-400),
      changes: {},
      ipAddress: "192.168.1.100"
    }
  ]
},

// ==================== AGREEMENT 2 ====================
// Miesięczna umowa dla małej firmy (wygasła)
{
  id: uuidv4(),
  contractId: "SUB-SMB-2024-002-M",
  title: "Monthly CRM Subscription - Startup Package",
  description: "Basic CRM for small business customer management",
  
  createdAt: generateDate(-120),
  updatedAt: generateDate(-10),
  
  version: {
    version: "1.0.0",
    versionNumber: 1,
    isCurrent: true,
    releasedAt: generateDate(-120),
    releasedBy: "usr_vendor_002",
    breakingChanges: false
  },
  
  allVersions: [uuidv4()],
  isMasterContract: false,
  
  primaryParties: {
    partyA: {
      user: {
        id: "usr_smb_001",
        email: "owner@smallshop.de",
        name: "SmallShop GmbH",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      signingAuthority: { level: "FULL" },
      contactInfo: {
        email: "contact@smallshop.de",
        phone: "+491234567"
      },
      isPrimary: true,
      joinedAt: generateDate(-120),
      responsibilities: ["Payment"]
    },
    partyB: {
      user: {
        id: "usr_vendor_002",
        email: "sales@crmvendor.com",
        name: "CRM Vendor Inc",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      signingAuthority: { level: "FULL" },
      isPrimary: true,
      joinedAt: generateDate(-120)
    }
  },
  
  additionalParties: [],
  
  product: {
    id: "prod_crm_basic",
    name: "CRM Basic Monthly",
    category: "SOFTWARE_LICENSE",
    
    pricingModel: "RECURRING",
    price: 299,
    currency: "EUR",
    vatRate: 19,
    
    specifications: {
      applications: ["CRM Basic"],
      userLicenses: 5,
      storage: "50GB",
      features: ["Contact Management", "Email Integration", "Basic Reporting"]
    },
    
    sla: {
      uptimePercentage: 99.5,
      responseTime: 4,
      resolutionTime: 24,
      supportHours: "9-18 CET Weekdays",
      penalties: [
        {
          condition: "Uptime < 99%",
          penaltyAmount: 0.5,
          penaltyType: "PERCENTAGE"
        }
      ]
    },
    
    tags: ["crm", "small-business", "monthly"],
    customFields: {}
  },
  
  totalValue: 299,
  currency: "EUR",
  
  clauses: [
    {
      id: "clause_monthly_001",
      clauseNumber: "3.1",
      title: "Monthly Billing",
      content: "Subscription automatically renews monthly unless cancelled 7 days before renewal.",
      type: "STANDARD",
      isMandatory: true,
      isNegotiable: false,
      category: "PAYMENT",
      variables: [
        {
          name: "cancellationNotice",
          value: 7,
          type: "NUMBER",
          isEditable: false
        }
      ]
    }
  ],
  
  specialConditions: ["14-day free trial period applied"],
  
  termination: {
    noticePeriodDays: 7,
    terminationReason: ["Non-payment", "Breach of TOS"],
    autoRenewal: true,
    renewalNoticeDays: 7
  },
  
  effectiveDate: generateDate(-90),
  expirationDate: generateDate(-1), // WYGASŁA WCZORAJ
  renewalDate: undefined,
  
  status: "EXPIRED",
  statusHistory: [
    {
      from: "DRAFT",
      to: "ACTIVE",
      changedAt: generateDate(-90),
      changedBy: "usr_smb_001",
      reason: "Signed after trial"
    },
    {
      from: "ACTIVE",
      to: "EXPIRED",
      changedAt: generateDate(-1),
      changedBy: "system",
      reason: "Auto-renewal cancelled by customer"
    }
  ],
  
  signatures: [
    {
      userId: "usr_smb_001",
      signedAt: generateDate(-90),
      signatureHash: "xyz123",
      signingMethod: "EMAIL"
    }
  ],
  
  requiredSignatures: 1,
  signatureOrder: ["usr_smb_001"],
  
  attachments: [],
  subContracts: [],
  
  notificationSettings: {
    reminders: {
      daysBeforeExpiry: [7, 3, 1],
      notifyRoles: ["CONTRACT_OWNER"]
    },
    escalations: {
      maxResponseTimeHours: 48,
      escalationPath: []
    },
    digestSchedule: "DAILY"
  },
  
  pendingNotifications: [],
  
  riskAssessment: {
    level: "LOW",
    score: 15,
    factors: [],
    lastAssessed: generateDate(-90)
  },
  
  paymentSchedule: [
    {
      installmentNumber: 1,
      dueDate: generateDate(-90),
      amount: 299,
      status: "PAID",
      paidAt: generateDate(-89)
    },
    {
      installmentNumber: 2,
      dueDate: generateDate(-60),
      amount: 299,
      status: "PAID"
    },
    {
      installmentNumber: 3,
      dueDate: generateDate(-30),
      amount: 299,
      status: "PAID"
    }
  ],
  
  tags: ["crm", "monthly", "expired", "small-business"],
  categories: ["Software", "Subscription"],
  
  customFields: {
    customerSegment: "SMB",
    acquisitionChannel: "Organic Search"
  },
  
  metadata: {
    churnReason: "Found cheaper alternative",
    lifetimeValue: 897
  },
  
  auditLog: []
},

// ==================== AGREEMENT 3 ====================
// Umowa w trakcie negocjacji (PENDING_APPROVAL)
{
  id: uuidv4(),
  contractId: "SUB-MID-2024-003-P",
  title: "Project Management Suite - Team Edition",
  description: "Advanced project management tools for mid-size team",
  
  createdAt: generateDate(-15),
  updatedAt: generateDate(-1),
  
  version: {
    version: "2.1.0",
    versionNumber: 3,
    isCurrent: true,
    releasedAt: generateDate(-2),
    releasedBy: "usr_vendor_003",
    breakingChanges: true,
    releaseNotes: "Added AI features and increased storage"
  },
  
  allVersions: [uuidv4(), uuidv4(), uuidv4()],
  isMasterContract: false,
  
  primaryParties: {
    partyA: {
      user: {
        id: "usr_mid_001",
        email: "director@techagency.com",
        name: "Tech Agency LLC",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      signingAuthority: { level: "FULL" },
      isPrimary: true,
      joinedAt: generateDate(-15)
    },
    partyB: {
      user: {
        id: "usr_vendor_003",
        email: "enterprise@pmvendor.com",
        name: "PM Solutions Corp",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      isPrimary: true,
      joinedAt: generateDate(-15)
    }
  },
  
  product: {
    id: "prod_pm_team",
    name: "Project Management Team Edition",
    category: "SOFTWARE_LICENSE",
    
    pricingModel: "TIERED",
    price: 1250,
    currency: "EUR",
    vatRate: 19,
    
    specifications: {
      applications: ["PM Pro", "Time Tracking", "Resource Planning"],
      userLicenses: 25,
      storage: "500GB",
      aiFeatures: ["Predictive Analytics", "Automated Reporting"]
    },
    
    sla: {
      uptimePercentage: 99.9,
      responseTime: 2,
      resolutionTime: 8,
      supportHours: "8-20 CET",
      penalties: []
    },
    
    tags: ["project-management", "team", "mid-market"],
    customFields: {}
  },
  
  totalValue: 15000, // Rocznie
  currency: "EUR",
  
  clauses: [
    {
      id: "clause_trial_001",
      clauseNumber: "2.3",
      title: "Pilot Period",
      content: "30-day pilot with full features before commitment",
      type: "CUSTOM",
      isMandatory: true,
      isNegotiable: false,
      category: "GENERAL",
      variables: [
        {
          name: "pilotDays",
          value: 30,
          type: "NUMBER",
          isEditable: false
        }
      ]
    }
  ],
  
  effectiveDate: generateDate(15), // W PRZYSZŁOŚCI
  expirationDate: generateDate(380), // 12 miesięcy
  signatureDeadline: generateDate(5),
  
  status: "PENDING_APPROVAL",
  statusHistory: [
    {
      from: "DRAFT",
      to: "UNDER_REVIEW",
      changedAt: generateDate(-10),
      changedBy: "usr_mid_001",
      reason: "Sent for legal review"
    },
    {
      from: "UNDER_REVIEW",
      to: "PENDING_APPROVAL",
      changedAt: generateDate(-2),
      changedBy: "usr_legal_002",
      reason: "Legal approved, awaiting finance"
    }
  ],
  
  nextAction: {
    action: "Finance department approval",
    dueDate: generateDate(3),
    assignedTo: "usr_finance_002"
  },
  
  approvals: [
    {
      id: uuidv4(),
      stepId: "step_legal",
      contractId: "SUB-MID-2024-003-P",
      approvedBy: "usr_legal_002",
      approvedAt: generateDate(-2),
      status: "APPROVED",
      comments: "Standard terms acceptable"
    }
  ],
  
  signatures: [],
  requiredSignatures: 2,
  
  tags: ["pending", "project-management", "annual"],
  categories: ["Software", "Subscription"],
  
  customFields: {
    dealStage: "Negotiation",
    competitor: "Asana",
    decisionMaker: "CTO"
  },
  
  metadata: {
    estimatedCloseDate: generateDate(5),
    dealProbability: 0.7
  }
},

// ==================== AGREEMENT 4 ====================
// Aktywna miesięczna umowa z wieloma aplikacjami
{
  id: uuidv4(),
  contractId: "SUB-BUNDLE-2024-004-A",
  title: "Productivity Bundle - Monthly Subscription",
  description: "Bundle of 3 applications: Email Marketing, CRM Lite, and Analytics Basic",
  
  createdAt: generateDate(-60),
  updatedAt: generateDate(-5),
  
  version: {
    version: "1.0.0",
    versionNumber: 1,
    isCurrent: true,
    releasedAt: generateDate(-60),
    releasedBy: "system",
    breakingChanges: false
  },
  
  primaryParties: {
    partyA: {
      user: {
        id: "usr_freelancer_001",
        email: "freelancer@example.com",
        name: "Jane Doe - Freelancer",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      isPrimary: true,
      joinedAt: generateDate(-60)
    },
    partyB: {
      user: {
        id: "usr_vendor_001",
        email: "vendor@saasbundle.com",
        name: "SaaS Bundle Provider",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      isPrimary: true,
      joinedAt: generateDate(-60)
    }
  },
  
  product: {
    id: "prod_bundle_monthly",
    name: "Productivity Bundle Monthly",
    category: "SOFTWARE_LICENSE",
    
    pricingModel: "RECURRING",
    price: 89,
    currency: "EUR",
    vatRate: 19,
    
    specifications: {
      applications: ["Email Marketing Basic", "CRM Lite", "Analytics Basic"],
      userLicenses: 1,
      storage: "100GB total",
      features: ["Cross-app integration", "Basic templates", "Standard support"]
    },
    
    sla: {
      uptimePercentage: 99.7,
      responseTime: 6,
      resolutionTime: 48,
      supportHours: "Email only",
      penalties: []
    },
    
    tags: ["bundle", "monthly", "freelancer", "multiple-apps"],
    customFields: {
      bundleDiscount: "40% off individual apps"
    }
  },
  
  totalValue: 89,
  currency: "EUR",
  
  effectiveDate: generateDate(-59),
  expirationDate: generateDate(30), // Auto-renew za 30 dni
  renewalDate: generateDate(25),
  
  status: "ACTIVE",
  
  signatures: [
    {
      userId: "usr_freelancer_001",
      signedAt: generateDate(-59),
      signatureHash: "sig456",
      signingMethod: "EMAIL"
    }
  ],
  
  requiredSignatures: 1,
  
  paymentSchedule: [
    {
      installmentNumber: 1,
      dueDate: generateDate(-59),
      amount: 89,
      status: "PAID"
    },
    {
      installmentNumber: 2,
      dueDate: generateDate(-30),
      amount: 89,
      status: "PAID"
    },
    {
      installmentNumber: 3,
      dueDate: generateDate(0), // Dziś
      amount: 89,
      status: "PENDING"
    }
  ],
  
  tags: ["active", "bundle", "monthly", "multiple-apps", "b2c"],
  categories: ["Software", "Bundle", "Subscription"],
  
  metadata: {
    customerType: "Individual",
    usageLevel: "Medium",
    favoriteApp: "Email Marketing"
  }
},

// ==================== AGREEMENT 5 ====================
// Wieloletnia umowa strategiczna (ACTIVE, 3 lata)
{
  id: uuidv4(),
  contractId: "SUB-STRAT-2024-005-L",
  title: "Strategic Partnership - Full Platform Access",
  description: "Full access to all vendor applications for enterprise partnership",
  
  createdAt: generateDate(-730), // 2 lata temu
  updatedAt: generateDate(-30),
  
  version: {
    version: "4.0.0",
    versionNumber: 7,
    previousVersionId: uuidv4(),
    isCurrent: true,
    releasedAt: generateDate(-180),
    releasedBy: "usr_vendor_exec",
    breakingChanges: true,
    releaseNotes: "Added 5 new applications to platform"
  },
  
  allVersions: Array(7).fill(null).map(() => uuidv4()),
  isMasterContract: true,
  
  primaryParties: {
    partyA: {
      user: {
        id: "usr_enterprise_001",
        email: "cio@largecorp.eu",
        name: "LargeCorp International",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      isPrimary: true,
      joinedAt: generateDate(-730)
    },
    partyB: {
      user: {
        id: "usr_vendor_strategic",
        email: "ceo@platformvendor.com",
        name: "Platform Vendor Global",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      isPrimary: true,
      joinedAt: generateDate(-730)
    }
  },
  
  additionalParties: [
    {
      user: {
        id: "usr_enterprise_it",
        email: "it.director@largecorp.eu",
        name: "IT Department",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "EXECUTOR",
      isPrimary: false,
      joinedAt: generateDate(-720),
      addedBy: "usr_enterprise_001",
      addedAt: generateDate(-720),
      permissions: ["VIEW_CONTRACT", "MANAGE_PARTIES"],
      accessLevel: "FULL"
    }
  ],
  
  product: {
    id: "prod_full_platform",
    name: "Full Platform Enterprise",
    category: "SOFTWARE_LICENSE",
    
    pricingModel: "HYBRID",
    price: 125000,
    currency: "EUR",
    vatRate: 19,
    
    specifications: {
      applications: [
        "CRM Enterprise", 
        "ERP Suite", 
        "HR Management", 
        "Accounting Pro",
        "Business Intelligence",
        "Marketing Automation",
        "Customer Support",
        "Custom Development Tools"
      ],
      userLicenses: "Unlimited",
      storage: "Petabyte-scale",
      dedicatedSupport: "Account manager + technical team",
      customDevelopment: "100 hours/month included"
    },
    
    sla: {
      uptimePercentage: 99.99,
      responseTime: 0.5,
      resolutionTime: 2,
      supportHours: "24/7 with 15-minute response guarantee",
      penalties: [
        {
          condition: "Uptime < 99.99%",
          penaltyAmount: 1,
          penaltyType: "PERCENTAGE"
        },
        {
          condition: "Critical incident > 1h",
          penaltyAmount: 5000,
          penaltyType: "FIXED"
        }
      ]
    },
    
    tags: ["strategic", "full-platform", "enterprise", "multi-year", "partnership"],
    customFields: {
      partnershipLevel: "Platinum",
      jointMarketing: true,
      coDevelopment: true,
      revenueShare: "15% on referrals"
    }
  },
  
  totalValue: 4500000, // 3 lata × 1.5M rocznie
  currency: "EUR",
  
  effectiveDate: generateDate(-730),
  expirationDate: generateDate(365), // Kończy się za rok
  renewalDate: generateDate(300),
  
  status: "ACTIVE",
  statusHistory: [
    {
      from: "ACTIVE",
      to: "SUSPENDED",
      changedAt: generateDate(-90),
      changedBy: "system",
      reason: "Payment delay - resolved within grace period"
    },
    {
      from: "SUSPENDED",
      to: "ACTIVE",
      changedAt: generateDate(-88),
      changedBy: "usr_finance_001",
      reason: "Payment received"
    }
  ],
  
  signatures: [
    {
      userId: "usr_enterprise_001",
      signedAt: generateDate(-730),
      signatureHash: "strat001",
      signingMethod: "DIGITAL_CERTIFICATE"
    },
    {
      userId: "usr_vendor_strategic",
      signedAt: generateDate(-730),
      signatureHash: "strat002",
      signingMethod: "DIGITAL_CERTIFICATE"
    }
  ],
  
  requiredSignatures: 2,
  
  subContracts: [
    {
      id: uuidv4(),
      parentContractId: "SUB-STRAT-2024-005-L",
      title: "Addendum: Additional Development Hours",
      type: "ADDENDUM",
      effectiveDate: generateDate(-180),
      content: "Adds 200 development hours per quarter",
      changesSummary: ["Increased development hours from 100 to 200/month"],
      requiresSeparateSignatures: false,
      status: "ACTIVE"
    }
  ],
  
  paymentSchedule: [
    {
      installmentNumber: 9,
      dueDate: generateDate(-30),
      amount: 125000,
      status: "PAID"
    },
    {
      installmentNumber: 10,
      dueDate: generateDate(30),
      amount: 125000,
      status: "PENDING"
    }
  ],
  
  tags: ["strategic", "enterprise", "multi-app", "high-value", "partnership"],
  categories: ["Software", "Platform", "Strategic"],
  
  customFields: {
    businessImpact: "Mission Critical",
    vendorRelationship: "Strategic Partner",
    renewalPriority: "Highest"
  },
  
  metadata: {
    partnershipScore: 92,
    executiveSponsor: "CEO on both sides",
    jointCustomers: 15,
    yearlyGrowth: "35%"
  },
  
  riskAssessment: {
    level: "MEDIUM",
    score: 45,
    factors: [
      {
        category: "OPERATIONAL",
        description: "High dependency on single vendor",
        impact: 9,
        probability: 0.4
      }
    ],
    lastAssessed: generateDate(-30),
    mitigationPlan: "Regular architecture reviews and exit strategy planning"
  }
}
];

// Eksport tablicy
export { sampleAgreements };