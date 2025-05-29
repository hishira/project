import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Activity,
  CreateActivityDto,
  UpdateActivityDto,
  ActivityFilterOptions,
  ActivitiesResponse
} from '../../shared/models/activity.model';
import { ActivityStatistics } from '../../shared/models/statistics.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Activity CRUD operations
  createActivity(activityDto: CreateActivityDto): Observable<Activity> {
    return this.http.post<Activity>(`${this.API_URL}/activities`, activityDto)
      .pipe(catchError(this.handleError));
  }

  getActivities(filters?: ActivityFilterOptions): Observable<ActivitiesResponse> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.type) params = params.set('type', filters.type);
      if (filters.difficulty) params = params.set('difficulty', filters.difficulty.toString());
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.offset !== undefined) params = params.set('offset', filters.offset.toString());
    }

    return this.http.get<ActivitiesResponse>(`${this.API_URL}/activities`, { params })
      .pipe(catchError(this.handleError));
  }

  getActivity(id: string): Observable<Activity> {
    return this.http.get<Activity>(`${this.API_URL}/activities/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateActivity(id: string, activityDto: UpdateActivityDto): Observable<Activity> {
    return this.http.patch<Activity>(`${this.API_URL}/activities/${id}`, activityDto)
      .pipe(catchError(this.handleError));
  }

  deleteActivity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/activities/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Recent activities
  getRecentActivities(limit?: number): Observable<Activity[]> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit.toString());

    return this.http.get<Activity[]>(`${this.API_URL}/activities/recent`, { params })
      .pipe(catchError(this.handleError));
  }

  // Activity statistics
  getActivityStatistics(dateFrom?: string, dateTo?: string): Observable<ActivityStatistics> {
    let params = new HttpParams();
    if (dateFrom) params = params.set('dateFrom', dateFrom);
    if (dateTo) params = params.set('dateTo', dateTo);

    return this.http.get<ActivityStatistics>(`${this.API_URL}/activities/statistics`, { params })
      .pipe(catchError(this.handleError));
  }

  // Helper methods for UI
  getActivityTypeOptions() {
    return [
      { value: 'running', label: 'Running', icon: 'directions_run' },
      { value: 'swimming', label: 'Swimming', icon: 'pool' },
      { value: 'cycling', label: 'Cycling', icon: 'directions_bike' },
      { value: 'skating', label: 'Skating', icon: 'sports' },
      { value: 'horse_riding', label: 'Horse Riding', icon: 'pets' },
      { value: 'walking', label: 'Walking', icon: 'directions_walk' },
      { value: 'hiking', label: 'Hiking', icon: 'terrain' },
      { value: 'gym_workout', label: 'Gym Workout', icon: 'fitness_center' },
      { value: 'yoga', label: 'Yoga', icon: 'spa' },
      { value: 'tennis', label: 'Tennis', icon: 'sports_tennis' },
      { value: 'football', label: 'Football', icon: 'sports_soccer' },
      { value: 'basketball', label: 'Basketball', icon: 'sports_basketball' },
      { value: 'other', label: 'Other', icon: 'sports' }
    ];
  }

  getDifficultyOptions() {
    return [
      { value: 1, label: 'Very Easy', color: '#4CAF50' },
      { value: 2, label: 'Easy', color: '#8BC34A' },
      { value: 3, label: 'Moderate', color: '#FF9800' },
      { value: 4, label: 'Hard', color: '#FF5722' },
      { value: 5, label: 'Very Hard', color: '#F44336' }
    ];
  }

  getDifficultyLabel(difficulty: number): string {
    const options = this.getDifficultyOptions();
    return options.find(opt => opt.value === difficulty)?.label || 'Unknown';
  }

  getDifficultyColor(difficulty: number): string {
    const options = this.getDifficultyOptions();
    return options.find(opt => opt.value === difficulty)?.color || '#9E9E9E';
  }

  getActivityTypeLabel(type: string): string {
    const options = this.getActivityTypeOptions();
    return options.find(opt => opt.value === type)?.label || type;
  }

  getActivityTypeIcon(type: string): string {
    const options = this.getActivityTypeOptions();
    return options.find(opt => opt.value === type)?.icon || 'sports';
  }

  // Additional helper methods for UI
  getActivityIcon(type: string): string {
    return this.getActivityTypeIcon(type);
  }

  getDifficultyLevelLabel(difficulty: number): string {
    const difficultyLabels: { [key: number]: string } = {
      1: 'Very Easy',
      2: 'Easy', 
      3: 'Moderate',
      4: 'Hard',
      5: 'Very Hard'
    };
    return difficultyLabels[difficulty] || 'Unknown';
  }

  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(errorMessage);
  };
}
