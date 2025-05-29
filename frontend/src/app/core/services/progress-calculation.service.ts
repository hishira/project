import { Injectable } from '@angular/core';
import { Activity } from '../../shared/models/activity.model';
import { GOAL_TARGETS } from '../constants/statistics-chart.constants';

@Injectable({
  providedIn: 'root'
})
export class ProgressCalculationService {

  /**
   * Calculate weekly progress as a percentage
   */
  getWeeklyProgress(activities: Activity[]): number {
    if (!Array.isArray(activities)) {
      console.warn('Activities is not an array:', activities);
      return 0;
    }
    
    const weeklyActivitiesCount = this.getWeeklyActivitiesCount(activities);
    return Math.min(Math.round((weeklyActivitiesCount / GOAL_TARGETS.WEEKLY_ACTIVITIES) * 100), 100);
  }

  /**
   * Calculate monthly progress as a percentage
   */
  getMonthlyProgress(activities: Activity[]): number {
    if (!Array.isArray(activities)) {
      console.warn('Activities is not an array:', activities);
      return 0;
    }
    
    const monthlyActivitiesCount = this.getMonthlyActivitiesCount(activities);
    return Math.min(Math.round((monthlyActivitiesCount / GOAL_TARGETS.MONTHLY_ACTIVITIES) * 100), 100);
  }

  /**
   * Get count of activities in the last 7 days
   */
  getWeeklyActivitiesCount(activities: Activity[]): number {
    if (!Array.isArray(activities)) {
      console.warn('Activities is not an array in getWeeklyActivitiesCount:', activities);
      return 0;
    }
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return this.filterActivitiesByDateRange(activities, weekAgo, now).length;
  }

  /**
   * Get count of activities in the last 30 days
   */
  getMonthlyActivitiesCount(activities: Activity[]): number {
    if (!Array.isArray(activities)) {
      console.warn('Activities is not an array in getMonthlyActivitiesCount:', activities);
      return 0;
    }
    
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return this.filterActivitiesByDateRange(activities, monthAgo, now).length;
  }

  /**
   * Filter activities by date range
   */
  private filterActivitiesByDateRange(activities: Activity[], startDate: Date, endDate: Date): Activity[] {
    return activities.filter(activity => {
      const activityDate = new Date(activity.activityDate);
      return activityDate >= startDate && activityDate <= endDate;
    });
  }
}
