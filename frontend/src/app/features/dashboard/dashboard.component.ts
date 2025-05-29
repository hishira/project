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
  template: `
    <div class="dashboard-container">
      <!-- Toolbar -->
      <mat-toolbar color="primary" class="dashboard-toolbar">
        <div class="toolbar-content">
          <div class="app-title">
            <mat-icon class="title-icon">sports</mat-icon>
            <span>Sports Activity Diary</span>
          </div>
          
          <div class="user-menu">
            <span class="welcome-text">Welcome, {{currentUser?.firstName || currentUser?.login}}!</span>
            <button mat-icon-button [matMenuTriggerFor]="userMenu">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item routerLink="/dashboard">
                <mat-icon>dashboard</mat-icon>
                <span>Dashboard</span>
              </button>
              <button mat-menu-item routerLink="/activities">
                <mat-icon>list</mat-icon>
                <span>Activities</span>
              </button>
              <button mat-menu-item routerLink="/statistics">
                <mat-icon>bar_chart</mat-icon>
                <span>Statistics</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </mat-toolbar>

      <!-- Dashboard Content -->
      <div class="dashboard-content">
        <!-- Quick Stats -->
        <div class="stats-section">
          <h2>Quick Overview</h2>
          <div class="stats-grid" *ngIf="statistics; else loadingStats">
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-item">
                  <mat-icon class="stat-icon activities">fitness_center</mat-icon>
                  <div class="stat-details">
                    <div class="stat-value">{{overviewData?.totalActivities || 0}}</div>
                    <div class="stat-label">Total Activities</div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-item">
                  <mat-icon class="stat-icon duration">schedule</mat-icon>
                  <div class="stat-details">
                    <div class="stat-value">{{overviewData?.totalDuration || '0m'}}</div>
                    <div class="stat-label">Total Duration</div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-item">
                  <mat-icon class="stat-icon calories">local_fire_department</mat-icon>
                  <div class="stat-details">
                    <div class="stat-value">{{overviewData?.totalCalories || 0}}</div>
                    <div class="stat-label">Total Calories</div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-item">
                  <mat-icon class="stat-icon distance">map</mat-icon>
                  <div class="stat-details">
                    <div class="stat-value">{{overviewData?.totalDistance || 0}} km</div>
                    <div class="stat-label">Total Distance</div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <ng-template #loadingStats>
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Loading statistics...</p>
            </div>
          </ng-template>
        </div>

        <!-- Recent Activities -->
        <div class="recent-activities-section">
          <div class="section-header">
            <h2>Recent Activities</h2>
            <button mat-raised-button color="primary" routerLink="/activities/create">
              <mat-icon>add</mat-icon>
              Add Activity
            </button>
          </div>

          <div class="activities-grid" *ngIf="recentActivities.length > 0; else noActivities">
            <mat-card class="activity-card" *ngFor="let activity of recentActivities">
              <mat-card-header>
                <div mat-card-avatar class="activity-avatar">
                  <mat-icon>{{getActivityIcon(activity.type)}}</mat-icon>
                </div>
                <mat-card-title>{{activity.title}}</mat-card-title>
                <mat-card-subtitle>{{formatDate(activity.activityDate)}}</mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <div class="activity-details">
                  <div class="activity-detail">
                    <mat-icon class="detail-icon">schedule</mat-icon>
                    <span>{{activity.duration}} min</span>
                  </div>
                  <div class="activity-detail">
                    <mat-icon class="detail-icon">trending_up</mat-icon>
                    <span>{{activityService.getDifficultyLevelLabel(activity.difficulty)}}</span>
                  </div>
                  <div class="activity-detail" *ngIf="activity.caloriesBurned">
                    <mat-icon class="detail-icon">local_fire_department</mat-icon>
                    <span>{{activity.caloriesBurned}} cal</span>
                  </div>
                </div>
                
                <div class="activity-type">
                  <mat-chip-set>
                    <mat-chip [style.background-color]="activityService.getDifficultyColor(activity.difficulty)">
                      {{getActivityTypeLabel(activity.type)}}
                    </mat-chip>
                  </mat-chip-set>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <button mat-button routerLink="/activities/{{activity.id}}">
                  <mat-icon>visibility</mat-icon>
                  View
                </button>
                <button mat-button routerLink="/activities/{{activity.id}}/edit">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
              </mat-card-actions>
            </mat-card>
          </div>

          <ng-template #noActivities>
            <mat-card class="empty-state">
              <mat-card-content>
                <div class="empty-content">
                  <mat-icon class="empty-icon">fitness_center</mat-icon>
                  <h3>No activities yet</h3>
                  <p>Start tracking your fitness journey by adding your first activity!</p>
                  <button mat-raised-button color="primary" routerLink="/activities/create">
                    <mat-icon>add</mat-icon>
                    Add Your First Activity
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          </ng-template>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-section">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <mat-card class="action-card" routerLink="/activities">
              <mat-card-content>
                <mat-icon class="action-icon">list</mat-icon>
                <h3>View All Activities</h3>
                <p>Browse and manage all your recorded activities</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="action-card" routerLink="/statistics">
              <mat-card-content>
                <mat-icon class="action-icon">bar_chart</mat-icon>
                <h3>View Statistics</h3>
                <p>Analyze your progress with detailed charts and insights</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="action-card" routerLink="/activities/create">
              <mat-card-content>
                <mat-icon class="action-icon">add_circle</mat-icon>
                <h3>Log New Activity</h3>
                <p>Record a new workout or sports activity</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
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
