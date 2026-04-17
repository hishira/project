import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuditLog } from '../../../audit.model';

@Component({
    selector: 'app-audit-timestamp-cell',
    standalone: true,
    imports: [CommonModule, DatePipe],
    template: `
        <div class="timestamp-cell">
            <span class="date">{{ log.timestamp | date: 'dd MMM yyyy' }}</span>
            <span class="time">{{ log.timestamp | date: 'HH:mm:ss' }}</span>
        </div>
    `,
    styleUrls: ['./audit-timestamp-cell.component.scss']
})
export class AuditTimestampCellComponent {
    @Input() log!: AuditLog;
}