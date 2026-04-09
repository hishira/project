import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Agreement } from '../../types';
import { agreementStatusLowerCase } from '../utils';

@Component({
  selector: 'app-agreement-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, DatePipe],
  template: `
    <mat-card class="mb-4">
      <mat-card-header>
        <mat-card-title>{{ agreement().title }}</mat-card-title>
        <mat-card-subtitle>{{ agreement().description }}</mat-card-subtitle>
        <div class="status-badge ms-auto" [class]="getStatusClass(agreement().status)">
          {{ agreement().status }}
        </div>
      </mat-card-header>
      <mat-card-content>
        <div class="row mt-3">
          <div class="col-md-6">
            <p><strong>ID Umowy:</strong> {{ agreement().contractId }}</p>
            <p>
              <strong>Wersja:</strong> {{ agreement().version.version }} ({{ agreement().version.versionNumber }})
            </p>
          </div>
          <div class="col-md-6">
            <p><strong>Wartość całkowita:</strong> {{ agreement().totalValue }} {{ agreement().currency }}</p>
            <p>
              <strong>Okres obowiązywania:</strong> {{ agreement().effectiveDate | date: 'dd.MM.yyyy' }} -
              {{ agreement().expirationDate | date: 'dd.MM.yyyy' }}
            </p>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .status-badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      height: fit-content;
    }
    .status-badge.active { background-color: #e8f5e9; color: #2e7d32; }
    .status-badge.expired { background-color: #ffebee; color: #c62828; }
    .status-badge.draft { background-color: #fff3e0; color: #ef6c00; }
    .status-badge.pending { background-color: #e3f2fd; color: #1565c0; }
  `]
})
export class AgreementSummaryComponent {
  agreement = input.required<Agreement>();

  getStatusClass = agreementStatusLowerCase;
}
