import { Injectable, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Activity } from '../../shared/models/activity.model';
import { UserStatistics } from '../../shared/models/statistics.model';
import { StatisticsService } from './statistics.service';
import { ProgressCalculationService } from './progress-calculation.service';
import { CHART_CONFIGURATIONS, CHART_COLORS } from '../constants/statistics-chart.constants';

@Injectable({
  providedIn: 'root'
})
export class ChartManagementService {
  private readonly statisticsService = inject(StatisticsService);
  private readonly progressCalculationService = inject(ProgressCalculationService);

  /**
   * Get initial chart configurations
   */
  getInitialChartConfigurations() {
    return {
      activityTypeChart: { ...CHART_CONFIGURATIONS.ACTIVITY_TYPE },
      intensityChart: { ...CHART_CONFIGURATIONS.INTENSITY },
      durationTrendChart: { ...CHART_CONFIGURATIONS.DURATION_TREND },
      weeklyGoalChart: { ...CHART_CONFIGURATIONS.GOAL_PROGRESS },
      monthlyGoalChart: { ...CHART_CONFIGURATIONS.GOAL_PROGRESS }
    };
  }

  /**
   * Update activity type chart with statistics data
   */
  updateActivityTypeChart(stats: UserStatistics): ChartConfiguration {
    const chartData = this.statisticsService.getActivityTypeChartData(stats);
    return {
      ...CHART_CONFIGURATIONS.ACTIVITY_TYPE,
      data: chartData
    };
  }

  /**
   * Update intensity chart with activities data
   */
  updateIntensityChart(activities: Activity[]): ChartConfiguration {
    const chartData = this.statisticsService.getIntensityLevelChartData(activities);
    return {
      ...CHART_CONFIGURATIONS.INTENSITY,
      data: chartData
    };
  }

  /**
   * Update duration trend chart with activities data
   */
  updateDurationTrendChart(activities: Activity[]): ChartConfiguration {
    const chartData = this.statisticsService.getDurationTrendChartData(activities);
    return {
      ...CHART_CONFIGURATIONS.DURATION_TREND,
      data: chartData
    };
  }

  /**
   * Update weekly goal chart with progress data
   */
  updateWeeklyGoalChart(activities: Activity[]): ChartConfiguration {
    const weeklyProgress = this.progressCalculationService.getWeeklyProgress(activities);
    return {
      ...CHART_CONFIGURATIONS.GOAL_PROGRESS,
      data: {
        labels: ['Completed', 'Remaining'],
        datasets: [{
          data: [weeklyProgress, 100 - weeklyProgress],
          backgroundColor: CHART_COLORS.WEEKLY_GOAL,
          borderWidth: 0
        }]
      }
    };
  }

  /**
   * Update monthly goal chart with progress data
   */
  updateMonthlyGoalChart(activities: Activity[]): ChartConfiguration {
    const monthlyProgress = this.progressCalculationService.getMonthlyProgress(activities);
    return {
      ...CHART_CONFIGURATIONS.GOAL_PROGRESS,
      data: {
        labels: ['Completed', 'Remaining'],
        datasets: [{
          data: [monthlyProgress, 100 - monthlyProgress],
          backgroundColor: CHART_COLORS.MONTHLY_GOAL,
          borderWidth: 0
        }]
      }
    };
  }

  /**
   * Update all charts with new data
   */
  updateAllCharts(stats: UserStatistics, activities: Activity[]) {
    return {
      activityTypeChart: this.updateActivityTypeChart(stats),
      intensityChart: this.updateIntensityChart(activities),
      durationTrendChart: this.updateDurationTrendChart(activities),
      weeklyGoalChart: this.updateWeeklyGoalChart(activities),
      monthlyGoalChart: this.updateMonthlyGoalChart(activities)
    };
  }
}
