import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { ActivityService } from '../../../core/services/activity.service';
import { Activity, ActivityType } from '../../../shared/models/activity.model';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule
  ],
  template: `
    <div class="activities-container">
      <!-- Header -->
      <mat-toolbar class="activities-header">
        <h1>My Activities</h1>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" routerLink="/activities/create">
          <mat-icon>add</mat-icon>
          Add Activity
        </button>
      </mat-toolbar>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <form [formGroup]="filterForm" class="filters-form">
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput formControlName="search" placeholder="Search activities...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Activity Type</mat-label>
              <mat-select formControlName="type">
                <mat-option value="">All Types</mat-option>
                @for (type of activityTypes; track type.value) {
                  <mat-option [value]="type.value">
                    <mat-icon>{{ activityService.getActivityIcon(type.value) }}</mat-icon>
                    {{ type.label }}
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Difficulty Level</mat-label>
              <mat-select formControlName="difficulty">
                <mat-option value="">All Levels</mat-option>
                @for (level of activityLevels; track level.value) {
                  <mat-option [value]="level.value">{{ level.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <button mat-button type="button" (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Clear Filters
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading activities...</p>
        </div>
      }

      <!-- Activities List -->
      @if (!isLoading() && activities().length > 0) {
        <div class="activities-grid">
          @for (activity of activities(); track activity.id) {
            <mat-card class="activity-card" [routerLink]="['/activities', activity.id]">
              <mat-card-header>
                <div mat-card-avatar class="activity-avatar">
                  <mat-icon>{{ activityService.getActivityIcon(activity.type) }}</mat-icon>
                </div>
                <mat-card-title>{{ activity.title }}</mat-card-title>
                <mat-card-subtitle>
                  {{ formatDate(activity.activityDate) }} • {{ activity.duration }} minutes
                </mat-card-subtitle>
                <button mat-icon-button [matMenuTriggerFor]="menu" (click)="$event.stopPropagation()">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item [routerLink]="['/activities/edit', activity.id]">
                    <mat-icon>edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item (click)="deleteActivity(activity.id!)">
                    <mat-icon>delete</mat-icon>
                    <span>Delete</span>
                  </button>
                </mat-menu>
              </mat-card-header>
              
              <mat-card-content>
                @if (activity.description) {
                  <p class="activity-description">{{ activity.description }}</p>
                }
                
                <div class="activity-stats">
                  <mat-chip-set>
                    <mat-chip>
                      <mat-icon matChipAvatar>{{ activityService.getActivityIcon(activity.type) }}</mat-icon>
                      {{ activityService.getActivityTypeLabel(activity.type) }}
                    </mat-chip>
                    <mat-chip color="accent">
                      {{ activityService.getDifficultyLevelLabel(activity.difficulty) }}
                    </mat-chip>
                    @if (activity.caloriesBurned) {
                      <mat-chip>
                        <mat-icon matChipAvatar>local_fire_department</mat-icon>
                        {{ activity.caloriesBurned }} cal
                      </mat-chip>
                    }
                  </mat-chip-set>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>

        <!-- Pagination -->
        <mat-paginator 
          [length]="totalCount()"
          [pageSize]="pageSize()"
          [pageSizeOptions]="[6, 12, 24, 48]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      }

      <!-- Empty State -->
      @if (!isLoading() && activities().length === 0) {
        <div class="empty-state">
          <mat-icon class="empty-icon">fitness_center</mat-icon>
          <h2>No Activities Found</h2>
          @if (hasActiveFilters()) {
            <p>Try adjusting your filters or search terms.</p>
            <button mat-raised-button (click)="clearFilters()">Clear Filters</button>
          } @else {
            <p>Start tracking your fitness journey by adding your first activity!</p>
            <button mat-raised-button color="primary" routerLink="/activities/create">
              <mat-icon>add</mat-icon>
              Add Your First Activity
            </button>
          }
        </div>
      }
    </div>
  `,
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {
  public activityService = inject(ActivityService);
  private fb = inject(FormBuilder);

  activities = signal<Activity[]>([]);
  isLoading = signal(false);
  totalCount = signal(0);
  pageSize = signal(12);
  pageIndex = signal(0);

  filterForm: FormGroup = this.fb.group({
    search: [''],
    type: [''],
    difficulty: ['']
  });

  activityTypes = Object.values(ActivityType).map(type => ({
    value: type,
    label: this.activityService.getActivityTypeLabel(type)
  }));

  activityLevels = [
    { value: 1, label: this.activityService.getDifficultyLevelLabel(1) },
    { value: 2, label: this.activityService.getDifficultyLevelLabel(2) },
    { value: 3, label: this.activityService.getDifficultyLevelLabel(3) },
    { value: 4, label: this.activityService.getDifficultyLevelLabel(4) },
    { value: 5, label: this.activityService.getDifficultyLevelLabel(5) }
  ];

  ngOnInit() {
    this.setupFilters();
    this.loadActivities();
  }

  private setupFilters() {
    this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.pageIndex.set(0);
      this.loadActivities();
    });
  }

  private loadActivities() {
    this.isLoading.set(true);
    const filters = this.filterForm.value;
    
    this.activityService.getActivities({
      search: filters.search || undefined,
      type: filters.type || undefined,
      difficulty: filters.difficulty || undefined,
      page: this.pageIndex() + 1,
      limit: this.pageSize()
    }).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        
        const activitiesData = this.extractActivitiesFromResponse(response);
        const processedActivities = this.processActivitiesData(activitiesData);
        const totalCount = this.extractTotalCount(response, processedActivities.length);
        
        this.activities.set(processedActivities);
        this.totalCount.set(totalCount);
        
        console.log('Processed activities:', this.activities());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.isLoading.set(false);
      }
    });
  }

  private extractActivitiesFromResponse(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }
    
    if (response && typeof response === 'object') {
      const possibleArrayProperties = ['data', 'activities', 'items', 'results'];
      for (const prop of possibleArrayProperties) {
        if (response[prop] && Array.isArray(response[prop])) {
          return response[prop];
        }
      }
    }
    
    return [];
  }

  private processActivitiesData(activitiesData: any[]): any[] {
    return activitiesData.map((activity: any) => ({
      ...activity,
      difficulty: typeof activity.difficulty === 'string' 
        ? parseInt(activity.difficulty, 10) 
        : activity.difficulty
    }));
  }

  private extractTotalCount(response: any, activitiesLength: number): number {
    if (response && typeof response === 'object' && !Array.isArray(response)) {
      return response.total || response.count || activitiesLength;
    }
    return activitiesLength;
  }

  onPageChange(event: any) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadActivities();
  }

  clearFilters() {
    this.filterForm.reset();
  }

  hasActiveFilters(): boolean {
    const values = this.filterForm.value;
    return !!(values.search || values.type || values.difficulty);
  }

  deleteActivity(id: string) {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.activityService.deleteActivity(id).subscribe(() => {
        this.loadActivities();
      });
    }
  }

  formatDate(date: string): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }
}
