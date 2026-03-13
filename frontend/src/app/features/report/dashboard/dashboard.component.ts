import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { AnalyticsService } from '../analytics.service';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';
import { ChartWidgetComponent } from '../chart-widget/chart-widget.component';
import { PredictionWidgetComponent } from '../prediction-widget/prediction-widget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule, MatGridListModule,
    KpiCardComponent, ChartWidgetComponent, PredictionWidgetComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private analyticsService = inject(AnalyticsService);
  widgets = this.analyticsService.dashboardWidgets();

  // Responsywna siatka – dostosowanie liczby kolumn do szerokości ekranu
  cols = signal(4);

  constructor() {
    // Symulacja responsywności (w rzeczywistości użyć BreakpointObserver)
    if (window.innerWidth < 800) this.cols.set(2);
    if (window.innerWidth < 500) this.cols.set(1);
  }

  getWidgetSize(size: string): number {
    const sizes: Record<string, number> = {
      small: 1,
      medium: 2,
      large: 3,
      full: 4
    };
    return sizes[size] || 1;
  }

  refreshWidget(widgetId: string) {
    console.log('Odświeżanie widgetu:', widgetId);
  }

  customizeDashboard() {
    console.log('Dostosuj dashboard');
  }
}