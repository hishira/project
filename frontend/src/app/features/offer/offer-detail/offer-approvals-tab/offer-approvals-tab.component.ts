import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { Approval } from '../../offer.model';
import { getApprovalStatusClass } from '../../offer-status.utils';

@Component({
  selector: 'app-offer-approvals-tab',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, MatChipsModule],
  template: `
    @if (approvals().length) {
      <table mat-table [dataSource]="approvals()" class="approvals-table">
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let a">
            <mat-chip [class]="getApprovalStatusClass(a.status)">{{ a.status }}</mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="requestedBy">
          <th mat-header-cell *matHeaderCellDef>Zgłaszający</th>
          <td mat-cell *matCellDef="let a">{{ a.requestedBy }}</td>
        </ng-container>
        <ng-container matColumnDef="requestedAt">
          <th mat-header-cell *matHeaderCellDef>Data zgłoszenia</th>
          <td mat-cell *matCellDef="let a">{{ a.requestedAt | date: 'dd MMM yyyy, HH:mm' }}</td>
        </ng-container>
        <ng-container matColumnDef="reviewedBy">
          <th mat-header-cell *matHeaderCellDef>Oceniający</th>
          <td mat-cell *matCellDef="let a">{{ a.reviewedBy || '-' }}</td>
        </ng-container>
        <ng-container matColumnDef="reviewedAt">
          <th mat-header-cell *matHeaderCellDef>Data oceny</th>
          <td mat-cell *matCellDef="let a">{{ a.reviewedAt | date: 'dd MMM yyyy, HH:mm' }}</td>
        </ng-container>
        <ng-container matColumnDef="comments">
          <th mat-header-cell *matHeaderCellDef>Komentarz</th>
          <td mat-cell *matCellDef="let a">{{ a.comments || '-' }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    } @else {
      <p class="empty-state">Brak akceptacji</p>
    }
  `,
  styles: [`
    .approvals-table {
      width: 100%;
    }
    .empty-state {
      color: #94a3b8;
      text-align: center;
      padding: 24px;
      font-style: italic;
    }
    
    :host ::ng-deep .status-pending { background-color: #fef3c7 !important; color: #92400e !important; }
    :host ::ng-deep .status-approved { background-color: #d1fae5 !important; color: #065f46 !important; }
    :host ::ng-deep .status-rejected { background-color: #fee2e2 !important; color: #b91c1c !important; }
  `]
})
export class OfferApprovalsTabComponent {
  approvals = input.required<Approval[]>();
  displayedColumns: string[] = ['status', 'requestedBy', 'requestedAt', 'reviewedBy', 'reviewedAt', 'comments'];
  
  getApprovalStatusClass = getApprovalStatusClass;
}
