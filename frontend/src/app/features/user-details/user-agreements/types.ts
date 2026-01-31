/* eslint-disable max-lines */
// ==================== CORE TYPES ====================

interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  archivedAt?: Date;
}

interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  changes: Record<string, { old: any; new: any }>;
  ipAddress?: string;
  userAgent?: string;
}

// ==================== USER & ROLES ====================

type SystemRole = 
  | 'SUPER_ADMIN'     // Full system access
  | 'ADMIN'           // System administration
  | 'MANAGER'         // Team/Department management
  | 'EMPLOYEE'        // Regular employee
  | 'GUEST'           // Temporary/limited access
  | 'EXTERNAL'        // External partner
  | 'SYSTEM'          // Automated system actions
  | 'UNKNOWN';        // Unauthenticated/legacy

type ContractRole =
  | 'CONTRACT_OWNER'      // Primary responsible
  | 'CONTRACT_MANAGER'    // Manages contract execution
  | 'SIGNATORY'          // Authorized to sign
  | 'APPROVER'           // Approval authority
  | 'REVIEWER'           // Legal/compliance review
  | 'WITNESS'            // Contract witness
  | 'GUARANTOR'          // Third-party guarantor
  | 'BENEFICIARY'        // Benefits from contract
  | 'OBSERVER'           // Read-only access
  | 'AUDITOR'            // Audit access
  | 'EXECUTOR'           // Executes obligations
  | 'FINANCE'           // Financial oversight
  | 'LEGAL'             ; // Legal department

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  systemRoles: SystemRole[];
  department?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

// ==================== CONTRACT VERSIONING ====================

interface ContractVersion {
  version: string; // Format: "1.0.0" or "2024.01.001"
  versionNumber: number;
  previousVersionId?: string;
  nextVersionId?: string;
  isCurrent: boolean;
  releasedAt: Date;
  releasedBy: string;
  releaseNotes?: string;
  breakingChanges: boolean;
  diffSummary?: Record<string, any>;
}

// ==================== PRODUCT/SERVICE TYPES ====================

type ProductCategory = 
  | 'SOFTWARE_LICENSE'
  | 'CLOUD_SERVICE'
  | 'CONSULTING'
  | 'MAINTENANCE'
  | 'TRAINING'
  | 'HARDWARE'
  | 'SUPPORT'
  | 'CUSTOM_DEVELOPMENT'
  | 'OUTSOURCING'
  | 'LEASING';

interface ContractProduct {
  id: string;
  name: string;
  category: ProductCategory;
  sku?: string;
  
  // Pricing
  pricingModel: 'FIXED' | 'TIERED' | 'USAGE_BASED' | 'RECURRING' | 'HYBRID';
  price: number;
  currency: string;
  vatRate: number;
  
  // Details
  specifications: Record<string, any>;
  sla?: ServiceLevelAgreement;
  deliveryTerms?: DeliveryTerms;
  
  // Metadata
  tags: string[];
  customFields: Record<string, any>;
}

interface ServiceLevelAgreement {
  uptimePercentage: number;
  responseTime: number;
  resolutionTime: number;
  supportHours: string;
  penalties: SLAPenalty[];
}

interface SLAPenalty {
  condition: string;
  penaltyAmount: number;
  penaltyType: 'PERCENTAGE' | 'FIXED';
}

// ==================== CONTRACT TERMS & CONDITIONS ====================

interface ContractClause {
  id: string;
  clauseNumber: string;
  title: string;
  content: string;
  type: 'STANDARD' | 'CUSTOM' | 'REGULATORY';
  isMandatory: boolean;
  isNegotiable: boolean;
  category: 'GENERAL' | 'PAYMENT' | 'TERMINATION' | 'LIABILITY' | 'CONFIDENTIALITY';
  variables: ClauseVariable[];
}

interface ClauseVariable {
  name: string;
  value: any;
  type: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'SELECT';
  options?: any[];
  isEditable: boolean;
}

