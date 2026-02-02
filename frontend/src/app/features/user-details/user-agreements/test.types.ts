// Podstawowy typ dla pojedynczego agreementu w liście
export interface UserAgreementItem {
  // Identifikatory
  id: string;
  agreementId: string;
  agreementNumber: string;
  
  // Podstawowe informacje
  title: string;
  type: 'SALES_CONTRACT' | 'SERVICE_AGREEMENT' | 'SLA' | 'PARTNER_AGREEMENT' | 'NDA' | 'SUBSCRIPTION' | 'LICENSE';
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'TERMINATED' | 'ARCHIVED';
  
  // Strony umowy (zdenormalizowane dla UI)
  customerName: string;
  customerId: string;
  vendorName: string;
  vendorId: string;
  
  // Daty
  effectiveDate: Date;
  expirationDate?: Date;
  lastUpdated: Date;
  
  // Wartości finansowe
  totalValue: number;
  currency: string;
  
  // Status ryzyka
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  
  // Proces podpisywania
  signatures: {
    completed: number;
    required: number;
    status: 'PENDING' | 'PARTIAL' | 'COMPLETE';
  };
  
  // Flagi dla UI
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysUntilExpiry?: number;
  requiresAttention: boolean;
  
  // Role użytkownika w tej umowie
  userRole: 'OWNER' | 'SIGNATORY' | 'VIEWER' | 'APPROVER' | 'EDITOR';
  permissions: string[]; // np. ['view', 'edit', 'sign', 'delete']
  
  // Metadane dla UI
  tags: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  unreadNotifications?: number;
}

// Typ dla listy agreementów użytkownika
export interface UserAgreementsList {
  // Lista agreementów
  items: UserAgreementItem[];
  
  // Paginacja
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  
  // Filtry i sortowanie
  filters: {
    status?: string[];
    type?: string[];
    dateRange?: {
      from?: Date;
      to?: Date;
    };
    searchQuery?: string;
  };
  
  sort: {
    field: 'title' | 'effectiveDate' | 'expirationDate' | 'totalValue' | 'riskScore' | 'lastUpdated';
    direction: 'asc' | 'desc';
  };
  
  // Statystyki dla użytkownika
  stats: {
    total: number;
    active: number;
    expiringSoon: number;
    expired: number;
    pendingSignature: number;
    highRisk: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
  
  // Metadane odpowiedzi
  timestamp: Date;
  userId: string;
}

// Typ dla prostszej wersji (mobile/compact)
export interface CompactUserAgreement {
  id: string;
  agreementNumber: string;
  title: string;
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'PENDING_APPROVAL';
  customerName: string;
  effectiveDate: Date;
  totalValue: number;
  currency: string;
  requiresAttention: boolean;
  userRole: string;
}

// Typ dla grupowania agreementów (np. po statusie/dacie)
export interface GroupedUserAgreements {
  [groupKey: string]: UserAgreementItem[];
}

// Typ dla dashboardu użytkownika
export interface UserAgreementsDashboard {
  // Najważniejsze agreementy
  highPriority: UserAgreementItem[];
  awaitingAction: UserAgreementItem[];
  recentlyUpdated: UserAgreementItem[];
  
  // Statystyki
  summary: {
    totalValue: number;
    averageRisk: number;
    signatureCompletionRate: number;
    renewalRate: number;
  };
  
  // Nadchodzące terminy
  upcomingDeadlines: {
    agreementId: string;
    title: string;
    deadline: Date;
    type: 'EXPIRATION' | 'RENEWAL' | 'REVIEW' | 'DELIVERY';
    daysUntil: number;
  }[];
}

export const userAgreementsList: UserAgreementsList = {
  items: [
    {
      id: '1',
      agreementId: 'AG-2023-001',
      agreementNumber: '2023/001',
      title: 'Umowa serwisowa XYZ Corp',
      type: 'SERVICE_AGREEMENT',
      status: 'ACTIVE',
      customerName: 'XYZ Corporation',
      customerId: 'cust-123',
      vendorName: 'Tech Solutions SA',
      vendorId: 'vend-456',
      effectiveDate: new Date('2023-01-01'),
      expirationDate: new Date('2023-12-31'),
      lastUpdated: new Date('2023-05-15'),
      totalValue: 50000,
      currency: 'PLN',
      riskLevel: 'MEDIUM',
      riskScore: 45,
      signatures: {
        completed: 2,
        required: 2,
        status: 'COMPLETE'
      },
      isExpired: false,
      isExpiringSoon: true,
      daysUntilExpiry: 45,
      requiresAttention: true,
      userRole: 'OWNER',
      permissions: ['view', 'edit', 'delete'],
      tags: ['serwis', 'roczna', 'pilne'],
      priority: 'HIGH',
      unreadNotifications: 2
    },
    {
      id: '2',
      agreementId: 'AG-2023-002',
      agreementNumber: '2023/002',
      title: 'NDA z Startup ABC',
      type: 'NDA',
      status: 'ACTIVE',
      customerName: 'Startup ABC Sp. z o.o.',
      customerId: 'cust-456',
      vendorName: 'Tech Solutions SA',
      vendorId: 'vend-456',
      effectiveDate: new Date('2023-03-01'),
      lastUpdated: new Date('2023-03-01'),
      totalValue: 0,
      currency: 'PLN',
      riskLevel: 'LOW',
      riskScore: 15,
      signatures: {
        completed: 1,
        required: 2,
        status: 'PARTIAL'
      },
      isExpired: false,
      isExpiringSoon: false,
      requiresAttention: false,
      userRole: 'SIGNATORY',
      permissions: ['view', 'sign'],
      tags: ['NDA', 'startup'],
      priority: 'LOW'
    }
  ],
  
  pagination: {
    page: 1,
    limit: 20,
    totalItems: 125,
    totalPages: 7,
    hasNextPage: true,
    hasPrevPage: false
  },
  
  filters: {
    status: ['ACTIVE'],
    searchQuery: 'serwis'
  },
  
  sort: {
    field: 'expirationDate',
    direction: 'asc'
  },
  
  stats: {
    total: 125,
    active: 85,
    expiringSoon: 12,
    expired: 8,
    pendingSignature: 5,
    highRisk: 3,
    byType: {
      'SERVICE_AGREEMENT': 45,
      'SALES_CONTRACT': 30,
      'NDA': 25,
      'SUBSCRIPTION': 20,
      'LICENSE': 5
    },
    byStatus: {
      'ACTIVE': 85,
      'DRAFT': 15,
      'EXPIRED': 8,
      'PENDING_APPROVAL': 10,
      'SUSPENDED': 7
    }
  },
  
  timestamp: new Date(),
  userId: 'user-789'
};