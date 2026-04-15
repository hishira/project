import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
    AUDIT_ENTITY_LABELS,
    AUDIT_ACTION_LABELS,
    AuditEntityType,
    AuditActionType,
    AuditSeverity,
} from '../audit.model';

@Component({
    selector: 'app-audit-filters',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TitleCasePipe,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    templateUrl: './audit-filters.component.html',
    styleUrls: ['./audit-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditFiltersComponent {
    search = input<string>('');
    entityType = input<AuditEntityType | ''>('');
    action = input<AuditActionType | ''>('');
    severity = input<AuditSeverity | ''>('');
    dateFrom = input<Date | null>(null);
    dateTo = input<Date | null>(null);

    searchChange = output<string>();
    entityTypeChange = output<AuditEntityType | ''>();
    actionChange = output<AuditActionType | ''>();
    severityChange = output<AuditSeverity | ''>();
    dateFromChange = output<Date | null>();
    dateToChange = output<Date | null>();
    clearFilters = output<void>();

    readonly AUDIT_ENTITY_LABELS = AUDIT_ENTITY_LABELS;
    readonly AUDIT_ACTION_LABELS = AUDIT_ACTION_LABELS;

    readonly entityTypes: AuditEntityType[] = ['client', 'document', 'task', 'invoice', 'agreement', 'user', 'project', 'offer', 'integration'];
    readonly actionTypes: AuditActionType[] = ['create', 'update', 'delete', 'restore', 'status_change', 'field_change', 'export', 'import', 'permission_change'];
    readonly severities: AuditSeverity[] = ['low', 'medium', 'high', 'critical'];
}