interface TerminationClause {
  noticePeriodDays: number;
  terminationReason?: string[];
  penalties?: TerminationPenalty[];
  autoRenewal: boolean;
  renewalNoticeDays: number;
}

interface TerminationPenalty {
  type: 'FIXED_FEE' | 'REMAINING_VALUE' | 'NEGOTIATED';
  amount: number;
  conditions: string[];
}

// ==================== APPROVAL WORKFLOW ====================

type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';

interface ApprovalStep {
  id: string;
  stepNumber: number;
  name: string;
  approvers: string[]; // User IDs
  minApprovalsRequired: number;
  isParallel: boolean;
  timeoutHours?: number;
  conditions?: ApprovalCondition[];
}

interface ApprovalCondition {
  field: string;
  operator: 'EQUALS' | 'GREATER_THAN' | 'CONTAINS' | 'IN';
  value: any;
}

interface Approval {
  id: string;
  stepId: string;
  contractId: string;
  approvedBy: string;
  approvedAt: Date;
  status: ApprovalStatus;
  comments?: string;
  attachments?: string[]; // Attachment IDs
}

interface Workflow {
  id: string;
  name: string;
  steps: ApprovalStep[];
  isActive: boolean;
  version: string;
  applicableTo: string[]; // Contract types/categories
}

// ==================== NOTIFICATIONS ====================

type NotificationType = 
  | 'CONTRACT_EXPIRY'
  | 'APPROVAL_REQUIRED'
  | 'SIGNATURE_REQUIRED'
  | 'PAYMENT_DUE'
  | 'SLA_BREACH'
  | 'AUDIT_TRAIL'
  | 'STATUS_CHANGE'
  | 'DOCUMENT_UPDATE'
  | 'REMINDER'
  | 'ESCALATION';

interface Notification {
  id: string;
  type: NotificationType;
  recipient: string; // User ID or role
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isRead: boolean;
  createdAt: Date;
  actionRequired: boolean;
  actionUrl?: string;
  dueDate?: Date;
  metadata: Record<string, any>;
}

interface NotificationPreference {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  digestFrequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY';
  mutedTypes: NotificationType[];
}

// ==================== ATTACHMENTS & SUB-CONTRACTS ====================

interface DocumentAttachment {
  id: string;
  name: string;
  type: 'CONTRACT' | 'AMENDMENT' | 'ADDENDUM' | 'ANNEX' | 'CERTIFICATE' | 'OTHER';
  fileUrl: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  version: string;
  isSigned: boolean;
  signatureMetadata?: SignatureMetadata;
  encryptionKey?: string;
}

interface SubContract {
  id: string;
  parentContractId: string;
  title: string;
  type: 'AMENDMENT' | 'ADDENDUM' | 'SIDE_LETTER' | 'SCHEDULE';
  effectiveDate: Date;
  content: string;
  changesSummary: string[];
  requiresSeparateSignatures: boolean;
  status: ContractStatus;
}

// ==================== REPORTING & ANALYTICS ====================

interface ReportFilter {
  dateRange?: { start: Date; end: Date };
  contractStatus?: ContractStatus[];
  productCategories?: ProductCategory[];
  departments?: string[];
  valueRange?: { min: number; max: number };
  riskLevel?: RiskLevel[];
}

interface AnalyticsMetric {
  totalContracts: number;
  totalValue: number;
  activeContracts: number;
  expiringThisMonth: number;
  avgContractDuration: number;
  approvalRate: number;
  avgApprovalTime: number;
  slaComplianceRate: number;
}

interface RiskAssessment {
  level: RiskLevel;
  score: number;
  factors: RiskFactor[];
  lastAssessed: Date;
  mitigationPlan?: string;
}

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface RiskFactor {
  category: 'FINANCIAL' | 'LEGAL' | 'OPERATIONAL' | 'COMPLIANCE' | 'REPUTATIONAL';
  description: string;
  impact: number; // 1-10
  probability: number; // 0-1
}

