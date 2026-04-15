import { Injectable, signal, computed } from '@angular/core';
import { AuditLog, AuditChange, AuditEntityType, AuditActionType, AuditSeverity } from './audit.model';

const MOCK_AUDIT_LOGS: AuditLog[] = [
    {
        id: 'audit-001',
        timestamp: '2026-04-15T09:23:45',
        userId: 'user-001',
        userName: 'Anna Kowalska',
        userRole: 'Administrator',
        entityType: 'client',
        entityId: 'client-042',
        entityName: 'Acme Corporation',
        action: 'update',
        severity: 'medium',
        description: 'Zaktualizowano dane klienta Acme Corporation',
        changes: [
            { fieldName: 'Email', oldValue: 'old@acme.com', newValue: 'new@acme.com' },
            { fieldName: 'Telefon', oldValue: '+48 123 456 789', newValue: '+48 987 654 321' },
        ],
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 124 / Windows 11',
        isRestorable: true,
        previousVersionId: 'ver-001',
    },
    {
        id: 'audit-002',
        timestamp: '2026-04-15T08:45:12',
        userId: 'user-003',
        userName: 'Jan Nowak',
        userRole: 'Menadżer',
        entityType: 'document',
        entityId: 'doc-118',
        entityName: 'Umowa o dzieło #118',
        action: 'create',
        severity: 'low',
        description: 'Utworzono nowy dokument: Umowa o dzieło #118',
        ipAddress: '192.168.1.105',
        userAgent: 'Firefox 125 / macOS',
        isRestorable: false,
    },
    {
        id: 'audit-003',
        timestamp: '2026-04-14T16:30:00',
        userId: 'user-002',
        userName: 'Maria Wiśniewska',
        userRole: 'Pracownik',
        entityType: 'invoice',
        entityId: 'inv-089',
        entityName: 'Faktura 2026/04/089',
        action: 'delete',
        severity: 'critical',
        description: 'Usunięto fakturę 2026/04/089',
        ipAddress: '192.168.1.110',
        userAgent: 'Chrome 124 / Windows 11',
        isRestorable: true,
        previousVersionId: 'ver-002',
    },
    {
        id: 'audit-004',
        timestamp: '2026-04-14T14:15:33',
        userId: 'user-001',
        userName: 'Anna Kowalska',
        userRole: 'Administrator',
        entityType: 'user',
        entityId: 'user-015',
        entityName: 'Piotr Zieliński',
        action: 'permission_change',
        severity: 'high',
        description: 'Zmieniono uprawnienia użytkownika Piotr Zieliński',
        changes: [
            { fieldName: 'Rola', oldValue: 'Pracownik', newValue: 'Menadżer' },
            { fieldName: 'Dostęp do raportów', oldValue: false, newValue: true },
        ],
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 124 / Windows 11',
        isRestorable: true,
        previousVersionId: 'ver-003',
    },
    {
        id: 'audit-005',
        timestamp: '2026-04-14T11:05:20',
        userId: 'user-004',
        userName: 'Tomasz Lewandowski',
        userRole: 'Menadżer',
        entityType: 'agreement',
        entityId: 'agr-055',
        entityName: 'Umowa partnerska XYZ',
        action: 'status_change',
        severity: 'medium',
        description: 'Zmieniono status umowy: W trakcie -> Podpisana',
        changes: [
            { fieldName: 'Status', oldValue: 'W trakcie', newValue: 'Podpisana' },
        ],
        ipAddress: '192.168.1.120',
        userAgent: 'Safari 17 / macOS',
        isRestorable: true,
        previousVersionId: 'ver-004',
    },
    {
        id: 'audit-006',
        timestamp: '2026-04-13T15:42:18',
        userId: 'user-002',
        userName: 'Maria Wiśniewska',
        userRole: 'Pracownik',
        entityType: 'task',
        entityId: 'task-230',
        entityName: 'Przygotować raport Q1',
        action: 'update',
        severity: 'low',
        description: 'Zaktualizowano zadanie: Przygotować raport Q1',
        changes: [
            { fieldName: 'Termin', oldValue: '2026-04-20', newValue: '2026-04-25' },
            { fieldName: 'Priorytet', oldValue: 'Średni', newValue: 'Wysoki' },
        ],
        ipAddress: '192.168.1.110',
        userAgent: 'Chrome 124 / Windows 11',
        isRestorable: true,
        previousVersionId: 'ver-005',
    },
    {
        id: 'audit-007',
        timestamp: '2026-04-13T10:18:45',
        userId: 'user-005',
        userName: 'Katarzyna Dąbrowska',
        userRole: 'Administrator',
        entityType: 'client',
        entityId: 'client-078',
        entityName: 'Global Tech Sp. z o.o.',
        action: 'create',
        severity: 'low',
        description: 'Dodano nowego klienta: Global Tech Sp. z o.o.',
        ipAddress: '192.168.1.130',
        userAgent: 'Edge 124 / Windows 11',
        isRestorable: false,
    },
    {
        id: 'audit-008',
        timestamp: '2026-04-12T09:00:00',
        userId: 'user-003',
        userName: 'Jan Nowak',
        userRole: 'Menadżer',
        entityType: 'project',
        entityId: 'proj-012',
        entityName: 'Projekt migracji CRM',
        action: 'export',
        severity: 'low',
        description: 'Wyeksportowano dane projektu: Projekt migracji CRM',
        ipAddress: '192.168.1.105',
        userAgent: 'Firefox 125 / macOS',
        isRestorable: false,
    },
    {
        id: 'audit-009',
        timestamp: '2026-04-11T17:30:22',
        userId: 'user-001',
        userName: 'Anna Kowalska',
        userRole: 'Administrator',
        entityType: 'integration',
        entityId: 'int-003',
        entityName: 'Integracja z Slack',
        action: 'update',
        severity: 'high',
        description: 'Zaktualizowano konfigurację integracji ze Slack',
        changes: [
            { fieldName: 'Webhook URL', oldValue: 'https://hooks.slack.com/old', newValue: 'https://hooks.slack.com/new' },
            { fieldName: 'Status', oldValue: 'Aktywna', newValue: 'Aktywna' },
        ],
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 124 / Windows 11',
        isRestorable: true,
        previousVersionId: 'ver-006',
    },
    {
        id: 'audit-010',
        timestamp: '2026-04-10T13:15:00',
        userId: 'user-002',
        userName: 'Maria Wiśniewska',
        userRole: 'Pracownik',
        entityType: 'offer',
        entityId: 'off-067',
        entityName: 'Oferta #2026/067',
        action: 'restore',
        severity: 'medium',
        description: 'Przywrócono ofertę #2026/067 z wersji archiwalnej',
        ipAddress: '192.168.1.110',
        userAgent: 'Chrome 124 / Windows 11',
        isRestorable: false,
        previousVersionId: 'ver-007',
    },
];

