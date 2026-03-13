import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { AnalyticsService } from '../analytics.service';

@Component({
  selector: 'app-prediction-widget',
  standalone: true,
  imports: [CommonModule, RouterLink, MatListModule, MatChipsModule],
  template: `
    <mat-list>
      @for (item of churnPredictions().slice(0, config.limit || 5); track item.clientId) {
        <mat-list-item [routerLink]="['/clients', item.clientId]" class="prediction-item">
          <div class="prediction-row">
            <span class="client-name">{{ item.clientName }}</span>
            <mat-chip [class]="'risk-' + item.riskLevel">{{ item.probability | percent:'1.0-0' }}</mat-chip>
          </div>
        </mat-list-item>
      }
    </mat-list>
  `,
  styles: [`
    .prediction-item {
      cursor: pointer;
    }
    .prediction-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .client-name {
      font-weight: 500;
    }
    .risk-low { background-color: #d1fae5 !important; color: #065f46 !important; }
    .risk-medium { background-color: #fef3c7 !important; color: #92400e !important; }
    .risk-high { background-color: #fee2e2 !important; color: #b91c1c !important; }
  `]
})
export class PredictionWidgetComponent {
  private analyticsService = inject(AnalyticsService);
  @Input() config!: any;

  churnPredictions = this.analyticsService.churnPredictions;
}