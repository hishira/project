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
  templateUrl: './activity-list.component.html',
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
