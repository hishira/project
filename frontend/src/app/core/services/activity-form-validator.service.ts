import { Injectable } from '@angular/core';
import { CreateActivityDto, ActivityMetadata } from '../../shared/models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityFormValidatorService {

  /**
   * Validate and transform form data to CreateActivityDto
   */
  transformFormToDto(formValue: any): CreateActivityDto {
    const activityData: CreateActivityDto = {
      title: formValue.title,
      type: formValue.type,
      activityDate: formValue.activityDate.toISOString(),
      duration: formValue.duration,
      difficulty: formValue.difficulty
    };

    // Only include optional fields if they have values
    this.addOptionalField(activityData, 'caloriesBurned', formValue.caloriesBurned);
    this.addOptionalTextField(activityData, 'description', formValue.description);
    this.addOptionalTextField(activityData, 'notes', formValue.notes);

    const cleanedMetadata = this.cleanMetadata(formValue.metadata);
    if (cleanedMetadata && Object.keys(cleanedMetadata).length > 0) {
      activityData.metadata = cleanedMetadata;
    }

    return activityData;
  }

  /**
   * Clean and validate metadata object
   */
  cleanMetadata(metadata: any): ActivityMetadata | undefined {
    if (!metadata || Object.keys(metadata).length === 0) {
      return undefined;
    }

    const cleaned: any = {};
    Object.keys(metadata).forEach(key => {
      const value = metadata[key];
      if (this.hasValue(value)) {
        cleaned[key] = this.transformMetadataValue(key, value);
      }
    });

    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }

  /**
   * Validate required fields for specific activity types
   */
  validateActivityTypeRequirements(activityType: string, metadata: any): string[] {
    const errors: string[] = [];
    
    const requiredFields = this.getRequiredFieldsForActivityType(activityType);
    
    requiredFields.forEach(field => {
      if (!metadata || !this.hasValue(metadata[field])) {
        errors.push(`${this.formatFieldName(field)} is required for ${activityType} activities`);
      }
    });

    return errors;
  }

  /**
   * Get display-friendly field configurations for UI
   */
  getFieldDisplayConfig(fieldName: string): { label: string; type: string; placeholder?: string } {
    const fieldConfigs: { [key: string]: any } = {
      poolSize: { label: 'Pool Size', type: 'number', placeholder: 'e.g., 25' },
      laps: { label: 'Number of Laps', type: 'number', placeholder: 'e.g., 20' },
      strokeType: { label: 'Stroke Type', type: 'select' },
      location: { label: 'Location', type: 'text', placeholder: 'e.g., Central Park' },
      distance: { label: 'Distance (km)', type: 'number', placeholder: 'e.g., 5.5' },
      pace: { label: 'Average Pace (min/km)', type: 'number', placeholder: 'e.g., 5.5' },
      elevation: { label: 'Elevation Gain (m)', type: 'number', placeholder: 'e.g., 100' },
      avgSpeed: { label: 'Average Speed (km/h)', type: 'number', placeholder: 'e.g., 25.5' },
      type: { label: 'Type', type: 'select' },
      discipline: { label: 'Discipline', type: 'select' },
      horseName: { label: 'Horse Name', type: 'text', placeholder: 'e.g., Thunder' },
      workoutType: { label: 'Workout Type', type: 'select' },
      exercises: { label: 'Exercises', type: 'array' },
      equipment: { label: 'Equipment Used', type: 'array' }
    };

    return fieldConfigs[fieldName] ?? { label: fieldName, type: 'text' };
  }

  /**
   * Private helper methods
   */
  private addOptionalField(dto: CreateActivityDto, field: keyof CreateActivityDto, value: any): void {
    if (value != null && value > 0) {
      (dto as any)[field] = value;
    }
  }

  private addOptionalTextField(dto: CreateActivityDto, field: keyof CreateActivityDto, value: string): void {
    if (value && value.trim()) {
      (dto as any)[field] = value.trim();
    }
  }

  private hasValue(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  private transformMetadataValue(key: string, value: any): any {
    // Convert numeric strings to numbers for specific fields
    const numericFields = ['poolSize', 'laps', 'distance', 'pace', 'elevation', 'avgSpeed'];
    
    if (numericFields.includes(key)) {
      return Number(value);
    } else if (Array.isArray(value)) {
      // Filter out empty array items
      const filteredArray = value.filter(item => item && item.trim());
      return filteredArray.length > 0 ? filteredArray : undefined;
    } else {
      return value;
    }
  }

  private getRequiredFieldsForActivityType(activityType: string): string[] {
    const requiredFieldsMap: { [key: string]: string[] } = {
      'swimming': ['poolSize', 'laps'],
      'running': ['location'],
      'cycling': ['location'],
      'skating': ['type', 'location'],
      'horse_riding': ['discipline', 'location'],
      'gym_workout': ['workoutType']
    };

    return requiredFieldsMap[activityType] || [];
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}