@Injectable({ providedIn: 'root' })
export class AuditService {
    private auditLogsData: AuditLog[] = MOCK_AUDIT_LOGS;
    readonly auditLogs = signal<AuditLog[]>(this.auditLogsData);

    getAuditLogById(id: string): AuditLog | undefined {
        return this.auditLogs().find(log => log.id === id);
    }

    getAuditLogsByEntityType(entityType: AuditEntityType): AuditLog[] {
        return this.auditLogs().filter(log => log.entityType === entityType);
    }

    getAuditLogsByAction(action: AuditActionType): AuditLog[] {
        return this.auditLogs().filter(log => log.action === action);
    }

    getAuditLogsBySeverity(severity: AuditSeverity): AuditLog[] {
        return this.auditLogs().filter(log => log.severity === severity);
    }

    getAuditLogsByUser(userId: string): AuditLog[] {
        return this.auditLogs().filter(log => log.userId === userId);
    }

    getRestorableLogs(): AuditLog[] {
        return this.auditLogs().filter(log => log.isRestorable);
    }

    addAuditLog(log: AuditLog): void {
        console.log('Adding audit log:', log);
        // TODO: Implement actual API call
    }

    restoreAuditLog(logId: string): void {
        const log = this.getAuditLogById(logId);
        if (log && log.isRestorable) {
            console.log('Restoring audit log:', logId);
            // TODO: Implement actual restore API call
        }
    }
}
