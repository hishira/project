import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivityHelperService {

  /**
   * Get activity type options for UI components
   */
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

  /**
   * Get difficulty level options for UI components
   */
  getDifficultyOptions() {
    return [
      { value: 1, label: 'Very Easy', color: '#4CAF50' },
      { value: 2, label: 'Easy', color: '#8BC34A' },
      { value: 3, label: 'Moderate', color: '#FF9800' },
      { value: 4, label: 'Hard', color: '#FF5722' },
      { value: 5, label: 'Very Hard', color: '#F44336' }
    ];
  }

  /**
   * Get human-readable label for difficulty level
   */
  getDifficultyLabel(difficulty: number): string {
    const options = this.getDifficultyOptions();
    return options.find(opt => opt.value === difficulty)?.label || 'Unknown';
  }

  /**
   * Get color for difficulty level
   */
  getDifficultyColor(difficulty: number): string {
    const options = this.getDifficultyOptions();
    return options.find(opt => opt.value === difficulty)?.color || '#9E9E9E';
  }

  /**
   * Get human-readable label for activity type
   */
  getActivityTypeLabel(type: string): string {
    const options = this.getActivityTypeOptions();
    return options.find(opt => opt.value === type)?.label || type;
  }

  /**
   * Get icon for activity type
   */
  getActivityTypeIcon(type: string): string {
    const options = this.getActivityTypeOptions();
    return options.find(opt => opt.value === type)?.icon || 'sports';
  }

  /**
   * Alias for getActivityTypeIcon for backward compatibility
   */
  getActivityIcon(type: string): string {
    return this.getActivityTypeIcon(type);
  }

  /**
   * Alternative method for difficulty label (backward compatibility)
   */
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
}
