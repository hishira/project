import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuditLog } from '../../../audit.model';

@Component({
    selector: 'app-audit-detail-description',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './audit-detail-description.component.html',
    styleUrls: ['./audit-detail-description.component.scss'],
})
export class AuditDetailDescriptionComponent {
    log = input.required<AuditLog>();
}