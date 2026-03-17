import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from '@angular/router';
import { AdminDirective } from '../../core/directives/admin.directive';
import { ActivityService } from '../../core/services/activity.service';
import { StatisticsService } from '../../core/services/statistics.service';
import { Activity } from '../../shared/models/activity.model';
import { AdminStatistics } from '../../shared/models/statistics.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDividerModule,
    AdminDirective,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  recentActivities: WritableSignal<Activity[]> = signal([]);
  statistics: AdminStatistics | null = null;
  overviewData: any = null;
  isLoading = true;

  constructor(
    public activityService: ActivityService,
    private statisticsService: StatisticsService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load recent activities
    this.activityService.getRecentActivities(6).subscribe({
      next: (activities) => {
        this.recentActivities.set(activities);
      },
      error: (error) => {
        console.error('Error loading recent activities:', error);
      },
    });

    this.statistics = {
      totalUsers: 67,
      totalApps: 3,
      totalAgreements: 5,
      charts: 8,
    } as AdminStatistics;
    // Load statistics
    // this.statisticsService.getUserStatistics().subscribe({
    //   next: (stats) => {
    //     //this.statistics = stats;
    //     this.overviewData = this.statisticsService.prepareOverviewData(stats);
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading statistics:', error);
    //     this.isLoading = false;
    //   }
    // });
  }
  getActivityIcon(type: string): string {
    return this.activityService.getActivityIcon(type);
  }

  getActivityTypeLabel(type: string): string {
    return this.activityService.getActivityTypeLabel(type);
  }

  getDifficultyLevelLabel(difficulty: number): string {
    return this.activityService.getDifficultyLevelLabel(difficulty);
  }

  getActivityLevelColor(level: string): string {
    const colors = {
      LOW: '#4CAF50',
      MODERATE: '#FFC107',
      HIGH: '#FF9800',
      VERY_HIGH: '#F44336',
    };
    return colors[level as keyof typeof colors] || '#666';
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
