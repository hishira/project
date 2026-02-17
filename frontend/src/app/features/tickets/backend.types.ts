// ============================================
// Typy wspólne (udostępniane między serwisami)
// ============================================

/** Uniwersalny identyfikator jako string (UUID lub inny format) */
type EntityId = string;

/** Podstawowe informacje o użytkowniku (kto wykonał akcję) */
interface UserInfo {
  userId: EntityId;
  userName: string;
  email?: string;
}

/** Zakres czasu */
interface DateRange {
  from: Date;
  to: Date;
}

/** Statusy zgłoszenia w CRM (przykład) */
type CrmTicketStatus = 
  | 'NEW'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_CUSTOMER'
  | 'WAITING_FOR_INTERNAL'
  | 'RESOLVED'
  | 'CLOSED';

/** Priorytety w CRM */
type CrmPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/** Kanały zgłoszenia */
type TicketChannel = 'EMAIL' | 'PHONE' | 'CHAT' | 'PORTAL' | 'INTERNAL';

// ============================================
// CRM Context – Zgłoszenie klienta
// ============================================

namespace Crm {
  /** Główna encja zgłoszenia w CRM */
  interface Ticket {
    id: EntityId;
    ticketNumber: string; // np. "CASE-2025-00123"
    title: string;
    description: string;
    status: CrmTicketStatus;
    priority: CrmPriority;
    channel: TicketChannel;
    
    // Powiązania z innymi encjami CRM
    customerId: EntityId;        // klient (konto)
    contactId?: EntityId;         // osoba kontaktowa (opcjonalna)
    contractId?: EntityId;        // umowa serwisowa
    productIds?: EntityId[];      // lista produktów, których dotyczy
    
    // Metryki SLA
    sla?: TicketSla;
    
    // Przypisania
    assignedTo?: UserInfo;
    team?: string;
    
    // Daty
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    closedAt?: Date;
    
    // Historia zdarzeń (może być przechowywana osobno)
    // events?: TicketEvent[];
  }

  /** Definicja SLA dla zgłoszenia */
  interface TicketSla {
    responseDeadline: Date;       // czas na pierwszą odpowiedź
    resolutionDeadline: Date;     // czas na rozwiązanie
    breached: boolean;            // czy przekroczono SLA
    pausedUntil?: Date;           // jeśli czekamy na klienta – SLA pauzowane
  }

  /** Zdarzenie w historii zgłoszenia (log) */
  interface TicketEvent {
    id: EntityId;
    ticketId: EntityId;
    type: TicketEventType;
    createdAt: Date;
    createdBy: UserInfo;
    description: string;
    oldValue?: any;
    newValue?: any;
    attachments?: Attachment[];
  }

  type TicketEventType = 
    | 'STATUS_CHANGED'
    | 'PRIORITY_CHANGED'
    | 'ASSIGNED'
    | 'NOTE_ADDED'
    | 'ATTACHMENT_ADDED'
    | 'CUSTOMER_REPLIED'
    | 'INTERNAL_COMMENT';

  /** Załącznik */
  interface Attachment {
    id: EntityId;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url: string;
    uploadedAt: Date;
    uploadedBy: UserInfo;
  }

  /** DTO do tworzenia nowego zgłoszenia (przez API) */
  interface CreateTicketDto {
    title: string;
    description: string;
    priority?: CrmPriority;
    channel: TicketChannel;
    customerId: EntityId;
    contactId?: EntityId;
    contractId?: EntityId;
    productIds?: EntityId[];
    attachments?: File[];
  }

  /** DTO do aktualizacji zgłoszenia */
  interface UpdateTicketDto {
    title?: string;
    description?: string;
    status?: CrmTicketStatus;
    priority?: CrmPriority;
    assignedTo?: EntityId | null;
    // ... inne pola do aktualizacji
  }

  /** Odpowiedź API z listą zgłoszeń (z paginacją) */
  interface TicketListResponse {
    items: Ticket[];
    total: number;
    page: number;
    limit: number;
  }
}

// ============================================
// Product Management Context – Issue / Task
// ============================================

namespace Pm {
  /** Typ zadania w PM */
  type PmIssueType = 'BUG' | 'FEATURE' | 'TASK' | 'EPIC';

  /** Status zadania w PM */
  type PmIssueStatus = 
    | 'BACKLOG'
    | 'TODO'
    | 'IN_PROGRESS'
    | 'IN_REVIEW'
    | 'TESTING'
    | 'DONE'
    | 'REJECTED';

