// ==================== Typy wspólne ====================

export type TicketType = 'crm' | 'pm'; // CRM ticket lub PM issue
export type TicketStatus = 'new' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed' | 'todo' | 'doing' | 'done';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketChannel = 'email' | 'phone' | 'chat' | 'portal' | 'internal';
export type UserRole = 'agent' | 'manager' | 'developer' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  author: User;
  isInternal: boolean; // komentarz wewnętrzny (niewidoczny dla klienta)
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number; // w bajtach
  mimeType: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: User;
}

// ==================== Encje domenowe ====================

export interface BaseTicket {
  id: string;
  ticketNumber: string; // np. "REQ-1234" lub "BUG-5678"
  type: TicketType;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  assignedTo?: User;
  tags: string[];
  comments: Comment[];
  attachments: Attachment[];
}

export interface CrmTicket extends BaseTicket {
  type: 'crm';
  customer: User; // klient (może być inny niż createdBy)
  account?: string; // nazwa firmy
  channel: TicketChannel;
  slaDeadline?: Date; // deadline SLA
  contractId?: string; // powiązanie z umową
  product?: string; // produkt, którego dotyczy
}

export interface PmIssue extends BaseTicket {
  type: 'pm';
  issueType: 'bug' | 'feature' | 'task' | 'improvement';
  storyPoints?: number;
  sprint?: string;
  affectedVersions?: string[];
  fixedVersions?: string[];
  linkedCrmTicketId?: string; // opcjonalne powiązanie z CRM (jeśli issue powstało z ticketu klienta)
}

// Suma wszystkich typów ticketów
export type Ticket = CrmTicket | PmIssue;

// ==================== Typy dla listy ticketów (widok tabeli/kart) ====================

// Opcje filtrowania i sortowania na froncie
export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  type?: TicketType[];
  assignedToMe?: boolean;
  createdByMe?: boolean;
  searchQuery?: string;
  tags?: string[];
  dateRange?: { from: Date; to: Date };
}

export interface TicketSort {
  field: 'createdAt' | 'updatedAt' | 'priority' | 'status';
  direction: 'asc' | 'desc';
}

// Pojedynczy ticket w widoku listy (uproszczony, z polami niezbędnymi do wyświetlenia)
export interface TicketListItem {
  id: string;
  ticketNumber: string;
  title: string;
  description?: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Pick<User, 'id' | 'fullName' | 'avatarUrl'>;
  assignedTo?: Pick<User, 'id' | 'fullName' | 'avatarUrl'>;
  commentCount: number;
  attachmentCount: number;
  tags: string[];
  // Pola specyficzne dla typu (opcjonalnie, do wyróżnienia)
  issueType?: PmIssue['issueType'];
  customerName?: string; // dla CRM
  // Stan UI
  selected: boolean; // czy zaznaczony na liście (do akcji zbiorczych)
  isExpanded: boolean; // czy rozwinięty (jeśli lista ma tryb rozwijania)
}

// ==================== Typy dla widoku szczegółowego ====================

// Rozszerzenie ticketu o dodatkowe dane potrzebne w szczegółach
export type TicketDetails =  {
  // Możemy dodać więcej pól, jeśli backend dostarcza
  // np. historia zmian, powiązane tickety, itp.
  relatedTickets?: TicketListItem[]; // powiązane zgłoszenia
  timeTracking?: {
    totalTimeSpent: number; // w minutach
    timeRemaining?: number;
  };
  // Stan UI
  isLoading: boolean;
  error?: string;
} & Ticket

// ==================== Typy dla formularzy (tworzenie/edycja) ====================

// Formularz tworzenia nowego ticketu (z polami wymaganymi i opcjonalnymi)
interface TicketCreateForm {
  type: TicketType;
  title: string;
  description: string;
  priority: TicketPriority;
  tags: string[];
  // Pola zależne od typu
  customerId?: string; // dla CRM
  account?: string; // dla CRM
  channel?: TicketChannel; // dla CRM
  contractId?: string; // dla CRM
  product?: string; // dla CRM
  issueType?: PmIssue['issueType']; // dla PM
  storyPoints?: number; // dla PM
  sprint?: string; // dla PM
  affectedVersions?: string[]; // dla PM
  // Pliki
  attachments?: File[];
}

// Formularz edycji ticketu (większość pól opcjonalna, bo edytujemy tylko część)
interface TicketEditForm {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToId?: string | null;
  tags?: string[];
  // Pola specyficzne
  storyPoints?: number | null;
  sprint?: string | null;
  // itd.
}

// Stan formularza (np. do walidacji)
interface TicketFormState {
  values: TicketCreateForm | TicketEditForm;
  errors: Partial<Record<keyof (TicketCreateForm | TicketEditForm), string>>;
  touched: Partial<Record<keyof (TicketCreateForm | TicketEditForm), boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ==================== Typy dla komentarzy ====================

interface CommentDisplay extends Comment {
  // Stan UI
  isEditing: boolean;
  isDeleting: boolean;
  showActions: boolean;
}

interface CommentCreateForm {
  content: string;
  isInternal: boolean;
  attachments?: File[];
}

// ==================== Typy dla widoków dashboardu / statystyk ====================

interface TicketStats {
  total: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
  byType: Record<TicketType, number>;
  averageResolutionTime?: number; // w godzinach
  slaCompliance?: number; // procent
}

// ==================== Typy dla kontekstu (store / stan globalny) ====================

interface TicketsState {
  // Lista
  items: TicketListItem[];
  filters: TicketFilters;
  sort: TicketSort;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  // Widok szczegółowy
  selectedTicket: TicketDetails | null;
  // UI
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  // Akcje zbiorcze
  selectedTicketIds: string[];
  bulkActionInProgress: boolean;
}