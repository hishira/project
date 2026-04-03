import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { OfferVersion } from '../../offer.model';

@Component({
  selector: 'app-offer-versions-tab',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule],
  template: `
    @if (versions().length) {
      <table mat-table [dataSource]="versions()" class="versions-table">
        <ng-container matColumnDef="version">
          <th mat-header-cell *matHeaderCellDef>Wersja</th>
          <td mat-cell *matCellDef="let v">v{{ v.version }}</td>
        </ng-container>
        <ng-container matColumnDef="createdAt">
          <th mat-header-cell *matHeaderCellDef>Data</th>
          <td mat-cell *matCellDef="let v">{{ v.createdAt | date: 'dd MMM yyyy, HH:mm' }}</td>
        </ng-container>
        <ng-container matColumnDef="createdBy">
          <th mat-header-cell *matHeaderCellDef>Utworzył</th>
          <td mat-cell *matCellDef="let v">{{ v.createdBy }}</td>
        </ng-container>
        <ng-container matColumnDef="changes">
          <th mat-header-cell *matHeaderCellDef>Zmiany</th>
          <td mat-cell *matCellDef="let v">{{ v.changes }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    } @else {
      <p class="empty-state">Brak wersji</p>
    }
  `,
  styles: [`
    .versions-table {
      width: 100%;
    }
    .empty-state {
      color: #94a3b8;
      text-align: center;
      padding: 24px;
      font-style: italic;
    }
  `]
})
export class OfferVersionsTabComponent {
  versions = input.required<OfferVersion[]>();
  displayedColumns: string[] = ['version', 'createdAt', 'createdBy', 'changes'];
}
