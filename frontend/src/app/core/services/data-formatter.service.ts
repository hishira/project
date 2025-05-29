import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFormatterService {

  /**
   * Format duration from minutes to human-readable string
   */
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    
    return `${mins}m`;
  }

  /**
   * Format record type from camelCase to readable string
   */
  formatRecordType(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Format distance with appropriate units
   */
  formatDistance(distance: number, unit: string = 'km'): string {
    if (distance < 1 && unit === 'km') {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${Math.round(distance * 100) / 100} ${unit}`;
  }

  /**
   * Format calories burned
   */
  formatCalories(calories: number): string {
    return `${Math.round(calories)} cal`;
  }

  /**
   * Format difficulty level to readable string
   */
  formatDifficultyLevel(difficulty: number): string {
    const levels: { [key: number]: string } = {
      1: 'Very Easy',
      2: 'Easy',
      3: 'Moderate',
      4: 'Hard',
      5: 'Very Hard'
    };
    return levels[difficulty] ?? 'Unknown';
  }

  /**
   * Format activity type to readable string
   */
  formatActivityType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'running': 'Running',
      'swimming': 'Swimming',
      'cycling': 'Cycling',
      'skating': 'Skating',
      'horse_riding': 'Horse Riding',
      'walking': 'Walking',
      'hiking': 'Hiking',
      'gym_workout': 'Gym Workout',
      'yoga': 'Yoga',
      'tennis': 'Tennis',
      'football': 'Football',
      'basketball': 'Basketball',
      'other': 'Other'
    };
    return typeMap[type] ?? type;
  }

  /**
   * Format date to relative time (e.g., "2 days ago")
   */
  formatRelativeDate(date: string | Date): string {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    
    return `${Math.floor(diffInDays / 365)} years ago`;
  }

  /**
   * Round number to specified decimal places
   */
  roundToDecimal(value: number, decimals: number = 1): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}
