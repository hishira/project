import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuditLog, AUDIT_ENTITY_LABELS } from '../../../audit.model';
import { getEntityTypeIcon } from '../../../audit.utils';

@Component({
    selector: 'app-audit-entity-cell',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    template: `
        <div class="entity-cell">
            <mat-icon class="entity-icon">{{ getEntityTypeIcon(log.entityType) }}</mat-icon>
            <div class="entity-info">
                <span class="entity-name">{{ log.entityName }}</span>
                <span class="entity-type">{{ getEntityLabel(log.entityType) }}</span>
            </div>
        </div>
    `,
    styleUrls: ['./audit-entity-cell.component.scss']
})
export class AuditEntityCellComponent {
    @Input() log!: AuditLog;

    readonly AUDIT_ENTITY_LABELS = AUDIT_ENTITY_LABELS;

    getEntityLabel(type: string): string {
        return AUDIT_ENTITY_LABELS[type as keyof typeof AUDIT_ENTITY_LABELS] || type;
    }

    getEntityTypeIcon = getEntityTypeIcon;
}