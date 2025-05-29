import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { ActivityService } from '../../core/services/activity.service';
import { StatisticsService } from '../../core/services/statistics.service';
import { Activity } from '../../shared/models/activity.model';
import { UserStatistics } from '../../shared/models/statistics.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
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
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .dashboard-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .app-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 500;
    }

    .title-icon {
      font-size: 24px;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .welcome-text {
      color: white;
      font-weight: 500;
    }

    .dashboard-content {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .stats-section,
    .recent-activities-section,
    .quick-actions-section {
      margin-bottom: 32px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .section-header h2 {
      margin: 0;
      color: #333;
      font-weight: 500;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 32px;
      height: 56px;
      width: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.activities { background-color: #e3f2fd; color: #1976d2; }
    .stat-icon.duration { background-color: #f3e5f5; color: #7b1fa2; }
    .stat-icon.calories { background-color: #fff3e0; color: #f57c00; }
    .stat-icon.distance { background-color: #e8f5e8; color: #388e3c; }

    .stat-details {
      flex: 1;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      line-height: 1;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      margin-top: 4px;
    }

    .activities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .activity-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s ease;
    }

    .activity-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .activity-avatar {
      background-color: #667eea;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .activity-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .activity-detail {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }

    .detail-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
    }

    .activity-type {
      margin-top: 12px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .action-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s ease;
      text-align: center;
      padding: 16px;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .action-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #667eea;
      margin-bottom: 16px;
    }

    .action-card h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-weight: 500;
    }

    .action-card p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .empty-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #ccc;
    }

    .empty-content h3 {
      margin: 0;
      color: #666;
    }

    .empty-content p {
      margin: 0;
      color: #999;
      max-width: 400px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px;
      color: #666;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 16px;
      }

      .toolbar-content {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .section-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .activities-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .welcome-text {
        display: none;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentActivities: Activity[] = [];
  statistics: UserStatistics | null = null;
  overviewData: any = null;
  isLoading = true;

  constructor(
    private authService: AuthService,
    public activityService: ActivityService,
    private statisticsService: StatisticsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load recent activities
    this.activityService.getRecentActivities(6).subscribe({
      next: (activities) => {
        this.recentActivities = activities;
      },
      error: (error) => {
        console.error('Error loading recent activities:', error);
      }
    });

    // Load statistics
    this.statisticsService.getUserStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.overviewData = this.statisticsService.prepareOverviewData(stats);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.snackBar.open('Logged out successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if logout fails on server, we're redirected by the auth service
      }
    });
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
      'LOW': '#4CAF50',
      'MODERATE': '#FFC107', 
      'HIGH': '#FF9800',
      'VERY_HIGH': '#F44336'
    };
    return colors[level as keyof typeof colors] || '#666';
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
