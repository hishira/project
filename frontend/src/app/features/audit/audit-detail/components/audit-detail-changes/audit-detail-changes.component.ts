import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuditLog } from '../../../audit.model';

@Component({
    selector: 'app-audit-detail-changes',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './audit-detail-changes.component.html',
    styleUrls: ['./audit-detail-changes.component.scss'],
})
export class AuditDetailChangesComponent {
    log = input.required<AuditLog>();

    formatValue(value: string | number | boolean | null): string {
        if (value === null) return 'puste';
        if (typeof value === 'boolean') return value ? 'Tak' : 'Nie';
        return String(value);
    }
}