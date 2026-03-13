import { CommonModule } from '@angular/common';
import { Component, inject, input, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AnalyticsService } from '../analytics.service';

@Component({
    selector: 'app-kpi-card',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule],
    template: `
    <div class="kpi-grid">
      @for (kpi of kpis(); track kpi.id) {
        <div class="kpi-item">
          <div class="kpi-header">
            <mat-icon [style.color]="kpi.color">{{ kpi.icon }}</mat-icon>
            <span class="kpi-label">{{ kpi.label }}</span>
          </div>
          <div class="kpi-value">{{ formatValue(kpi) }}</div>
          @if (kpi.changePercent !== undefined) {
            <div class="kpi-change" [class.positive]="kpi.changePercent > 0" [class.negative]="kpi.changePercent < 0">
              <mat-icon>{{ kpi.changePercent > 0 ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
              {{ abs(kpi.changePercent) | number:'1.1-1' }}% od poprz. okresu
            </div>
          }
        </div>
      }
    </div>
  `,
    styles: [`
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .kpi-item {
      background: #f8fafc;
      border-radius: 8px;
      padding: 16px;
    }
    .kpi-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      color: #475569;
    }
    .kpi-value {
      font-size: 2rem;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.2;
      margin-bottom: 8px;
    }
    .kpi-change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
      &.positive { color: #2e7d32; }
      &.negative { color: #d32f2f; }
    }
  `]
})
export class KpiCardComponent {
    private analyticsService = inject(AnalyticsService);
    config: any = input.required<any>();

    kpis = computed(()=>this.analyticsService.kpis().filter(k => this.config().kpiIds?.includes(k.id) ?? true));

    formatValue(kpi: any): string {
        switch (kpi.format) {
            case 'currency': return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(kpi.value);
            case 'percent': return kpi.value + '%';
            case 'number': return new Intl.NumberFormat('pl-PL').format(kpi.value);
            default: return kpi.value;
        }
    }

    abs(val: number): number {
        return Math.abs(val);
    }
}