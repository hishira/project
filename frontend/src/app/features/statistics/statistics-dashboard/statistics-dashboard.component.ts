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
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { firstValueFrom } from 'rxjs';
import { StatisticsService } from '../../../core/services/statistics.service';
import { ActivityService } from '../../../core/services/activity.service';
import { ChartManagementService } from '../../../core/services/chart-management.service';
import { ProgressCalculationService } from '../../../core/services/progress-calculation.service';
import { DataFormatterService } from '../../../core/services/data-formatter.service';
import { UserStatistics } from '../../../shared/models/statistics.model';
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
  private readonly chartManagementService = inject(ChartManagementService);
  private readonly progressCalculationService = inject(ProgressCalculationService);
  private readonly dataFormatterService = inject(DataFormatterService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  statistics = signal<UserStatistics | null>(null);
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

  // Chart configurations - initialized from service
  activityTypeChart!: ChartConfiguration;
  intensityChart!: ChartConfiguration;
  durationTrendChart!: ChartConfiguration;
  weeklyGoalChart!: ChartConfiguration;
  monthlyGoalChart!: ChartConfiguration;

  ngOnInit() {
    this.initializeCharts();
    this.setupFormSubscription();
    this.loadStatistics();
  }

  /**
   * Initialize chart configurations
   */
  private initializeCharts(): void {
    const initialCharts = this.chartManagementService.getInitialChartConfigurations();
    this.activityTypeChart = initialCharts.activityTypeChart;
    this.intensityChart = initialCharts.intensityChart;
    this.durationTrendChart = initialCharts.durationTrendChart;
    this.weeklyGoalChart = initialCharts.weeklyGoalChart;
    this.monthlyGoalChart = initialCharts.monthlyGoalChart;
  }

  /**
   * Setup form value changes subscription
   */
  private setupFormSubscription(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.loadStatistics();
    });
  }

  /**
   * Load statistics and activities data
   */
  private async loadStatistics(): Promise<void> {
    this.isLoading.set(true);
    const filters = this.filterForm.value;
    
    try {
      const [stats, activitiesResponse] = await Promise.all([
        firstValueFrom(this.statisticsService.getStatistics({
          period: filters.period,
          activityType: filters.activityType ?? undefined
        })),
        firstValueFrom(this.activityService.getActivities())
      ]);
      
      this.statistics.set(stats);
      const activities = activitiesResponse.activities || [];
      this.activities.set(activities);
      this.updateAllCharts(stats, activities);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Update all charts with new data
   */
  private updateAllCharts(stats: UserStatistics, activities: Activity[]): void {
    const updatedCharts = this.chartManagementService.updateAllCharts(stats, activities);
    
    this.activityTypeChart = updatedCharts.activityTypeChart;
    this.intensityChart = updatedCharts.intensityChart;
    this.durationTrendChart = updatedCharts.durationTrendChart;
    this.weeklyGoalChart = updatedCharts.weeklyGoalChart;
    this.monthlyGoalChart = updatedCharts.monthlyGoalChart;
    
    this.cdr.detectChanges(); // Force change detection to update charts
  }

  /**
   * Format duration using the data formatter service
   */
  formatDuration(minutes: number): string {
    return this.dataFormatterService.formatDuration(minutes);
  }

  /**
   * Get weekly progress percentage
   */
  getWeeklyProgress(): number {
    return this.progressCalculationService.getWeeklyProgress(this.activities());
  }

  /**
   * Get monthly progress percentage
   */
  getMonthlyProgress(): number {
    return this.progressCalculationService.getMonthlyProgress(this.activities());
  }

  /**
   * Get weekly activities count
   */
  getWeeklyActivitiesCount(): number {
    return this.progressCalculationService.getWeeklyActivitiesCount(this.activities());
  }

  /**
   * Get monthly activities count
   */
  getMonthlyActivitiesCount(): number {
    return this.progressCalculationService.getMonthlyActivitiesCount(this.activities());
  }
}
