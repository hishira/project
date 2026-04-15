import { AuditActionType, AuditEntityType, AuditSeverity } from './audit.model';

export function getAuditActionIcon(action: AuditActionType): string {
    switch (action) {
        case 'create':
            return 'add_circle';
        case 'update':
            return 'edit';
        case 'delete':
            return 'delete';
        case 'restore':
            return 'restore';
        case 'status_change':
            return 'swap_horiz';
        case 'field_change':
            return 'change_circle';
        case 'export':
            return 'download';
        case 'import':
            return 'upload';
        case 'permission_change':
            return 'admin_panel_settings';
        default:
            return 'history';
    }
}

export function getActionSeverityColor(severity: AuditSeverity): string {
    switch (severity) {
        case 'low':
            return '#4caf50';
        case 'medium':
            return '#ff9800';
        case 'high':
            return '#f44336';
        case 'critical':
            return '#b71c1c';
        default:
            return '#9e9e9e';
    }
}

export function getActionChipClass(action: AuditActionType): string {
    switch (action) {
        case 'create':
            return 'chip-create';
        case 'update':
            return 'chip-update';
        case 'delete':
            return 'chip-delete';
        case 'restore':
            return 'chip-restore';
        case 'status_change':
        case 'field_change':
            return 'chip-change';
        case 'export':
            return 'chip-export';
        case 'import':
            return 'chip-import';
        case 'permission_change':
            return 'chip-permission';
        default:
            return 'chip-default';
    }
}

export function getEntityTypeIcon(entityType: AuditEntityType): string {
    switch (entityType) {
        case 'client':
            return 'person';
        case 'document':
            return 'description';
        case 'task':
            return 'task';
        case 'invoice':
            return 'receipt';
        case 'agreement':
            return 'gavel';
        case 'user':
            return 'badge';
        case 'project':
            return 'folder';
        case 'offer':
            return 'shopping_cart';
        case 'integration':
            return 'hub';
        default:
            return 'inventory_2';
    }
}
