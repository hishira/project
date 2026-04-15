import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { AuditLog, AUDIT_ENTITY_LABELS, AUDIT_ACTION_LABELS, AuditActionType } from '../audit.model';
import { AuditService } from '../audit.service';
import { getAuditActionIcon, getActionSeverityColor, getActionChipClass, getEntityTypeIcon } from '../audit.utils';

@Component({
    selector: 'app-audit-detail',
    standalone: true,
    imports: [
        CommonModule,
        DatePipe,
        RouterLink,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatDividerModule,
        MatTooltipModule,
        PageHeaderComponent,
        MainPageViewComponent,
    ],
    templateUrl: './audit-detail.component.html',
    styleUrls: ['./audit-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly auditService = inject(AuditService);

    readonly auditLog = signal<AuditLog | undefined>(undefined);

    readonly AUDIT_ENTITY_LABELS = AUDIT_ENTITY_LABELS;
    readonly AUDIT_ACTION_LABELS = AUDIT_ACTION_LABELS;

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const log = this.auditService.getAuditLogById(id);
            this.auditLog.set(log);
        }
    }

    getActionIcon = getAuditActionIcon;
    getActionColor = getActionSeverityColor;
    getActionChipClass = getActionChipClass;
    getEntityTypeIcon = getEntityTypeIcon;

    restoreLog(): void {
        const log = this.auditLog();
        if (log && log.isRestorable) {
            this.auditService.restoreAuditLog(log.id);
        }
    }

    formatValue(value: string | number | boolean | null): string {
        if (value === null) return 'puste';
        if (typeof value === 'boolean') return value ? 'Tak' : 'Nie';
        return String(value);
    }

    getChipClass(action: AuditActionType): string{
        return `action-chip ${this. getActionChipClass(action)}`;
    }
}
