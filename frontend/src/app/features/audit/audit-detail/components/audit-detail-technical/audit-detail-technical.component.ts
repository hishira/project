import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuditLog } from '../../../audit.model';

@Component({
    selector: 'app-audit-detail-technical',
    standalone: true,
    imports: [MatCardModule, MatDividerModule, MatIconModule],
    templateUrl: './audit-detail-technical.component.html',
    styleUrls: ['./audit-detail-technical.component.scss'],
})
export class AuditDetailTechnicalComponent {
    log = input.required<AuditLog>();
}