// ==================== MAIN CONTRACT INTERFACE ====================

interface Contract<TProduct = ContractProduct, TMetadata = any> extends Timestamps {
  // Basic Identification
  id: string;
  contractId: string; // Human-readable: CNT-2024-001
  externalId?: string; // ID from external system
  title: string;
  description?: string;
  
  // Versioning
  version: ContractVersion;
  allVersions: string[]; // IDs of all versions
  isMasterContract: boolean;
  parentContractId?: string; // For sub-contracts
  
  // Parties
  primaryParties: {
    partyA: ContractParty;
    partyB: ContractParty;
  };
  additionalParties: AdditionalParty[];
  allParties: ContractParty[]; // Computed field
  
  // Product & Value
  product: TProduct;
  totalValue: number;
  currency: string;
  
  // Terms & Conditions
  clauses: ContractClause[];
  specialConditions: string[];
  termination: TerminationClause;
  
  // Dates
  effectiveDate: Date;
  expirationDate?: Date;
  renewalDate?: Date;
  signatureDeadline?: Date;
  
  // Status & Lifecycle
  status: ContractStatus;
  statusHistory: StatusChange[];
  nextAction?: {
    action: string;
    dueDate: Date;
    assignedTo: string;
  };
  
  // Approvals
  currentWorkflow?: Workflow;
  approvals: Approval[];
  nextApprovalStep?: ApprovalStep;
  
  // Signatures
  signatures: DigitalSignature[];
  requiredSignatures: number;
  signatureOrder: string[]; // User IDs in order
  
  // Attachments & Documents
  attachments: DocumentAttachment[];
  subContracts: SubContract[];
  
  // Notifications
  notificationSettings: NotificationSettings;
  pendingNotifications: Notification[];
  
  // Risk & Compliance
  riskAssessment: RiskAssessment;
  complianceChecklist: ComplianceItem[];
  
  // Financials
  paymentSchedule: PaymentSchedule[];
  invoices: InvoiceReference[];
  
  // Reporting
  tags: string[];
  categories: string[];
  customFields: Record<string, any>;
  
  // Metadata
  metadata: TMetadata;
  auditLog: AuditLog[];
}

// ==================== SUPPORTING INTERFACES ====================

type ContractStatus = 
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PENDING_SIGNATURES'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'EXPIRED'
  | 'TERMINATED'
  | 'RENEWED'
  | 'ARCHIVED';

interface ContractParty {
  user: User;
  contractRole: ContractRole;
  signingAuthority: SigningAuthority;
  contactInfo: ContactInfo;
  isPrimary: boolean;
  joinedAt: Date;
  responsibilities: string[];
}

interface AdditionalParty extends ContractParty {
  addedBy: string;
  addedAt: Date;
  validUntil?: Date;
  permissions: PartyPermission[];
  accessLevel: 'FULL' | 'LIMITED' | 'VIEW_ONLY';
}

type PartyPermission = 
  | 'VIEW_CONTRACT'
  | 'EDIT_DETAILS'
  | 'MANAGE_PARTIES'
  | 'APPROVE_CHANGES'
  | 'UPLOAD_DOCUMENTS'
  | 'VIEW_FINANCIALS'
  | 'SEND_NOTIFICATIONS'
  | 'TERMINATE_CONTRACT';

interface DigitalSignature {
  userId: string;
  signedAt: Date;
  signatureHash: string;
  certificate?: string;
  signingMethod: 'DIGITAL_CERTIFICATE' | 'EMAIL' | 'SMS' | 'BIOMETRIC';
  ipAddress?: string;
  location?: Geolocation;
}

interface StatusChange {
  from: ContractStatus;
  to: ContractStatus;
  changedAt: Date;
  changedBy: string;
  reason: string;
  comments?: string;
}

