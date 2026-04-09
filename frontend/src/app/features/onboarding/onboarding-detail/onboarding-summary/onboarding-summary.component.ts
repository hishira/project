import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ClientOnboarding } from '../../onboarding.model';
import { getOnboardingStatusLabel, getOnboardingStatusClass } from '../../onboarding-status.utils';

@Component({
  selector: 'app-onboarding-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatProgressBarModule],
  template: `
    <mat-card class="summary-card">
      <mat-card-content>
        <div class="summary-grid">
          <div class="d-flex align-items-center">
            <span class="label">Status:</span>
            <mat-chip [class]="getStatusClass(onboarding().status)" class="status-chip-large">
              {{ getLabel(onboarding().status) }}
            </mat-chip>
          </div>
          <div class="d-flex align-items-center">
            <span class="label">Rozpoczęto:</span> {{ onboarding().startDate | date: 'dd MMM yyyy' }}
          </div>
          <div class="d-flex align-items-center">
            <span class="label">Planowane zakończenie:</span> {{ onboarding().endDate | date: 'dd MMM yyyy' }}
          </div>
          <div class="d-flex align-items-center">
            <span class="label">Postęp:</span>
            <div class="progress w-100">
              <span class="progress-value">{{ onboarding().progress }}%</span>
              <mat-progress-bar mode="determinate" [value]="onboarding().progress"></mat-progress-bar>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .summary-card { margin-bottom: 24px; }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      .label { color: #64748b; margin-right: 8px; }
      .progress {
        display: flex;
        flex-direction: column;
        gap: 4px;
        .progress-value { font-weight: 600; color: #0f172a; }
      }
    }
    .status-chip-large {
      font-size: 0.9rem;
      padding: 4px 12px;
      min-height: 32px;
      margin-left: 8px;
    }
  `]
})
export class OnboardingSummaryComponent {
  onboarding = input.required<ClientOnboarding>();
  getLabel = getOnboardingStatusLabel;
  getStatusClass = getOnboardingStatusClass;
}
