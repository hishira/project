import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Offer } from '../../offer.model';
import { getStatusClass, getStatusLabel } from '../../offer-status.utils';

@Component({
  selector: 'app-offer-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule],
  template: `
    <mat-card class="summary-card">
      <mat-card-header>
        <mat-card-title>Podsumowanie</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="summary-grid">
          <div><span class="label">Klient:</span> {{ offer().clientName }}</div>
          <div><span class="label">Tytuł:</span> {{ offer().title }}</div>
          <div><span class="label">Data wystawienia:</span> {{ offer().issueDate | date: 'dd MMM yyyy' }}</div>
          <div><span class="label">Ważna do:</span> {{ offer().validUntil | date: 'dd MMM yyyy' }}</div>
          <div>
            <span class="label">Status:</span>
            <mat-chip [class]="getStatusClass(offer().status)">{{ getStatusLabel(offer().status) }}</mat-chip>
          </div>
          <div>
            <span class="label">Wartość brutto:</span>
            <strong>{{ offer().totalGross | number: '1.2-2' }} {{ offer().currency }}</strong>
          </div>
        </div>
        @if (offer().description) {
          <div class="description"><span class="label">Opis:</span> {{ offer().description }}</div>
        }
        @if (offer().notes) {
          <div class="notes"><span class="label">Uwagi:</span> {{ offer().notes }}</div>
        }
        @if (offer().tags?.length) {
          <div class="tags">
            <span class="label">Tagi:</span>
            <mat-chip-set>
              @for (tag of offer().tags; track tag) {
                <mat-chip>{{ tag }}</mat-chip>
              }
            </mat-chip-set>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 16px;

      .label {
        color: #64748b;
        margin-right: 8px;
      }
    }
    .description, .notes {
      margin-top: 8px;
      .label {
        color: #64748b;
        font-weight: 500;
        margin-right: 8px;
      }
    }
    .tags {
      margin-top: 12px;
    }
    
    :host ::ng-deep .status-draft { background-color: #e2e8f0 !important; color: #475569 !important; }
    :host ::ng-deep .status-sent { background-color: #dbeafe !important; color: #1e40af !important; }
    :host ::ng-deep .status-accepted { background-color: #d1fae5 !important; color: #065f46 !important; }
    :host ::ng-deep .status-rejected { background-color: #fee2e2 !important; color: #b91c1c !important; }
    :host ::ng-deep .status-expired { background-color: #fef3c7 !important; color: #92400e !important; }
  `]
})
export class OfferSummaryComponent {
  offer = input.required<Offer>();

  getStatusClass = getStatusClass;
  getStatusLabel = getStatusLabel;
}
