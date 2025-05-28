import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityService } from '../../../core/services/activity.service';
import { Activity } from '../../../shared/models/activity.model';
import { format } from 'date-fns';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  template: `
    <div class="activity-detail-container">
      <!-- Header -->
      <mat-toolbar class="detail-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Activity Details</h1>
        <span class="spacer"></span>
        @if (activity()) {
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="editActivity()">
              <mat-icon>edit</mat-icon>
              <span>Edit Activity</span>
            </button>
            <button mat-menu-item (click)="deleteActivity()">
              <mat-icon>delete</mat-icon>
              <span>Delete Activity</span>
            </button>
          </mat-menu>
        }
      </mat-toolbar>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading activity details...</p>
        </div>
      }

      <!-- Activity Details -->
      @if (!isLoading() && activity()) {
        <div class="activity-content">
          <!-- Main Info Card -->
          <mat-card class="main-info-card">
            <mat-card-header>
              <div mat-card-avatar class="activity-avatar">
                <mat-icon>{{ activityService.getActivityIcon(activity()!.type) }}</mat-icon>
              </div>
              <mat-card-title>{{ activity()!.title }}</mat-card-title>
              <mat-card-subtitle>
                {{ formatDate(activity()!.activityDate) }}
              </mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              @if (activity()!.description) {
                <p class="activity-description">{{ activity()!.description }}</p>
              }
              
              <div class="activity-tags">
                <mat-chip-set>
                  <mat-chip>
                    <mat-icon matChipAvatar>{{ activityService.getActivityIcon(activity()!.type) }}</mat-icon>
                    {{ activityService.getActivityTypeLabel(activity()!.type) }}
                  </mat-chip>
                  <mat-chip color="accent">
                    {{ activityService.getDifficultyLabel(activity()!.difficulty) }}
                  </mat-chip>
                </mat-chip-set>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Statistics Cards -->
          <div class="stats-grid">
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">schedule</mat-icon>
                  <div class="stat-info">
                    <h3>{{ activity()!.duration }}</h3>
                    <p>Minutes</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            @if (activity()!.caloriesBurned) {
              <mat-card class="stat-card">
                <mat-card-content>
                  <div class="stat-content">
                    <mat-icon class="stat-icon calories">local_fire_department</mat-icon>
                    <div class="stat-info">
                      <h3>{{ activity()!.caloriesBurned }}</h3>
                      <p>Calories</p>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            }

            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">fitness_center</mat-icon>
                  <div class="stat-info">
                    <h3>{{ getIntensityScore() }}</h3>
                    <p>Intensity</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">event</mat-icon>
                  <div class="stat-info">
                    <h3>{{ formatTime(activity()!.activityDate) }}</h3>
                    <p>Time</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Additional Information -->
          <mat-card class="info-card">
            <mat-card-header>
              <mat-card-title>Additional Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="info-grid">
                <div class="info-item">
                  <strong>Created:</strong>
                  <span>{{ formatDateTime(activity()!.createdAt!.toString()) }}</span>
                </div>
                @if (activity()!.updatedAt !== activity()!.createdAt) {
                  <div class="info-item">
                    <strong>Last Updated:</strong>
                    <span>{{ formatDateTime(activity()!.updatedAt!.toString()) }}</span>
                  </div>
                }
                <div class="info-item">
                  <strong>Activity ID:</strong>
                  <span>{{ activity()!.id }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      }

      <!-- Error State -->
      @if (!isLoading() && !activity()) {
        <div class="error-state">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <h2>Activity Not Found</h2>
          <p>The activity you're looking for could not be found.</p>
          <button mat-raised-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back to Activities
          </button>
        </div>
      }
    </div>
  `,
  styleUrls: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public activityService = inject(ActivityService);
  private snackBar = inject(MatSnackBar);

  activity = signal<Activity | null>(null);
  isLoading = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadActivity(id);
    }
  }

  private loadActivity(id: string) {
    this.isLoading.set(true);
    this.activityService.getActivity(id).subscribe({
      next: (activity) => {
        this.activity.set(activity);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.snackBar.open('Failed to load activity', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  editActivity() {
    if (this.activity()) {
      this.router.navigate(['/activities/edit', this.activity()!.id]);
    }
  }

  deleteActivity() {
    if (!this.activity()) return;

    if (confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
      this.activityService.deleteActivity(this.activity()!.id!).subscribe({
        next: () => {
          this.snackBar.open('Activity deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/activities']);
        },
        error: () => {
          this.snackBar.open('Failed to delete activity', 'Close', { duration: 3000 });
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/activities']);
  }

  formatDate(date: string): string {
    return format(new Date(date), 'EEEE, MMMM do, yyyy');
  }

  formatTime(date: string): string {
    return format(new Date(date), 'HH:mm');
  }

  formatDateTime(date: string): string {
    return format(new Date(date), 'MMM dd, yyyy at HH:mm');
  }

  getIntensityScore(): string {
    const activity = this.activity();
    if (!activity) return '0';
    
    const difficultyScores = {
      1: '2',
      2: '4', 
      3: '6',
      4: '8',
      5: '10'
    };
    
    return difficultyScores[activity.difficulty] || '0';
  }
}