  /** Priorytet w PM */
  type PmPriority = 'LOWEST' | 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGHEST';

  /** Encja zadania w PM */
  interface Issue {
    id: EntityId;
    key: string;                  // np. "PROJ-123"
    title: string;
    description: string;
    type: PmIssueType;
    status: PmIssueStatus;
    priority: PmPriority;
    
    // Powiązania
    projectId: EntityId;
    productId?: EntityId;          // opcjonalny produkt
    componentIds?: EntityId[];
    fixVersion?: string;
    
    // Relacje z innymi zadaniami
    parentIssueId?: EntityId;      // dla podzadań
    linkedIssues?: LinkedIssue[];  // blokuje, jest blokowany itp.
    
    // Przypisania
    reporter: UserInfo;
    assignee?: UserInfo;
    sprint?: string;
    
    // Metadane
    storyPoints?: number;
    
    // Daty
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    dueDate?: Date;
    
    // Pole do przechowywania referencji do zgłoszenia z CRM (jeśli powstało z ticketu)
    externalReferences?: ExternalReference[];
  }

  /** Powiązanie z innym zadaniem */
  interface LinkedIssue {
    issueId: EntityId;
    linkType: 'BLOCKS' | 'IS_BLOCKED_BY' | 'RELATES_TO' | 'DUPLICATES' | 'IS_DUPLICATED_BY';
  }

  /** Referencja do zewnętrznego systemu (np. CRM) */
  interface ExternalReference {
    system: string;               // np. "crm"
    externalId: EntityId;         // np. id zgłoszenia w CRM
    externalUrl?: string;         // link do oryginału
  }

  /** Komentarz do zadania */
  interface Comment {
    id: EntityId;
    issueId: EntityId;
    content: string;
    createdAt: Date;
    createdBy: UserInfo;
    updatedAt?: Date;
    isInternal: boolean;           // czy komentarz wewnętrzny (niewidoczny dla klienta)
  }

  /** DTO do tworzenia zadania (np. z CRM) */
  interface CreateIssueFromTicketDto {
    title: string;
    description: string;
    type: PmIssueType;
    priority?: PmPriority;
    projectId: EntityId;
    productId?: EntityId;
    reporter: UserInfo;
    externalReference: {
      system: 'crm';
      externalId: EntityId;
    };
  }
}

// ============================================
// Eventy (zdarzenia) do komunikacji między serwisami
// ============================================

namespace Events {
  /** Bazowy interfejs zdarzenia */
  interface BaseEvent {
    eventId: EntityId;
    eventType: string;
    source: string;                // system źródłowy (np. "crm", "pm")
    timestamp: Date;
    correlationId?: string;        // do śledzenia korelacji
  }

  /** Zdarzenie: nowe zgłoszenie w CRM */
  interface CrmTicketCreatedEvent extends BaseEvent {
    eventType: 'crm.ticket.created';
    data: {
      ticketId: EntityId;
      ticketNumber: string;
      title: string;
      description: string;
      priority: CrmPriority;
      customerId: EntityId;
      contactId?: EntityId;
      productIds?: EntityId[];
      createdAt: Date;
      reportedBy: UserInfo;
    };
  }

  /** Zdarzenie: zmiana statusu zgłoszenia w CRM */
  interface CrmTicketStatusChangedEvent extends BaseEvent {
    eventType: 'crm.ticket.status.changed';
    data: {
      ticketId: EntityId;
      oldStatus: CrmTicketStatus;
      newStatus: CrmTicketStatus;
      changedBy: UserInfo;
      changedAt: Date;
    };
  }

  /** Zdarzenie: nowe zadanie utworzone w PM (np. na podstawie zgłoszenia) */
  interface PmIssueCreatedEvent extends BaseEvent {
    eventType: 'pm.issue.created';
    data: {
      issueId: EntityId;
      issueKey: string;
      title: string;
      type: Pm.PmIssueType;
      status: Pm.PmIssueStatus;
      priority: Pm.PmPriority;
      projectId: EntityId;
      externalReference?: {
        system: string;
        externalId: EntityId;
      };
      createdAt: Date;
    };
  }

