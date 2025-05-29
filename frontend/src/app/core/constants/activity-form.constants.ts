import { Validators } from '@angular/forms';
import { ActivityType } from '../../shared/models/activity.model';

export interface MetadataFieldConfig {
  name: string;
  type: 'text' | 'number' | 'select' | 'array';
  label: string;
  validators?: any[];
  options?: { value: string; label: string }[];
  required?: boolean;
}

/**
 * Metadata field configurations for each activity type
 */
export const ACTIVITY_METADATA_FIELD_CONFIGS: { [key in ActivityType]?: MetadataFieldConfig[] } = {
  [ActivityType.SWIMMING]: [
    {
      name: 'poolSize',
      type: 'number',
      label: 'Pool Size (meters)',
      validators: [Validators.required, Validators.min(1)],
      required: true
    },
    {
      name: 'laps',
      type: 'number',
      label: 'Number of Laps',
      validators: [Validators.required, Validators.min(1)],
      required: true
    },
    {
      name: 'strokeType',
      type: 'select',
      label: 'Stroke Type',
      options: [
        { value: 'freestyle', label: 'Freestyle' },
        { value: 'backstroke', label: 'Backstroke' },
        { value: 'breaststroke', label: 'Breaststroke' },
        { value: 'butterfly', label: 'Butterfly' },
        { value: 'mixed', label: 'Mixed' }
      ]
    }
  ],

  [ActivityType.RUNNING]: [
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      validators: [Validators.required],
      required: true
    },
    {
      name: 'distance',
      type: 'number',
      label: 'Distance (km)',
      validators: [Validators.min(0.1)]
    },
    {
      name: 'pace',
      type: 'number',
      label: 'Average Pace (min/km)',
      validators: [Validators.min(1)]
    },
    {
      name: 'elevation',
      type: 'number',
      label: 'Elevation Gain (m)',
      validators: [Validators.min(0)]
    }
  ],

  [ActivityType.CYCLING]: [
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      validators: [Validators.required],
      required: true
    },
    {
      name: 'distance',
      type: 'number',
      label: 'Distance (km)',
      validators: [Validators.min(0.1)]
    },
    {
      name: 'avgSpeed',
      type: 'number',
      label: 'Average Speed (km/h)',
      validators: [Validators.min(1)]
    },
    {
      name: 'elevation',
      type: 'number',
      label: 'Elevation Gain (m)',
      validators: [Validators.min(0)]
    }
  ],

  [ActivityType.SKATING]: [
    {
      name: 'type',
      type: 'select',
      label: 'Skating Type',
      validators: [Validators.required],
      required: true,
      options: [
        { value: 'ice', label: 'Ice Skating' },
        { value: 'inline', label: 'Inline Skating' },
        { value: 'roller', label: 'Roller Skating' },
        { value: 'skateboard', label: 'Skateboarding' }
      ]
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      validators: [Validators.required],
      required: true
    },
    {
      name: 'distance',
      type: 'number',
      label: 'Distance (km)',
      validators: [Validators.min(0.1)]
    }
  ],

  [ActivityType.HORSE_RIDING]: [
    {
      name: 'discipline',
      type: 'select',
      label: 'Discipline',
      validators: [Validators.required],
      required: true,
      options: [
        { value: 'dressage', label: 'Dressage' },
        { value: 'jumping', label: 'Show Jumping' },
        { value: 'trail', label: 'Trail Riding' },
        { value: 'western', label: 'Western' },
        { value: 'endurance', label: 'Endurance' }
      ]
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      validators: [Validators.required],
      required: true
    },
    {
      name: 'horseName',
      type: 'text',
      label: 'Horse Name'
    }
  ],

  [ActivityType.GYM_WORKOUT]: [
    {
      name: 'workoutType',
      type: 'select',
      label: 'Workout Type',
      validators: [Validators.required],
      required: true,
      options: [
        { value: 'strength', label: 'Strength Training' },
        { value: 'cardio', label: 'Cardio' },
        { value: 'hiit', label: 'HIIT' },
        { value: 'crossfit', label: 'CrossFit' },
        { value: 'powerlifting', label: 'Powerlifting' },
        { value: 'bodybuilding', label: 'Bodybuilding' }
      ]
    },
    {
      name: 'exercises',
      type: 'array',
      label: 'Exercises'
    },
    {
      name: 'equipment',
      type: 'array',
      label: 'Equipment Used'
    }
  ]
};
