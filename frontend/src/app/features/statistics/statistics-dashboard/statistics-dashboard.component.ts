import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { firstValueFrom } from 'rxjs';
import { StatisticsService } from '../../../core/services/statistics.service';
import { ActivityService } from '../../../core/services/activity.service';
import { Statistics } from '../../../shared/models/statistics.model';
import { ActivityType, Activity } from '../../../shared/models/activity.model';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    BaseChartDirective
  ],
  templateUrl: './statistics-dashboard.component.html',
  styleUrls: ['./statistics-dashboard.component.scss']
})
export class StatisticsDashboardComponent implements OnInit {
  private readonly statisticsService = inject(StatisticsService);
  public readonly activityService = inject(ActivityService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  statistics = signal<Statistics | null>(null);
  activities = signal<Activity[]>([]);
  isLoading = signal(false);

  filterForm: FormGroup = this.fb.group({
    period: ['month'],
    activityType: ['']
  });

  activityTypes = Object.values(ActivityType).map(type => ({
    value: type,
    label: this.activityService.getActivityTypeLabel(type)
  }));

  // Chart configurations
  activityTypeChart: ChartConfiguration = {
    type: 'doughnut' as ChartType,
    data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  };

  intensityChart: ChartConfiguration = {
    type: 'pie' as ChartType,
    data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  };

  durationTrendChart: ChartConfiguration = {
    type: 'line' as ChartType,
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Duration (minutes)' }
        }
      }
    }
  };

  weeklyGoalChart: ChartConfiguration = {
    type: 'doughnut' as ChartType,
    data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  };

  monthlyGoalChart: ChartConfiguration = {
    type: 'doughnut' as ChartType,
    data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  };

  ngOnInit() {
    this.filterForm.valueChanges.subscribe(() => {
      this.loadStatistics();
    });
    this.loadStatistics();
  }

  private async loadStatistics() {
    this.isLoading.set(true);
    const filters = this.filterForm.value;
    
    try {
      // Load both statistics and activities
      const [stats, activitiesResponse] = await Promise.all([
        firstValueFrom(this.statisticsService.getStatistics({
          period: filters.period,
          activityType: filters.activityType ?? undefined
        })),
        firstValueFrom(this.activityService.getActivities())
      ]);
      
      this.statistics.set(stats);
      // ActivityService.getActivities() returns Activity[] directly
      const activities = activitiesResponse ?? [];
      this.activities.set(activities);
      this.updateCharts(stats, activities);
      this.isLoading.set(false);
    } catch (error) {
      console.error('Error loading statistics:', error);
      this.isLoading.set(false);
    }
  }

  private updateCharts(stats: Statistics, activities: Activity[]) {
    this.updateActivityTypeChart(stats);
    this.updateIntensityChart(activities);
    this.updateDurationTrendChart(activities);
    this.updateGoalCharts(stats);
    this.cdr.detectChanges(); // Force change detection to update charts
  }

  private updateActivityTypeChart(stats: Statistics) {
    const chartData = this.statisticsService.getActivityTypeChartData(stats);
    this.activityTypeChart.data = chartData;
  }

  private updateIntensityChart(activities: Activity[]) {
    const chartData = this.statisticsService.getIntensityLevelChartData(activities);
    // Create a new chart configuration to trigger re-render
    console.log(chartData);
    this.intensityChart = {
      type: 'pie' as ChartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    };
  }

  private updateDurationTrendChart(activities: Activity[]) {
    const chartData = this.statisticsService.getDurationTrendChartData(activities);
    this.durationTrendChart.data = chartData;
  }

  private updateGoalCharts(stats: Statistics) {
    const weeklyProgress = this.getWeeklyProgress();
    this.weeklyGoalChart.data = {
      labels: ['Completed', 'Remaining'],
      datasets: [{
        data: [weeklyProgress, 100 - weeklyProgress],
        backgroundColor: ['#4caf50', '#e0e0e0'],
        borderWidth: 0
      }]
    };

    const monthlyProgress = this.getMonthlyProgress();
    this.monthlyGoalChart.data = {
      labels: ['Completed', 'Remaining'],
      datasets: [{
        data: [monthlyProgress, 100 - monthlyProgress],
        backgroundColor: ['#2196f3', '#e0e0e0'],
        borderWidth: 0
      }]
    };
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  getWeeklyProgress(): number {
    const weeklyActivities = this.statistics()?.weeklyStats?.totalActivities ?? 0;
    return Math.min(Math.round((weeklyActivities / 5) * 100), 100);
  }

  getMonthlyProgress(): number {
    const monthlyActivities = this.statistics()?.monthlyStats?.totalActivities ?? 0;
    return Math.min(Math.round((monthlyActivities / 20) * 100), 100);
  }
}
