export type AuditEntityType =
    | 'client'
    | 'document'
    | 'task'
    | 'invoice'
    | 'agreement'
    | 'user'
    | 'project'
    | 'offer'
    | 'integration';

export type AuditActionType =
    | 'create'
    | 'update'
    | 'delete'
    | 'restore'
    | 'status_change'
    | 'field_change'
    | 'export'
    | 'import'
    | 'permission_change';

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AuditChange {
    fieldName: string;
    oldValue: string | number | boolean | null;
    newValue: string | number | boolean | null;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    userRole: string;
    entityType: AuditEntityType;
    entityId: string;
    entityName: string;
    action: AuditActionType;
    severity: AuditSeverity;
    description: string;
    changes?: AuditChange[];
    ipAddress?: string;
    userAgent?: string;
    isRestorable: boolean;
    previousVersionId?: string;
}

export const AUDIT_ENTITY_LABELS: Record<AuditEntityType, string> = {
    client: 'Klient',
    document: 'Dokument',
    task: 'Zadanie',
    invoice: 'Faktura',
    agreement: 'Umowa',
    user: 'Użytkownik',
    project: 'Projekt',
    offer: 'Oferta',
    integration: 'Integracja',
};

export const AUDIT_ACTION_LABELS: Record<AuditActionType, string> = {
    create: 'Utworzenie',
    update: 'Aktualizacja',
    delete: 'Usunięcie',
    restore: 'Przywrócenie',
    status_change: 'Zmiana statusu',
    field_change: 'Zmiana pola',
    export: 'Eksport',
    import: 'Import',
    permission_change: 'Zmiana uprawnień',
};
