import { Injectable, inject } from '@angular/core';
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
import { ActivityHelperService } from './activity-helper.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3000';
  private readonly activityHelper = inject(ActivityHelperService);

  constructor(private readonly http: HttpClient) {}

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

  // Helper methods for UI - delegate to ActivityHelperService
  getActivityTypeOptions() {
    return this.activityHelper.getActivityTypeOptions();
  }

  getDifficultyOptions() {
    return this.activityHelper.getDifficultyOptions();
  }

  getDifficultyLabel(difficulty: number): string {
    return this.activityHelper.getDifficultyLabel(difficulty);
  }

  getDifficultyColor(difficulty: number): string {
    return this.activityHelper.getDifficultyColor(difficulty);
  }

  getActivityTypeLabel(type: string): string {
    return this.activityHelper.getActivityTypeLabel(type);
  }

  getActivityTypeIcon(type: string): string {
    return this.activityHelper.getActivityTypeIcon(type);
  }

  // Additional helper methods for UI
  getActivityIcon(type: string): string {
    return this.activityHelper.getActivityIcon(type);
  }

  getDifficultyLevelLabel(difficulty: number): string {
    return this.activityHelper.getDifficultyLevelLabel(difficulty);
  }

  private readonly handleError = (error: any): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => errorMessage);
  };
}
