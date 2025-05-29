import { Component, OnInit, inject, signal } from '@angular/core';
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
  template: `
    <div class="statistics-container">
      <!-- Header -->
      <mat-toolbar class="statistics-header">
        <h1>
          <mat-icon>analytics</mat-icon>
          Activity Statistics
        </h1>
      </mat-toolbar>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <form [formGroup]="filterForm" class="filters-form">
            <mat-form-field appearance="outline">
              <mat-label>Time Period</mat-label>
              <mat-select formControlName="period">
                <mat-option value="week">Last 7 Days</mat-option>
                <mat-option value="month">Last 30 Days</mat-option>
                <mat-option value="3months">Last 3 Months</mat-option>
                <mat-option value="year">Last Year</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Activity Type</mat-label>
              <mat-select formControlName="activityType">
                <mat-option value="">All Activities</mat-option>
                @for (type of activityTypes; track type.value) {
                  <mat-option [value]="type.value">
                    <mat-icon>{{ activityService.getActivityIcon(type.value) }}</mat-icon>
                    {{ type.label }}
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading statistics...</p>
        </div>
      }

      <!-- Statistics Content -->
      @if (!isLoading() && statistics()) {
        <!-- Overview Cards -->
        <div class="overview-grid">
          <mat-card class="overview-card">
            <mat-card-content>
              <div class="overview-content">
                <mat-icon class="overview-icon activities">fitness_center</mat-icon>
                <div class="overview-info">
                  <h3>{{ statistics()!.totalActivities }}</h3>
                  <p>Total Activities</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="overview-card">
            <mat-card-content>
              <div class="overview-content">
                <mat-icon class="overview-icon duration">schedule</mat-icon>
                <div class="overview-info">
                  <h3>{{ formatDuration(statistics()!.totalDuration) }}</h3>
                  <p>Total Duration</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="overview-card">
            <mat-card-content>
              <div class="overview-content">
                <mat-icon class="overview-icon calories">local_fire_department</mat-icon>
                <div class="overview-info">
                  <h3>{{ statistics()!.totalCalories || 0 | number }}</h3>
                  <p>Total Calories</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="overview-card">
            <mat-card-content>
              <div class="overview-content">
                <mat-icon class="overview-icon average">trending_up</mat-icon>
                <div class="overview-info">
                  <h3>{{ (statistics()!.averageDuration || 0) | number:'1.0-0' }}</h3>
                  <p>Avg Duration (min)</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Charts Section -->
        <mat-tab-group class="charts-tabs" animationDuration="300ms">
          <!-- Activity Distribution -->
          <mat-tab label="Activity Distribution">
            <div class="tab-content">
              <div class="charts-grid">
                <mat-card class="chart-card">
                  <mat-card-header>
                    <mat-card-title>Activities by Type</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    @if (activityTypeChart.data.datasets[0].data.length > 0) {
                      <div class="chart-container">
                        <canvas baseChart
                          [data]="activityTypeChart.data"
                          [options]="activityTypeChart.options"
                          [type]="activityTypeChart.type">
                        </canvas>
                      </div>
                    } @else {
                      <div class="no-data">
                        <mat-icon>pie_chart</mat-icon>
                        <p>No activity data available</p>
                      </div>
                    }
                  </mat-card-content>
                </mat-card>

                <mat-card class="chart-card">
                  <mat-card-header>
                    <mat-card-title>Intensity Levels</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    @if (intensityChart.data.datasets[0].data.length > 0) {
                      <div class="chart-container">
                        <canvas baseChart
                          [data]="intensityChart.data"
                          [options]="intensityChart.options"
                          [type]="intensityChart.type">
                        </canvas>
                      </div>
                    } @else {
                      <div class="no-data">
                        <mat-icon>donut_large</mat-icon>
                        <p>No intensity data available</p>
                      </div>
                    }
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Trends -->
          <mat-tab label="Activity Trends">
            <div class="tab-content">
              <mat-card class="chart-card full-width">
                <mat-card-header>
                  <mat-card-title>Activity Duration Over Time</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  @if (durationTrendChart.data.datasets[0].data.length > 0) {
                    <div class="chart-container">
                      <canvas baseChart
                        [data]="durationTrendChart.data"
                        [options]="durationTrendChart.options"
                        [type]="durationTrendChart.type">
                      </canvas>
                    </div>
                  } @else {
                    <div class="no-data">
                      <mat-icon>show_chart</mat-icon>
                      <p>No trend data available</p>
                    </div>
                  }
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Goals & Progress -->
          <mat-tab label="Goals & Progress">
            <div class="tab-content">
              <div class="goals-grid">
                <mat-card class="goal-card">
                  <mat-card-header>
                    <mat-card-title>Weekly Goal</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="goal-progress">
                      <div class="progress-circle">
                        <canvas baseChart
                          [data]="weeklyGoalChart.data"
                          [options]="weeklyGoalChart.options"
                          [type]="weeklyGoalChart.type">
                        </canvas>
                      </div>
                      <div class="goal-info">
                        <h3>{{ getWeeklyProgress() }}%</h3>
                        <p>{{ statistics()!.weeklyStats?.totalActivities ?? 0 }} / 5 activities</p>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="goal-card">
                  <mat-card-header>
                    <mat-card-title>Monthly Goal</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="goal-progress">
                      <div class="progress-circle">
                        <canvas baseChart
                          [data]="monthlyGoalChart.data"
                          [options]="monthlyGoalChart.options"
                          [type]="monthlyGoalChart.type">
                        </canvas>
                      </div>
                      <div class="goal-info">
                        <h3>{{ getMonthlyProgress() }}%</h3>
                        <p>{{ statistics()!.monthlyStats?.totalActivities ?? 0 }} / 20 activities</p>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      }

      <!-- Empty State -->
      @if (!isLoading() && !statistics()) {
        <div class="empty-state">
          <mat-icon class="empty-icon">analytics</mat-icon>
          <h2>No Statistics Available</h2>
          <p>Start adding activities to see your statistics and progress!</p>
          <button mat-raised-button color="primary" routerLink="/activities/create">
            <mat-icon>add</mat-icon>
            Add Your First Activity
          </button>
        </div>
      }
    </div>
  `,
  styleUrls: ['./statistics-dashboard.component.scss']
})
export class StatisticsDashboardComponent implements OnInit {
  private readonly statisticsService = inject(StatisticsService);
  public readonly activityService = inject(ActivityService);
  private readonly fb = inject(FormBuilder);

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
  }

  private updateActivityTypeChart(stats: Statistics) {
    const chartData = this.statisticsService.getActivityTypeChartData(stats);
    this.activityTypeChart.data = chartData;
  }

  private updateIntensityChart(activities: Activity[]) {
    const chartData = this.statisticsService.getIntensityLevelChartData(activities);
    this.intensityChart.data = chartData;
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