  /** Zdarzenie: zmiana statusu zadania w PM */
  interface PmIssueStatusChangedEvent extends BaseEvent {
    eventType: 'pm.issue.status.changed';
    data: {
      issueId: EntityId;
      issueKey: string;
      oldStatus: Pm.PmIssueStatus;
      newStatus: Pm.PmIssueStatus;
      changedBy: UserInfo;
      changedAt: Date;
      // opcjonalnie – jeśli zadanie było powiązane z CRM, można przekazać externalId
      externalId?: EntityId;
    };
  }

  /** Zdarzenie: dodanie komentarza w PM (który może być widoczny dla klienta) */
  interface PmIssueCommentAddedEvent extends BaseEvent {
    eventType: 'pm.issue.comment.added';
    data: {
      issueId: EntityId;
      commentId: EntityId;
      content: string;
      createdBy: UserInfo;
      createdAt: Date;
      isPublic: boolean;            // czy komentarz może być pokazany klientowi
      externalId?: EntityId;        // id zgłoszenia z CRM jeśli powiązane
    };
  }

  // Suma wszystkich zdarzeń (do użycia w brokerze)
  type DomainEvent = 
    | CrmTicketCreatedEvent
    | CrmTicketStatusChangedEvent
    | PmIssueCreatedEvent
    | PmIssueStatusChangedEvent
    | PmIssueCommentAddedEvent;
}

// ============================================
// System raportowy – typy dla hurtowni danych
// ============================================

namespace Reporting {
  /** Widok zgłoszenia w hurtowni (denormalizowany) */
  interface FactTicket {
    // Wymiary
    ticketId: EntityId;
    ticketNumber: string;
    sourceSystem: 'crm' | 'pm';      // z którego systemu pochodzi
    status: string;                   // status w oryginalnym systemie
    priority: string;                 // priorytet
    type?: string;                     // typ (w PM) lub kanał (w CRM)
    category?: string;                 // kategoria (jeśli istnieje)
    
    // Wymiary czasowe
    createdAt: Date;
    resolvedAt?: Date;
    closedAt?: Date;
    
    // Czas realizacji (w minutach/godzinach)
    resolutionTime?: number;            // czas od utworzenia do rozwiązania
    firstResponseTime?: number;         // czas do pierwszej odpowiedzi (CRM)
    
    // Powiązania (klucze obce do innych wymiarów)
    customerId?: EntityId;              // dla CRM
    productId?: EntityId;               // dla PM lub CRM
    assignedToId?: EntityId;
    team?: string;
    
    // Flagi
    isSlaBreached?: boolean;
  }

  /** Agregat dzienny dla raportów */
  interface DailyTicketAggregate {
    date: string;                      // YYYY-MM-DD
    sourceSystem: string;
    status: string;
    priority: string;
    count: number;
    avgResolutionTime?: number;
  }

  /** Zapytanie o raport */
  interface ReportQuery {
    dateRange: DateRange;
    sourceSystems?: string[];
    statuses?: string[];
    priorities?: string[];
    groupBy: ('status' | 'priority' | 'sourceSystem' | 'product' | 'assignedTo')[];
  }
}

// ============================================
// API Gateway / Kontrakty między serwisami
// ============================================

namespace Api {
  /** Odpowiedź błędu */
  interface ErrorResponse {
    statusCode: number;
    message: string;
    error?: string;
    details?: any;
  }

  /** Paginacja */
  interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }

  /** Filtr dla zgłoszeń CRM */
  interface CrmTicketFilter extends PaginationParams {
    status?: CrmTicketStatus | CrmTicketStatus[];
    priority?: CrmPriority | CrmPriority[];
    customerId?: EntityId;
    assignedToId?: EntityId;
    createdFrom?: Date;
    createdTo?: Date;
    search?: string;
  }

  /** Filtr dla zadań PM */
  interface PmIssueFilter extends PaginationParams {
    status?: Pm.PmIssueStatus | Pm.PmIssueStatus[];
    type?: Pm.PmIssueType | Pm.PmIssueType[];
    projectId?: EntityId;
    assigneeId?: EntityId;
    createdFrom?: Date;
    createdTo?: Date;
  }

  /** Odpowiedź z danymi do dashboardu */
  interface DashboardSummary {
    crm: {
      openTickets: number;
      avgResponseTime: number;       // w godzinach
      slaBreached: number;
    };
    pm: {
      openIssues: number;
      bugsCount: number;
      doneThisWeek: number;
    };
    // wspólne statystyki
    topCustomers: { customerId: EntityId; customerName: string; ticketCount: number }[];
    topProducts: { productId: EntityId; productName: string; issueCount: number }[];
  }
}