interface NotificationSettings {
  reminders: {
    daysBeforeExpiry: number[];
    notifyRoles: ContractRole[];
  };
  escalations: {
    maxResponseTimeHours: number;
    escalationPath: string[]; // User IDs
  };
  digestSchedule: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

interface ComplianceItem {
  requirement: string;
  isCompliant: boolean;
  checkedBy?: string;
  checkedAt?: Date;
  evidence?: string; // Document ID or URL
  dueDate?: Date;
}

interface PaymentSchedule {
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'WAIVED';
  paidAt?: Date;
  invoiceId?: string;
}

interface InvoiceReference {
  invoiceId: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
  url?: string;
}

// ==================== REPORT TYPES ====================

interface ContractReport {
  type: ReportType;
  filters: ReportFilter;
  generatedAt: Date;
  generatedBy: string;
  data: ReportData;
  format: 'PDF' | 'EXCEL' | 'JSON' | 'CSV';
}

type ReportType = 
  | 'CONTRACTS_OVERVIEW'
  | 'FINANCIAL_SUMMARY'
  | 'EXPIRY_FORECAST'
  | 'COMPLIANCE_STATUS'
  | 'RISK_ASSESSMENT'
  | 'APPROVAL_METRICS'
  | 'VENDOR_PERFORMANCE'
  | 'SLA_COMPLIANCE'
  | 'COST_ANALYSIS'
  | 'CUSTOM_REPORT';

interface ReportData {
  summary: AnalyticsMetric;
  contracts: Contract[];
  charts: ChartData[];
  recommendations?: string[];
  risks?: RiskFactor[];
}

interface ChartData {
  type: 'BAR' | 'LINE' | 'PIE' | 'HEATMAP';
  title: string;
  data: Record<string, any>[];
  xAxis: string;
  yAxis: string;
}

// ==================== EXAMPLE USAGE ====================

// Example: Creating a complex contract
const enterpriseContract: Contract = {
  id: "cnt_ent_2024_001",
  contractId: "CNT-ENTERPRISE-2024-001",
  title: "Enterprise Cloud Services Agreement",
  description: "Comprehensive cloud services agreement with SLA guarantees",
  
  createdAt: new Date(),
  updatedAt: new Date(),
  
  version: {
    version: "2.1.0",
    versionNumber: 3,
    previousVersionId: "cnt_ent_2023_002",
    isCurrent: true,
    releasedAt: new Date("2024-01-15"),
    releasedBy: "usr_admin_001",
    breakingChanges: false,
    releaseNotes: "Added new SLA terms for disaster recovery"
  },
  
  primaryParties: {
    partyA: {
      user: {
        id: "usr_client_001",
        email: "client@enterprise.com",
        name: "Enterprise Corp",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      signingAuthority: { level: "FULL" },
      contactInfo: { email: "legal@enterprise.com", phone: "+123456789" },
      isPrimary: true,
      joinedAt: new Date(),
      responsibilities: ["Payment", "User management"]
    },
    partyB: {
      user: {
        id: "usr_provider_001",
        email: "provider@cloud.com",
        name: "Cloud Services Inc",
        systemRoles: ["EXTERNAL"],
        isActive: true
      },
      contractRole: "CONTRACT_OWNER",
      signingAuthority: { level: "FULL" },
      contactInfo: { email: "sales@cloud.com", phone: "+987654321" },
      isPrimary: true,
      joinedAt: new Date(),
      responsibilities: ["Service delivery", "Support"]
    }
  },
  
  // ... rest of the implementation would continue
};

// Example: Report generation function
async function generateContractReport(
  type: ReportType,
  filters: ReportFilter
): Promise<ContractReport> {
  // Implementation would fetch data, calculate metrics, etc.
  return {
    type,
    filters,
    generatedAt: new Date(),
    generatedBy: "system",
    data: {
      summary: {
        totalContracts: 150,
        totalValue: 5000000,
        activeContracts: 120,
        expiringThisMonth: 8,
        avgContractDuration: 365,
        approvalRate: 0.95,
        avgApprovalTime: 2.5,
        slaComplianceRate: 0.98
      },
      contracts: [],
      charts: []
    },
    format: "PDF"
  };
}