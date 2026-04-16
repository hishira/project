import { Component, input } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuditLog, AUDIT_ENTITY_LABELS, AUDIT_ACTION_LABELS, AuditActionType } from '../../../audit.model';
import { getAuditActionIcon, getActionSeverityColor, getActionChipClass, getEntityTypeIcon } from '../../../audit.utils';

@Component({
    selector: 'app-audit-detail-info',
    standalone: true,
    imports: [
        CommonModule,
        DatePipe,
        TitleCasePipe,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        MatDividerModule,
    ],
    templateUrl: './audit-detail-info.component.html',
    styleUrls: ['./audit-detail-info.component.scss'],
})
export class AuditDetailInfoComponent {
    log = input.required<AuditLog>();

    readonly AUDIT_ENTITY_LABELS = AUDIT_ENTITY_LABELS;
    readonly AUDIT_ACTION_LABELS = AUDIT_ACTION_LABELS;

    readonly getActionIcon = getAuditActionIcon;
    readonly getActionColor = getActionSeverityColor;
    readonly getActionChipClass = getActionChipClass;
    readonly getEntityTypeIcon = getEntityTypeIcon;

    getChipClass(action: AuditActionType): string {
        return `action-chip ${this.getActionChipClass(action)}`;
    }
}