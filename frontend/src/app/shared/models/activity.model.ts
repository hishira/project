export enum ActivityType {
  RUNNING = 'running',
  SWIMMING = 'swimming',
  CYCLING = 'cycling',
  SKATING = 'skating',
  HORSE_RIDING = 'horse_riding',
  WALKING = 'walking',
  HIKING = 'hiking',
  GYM_WORKOUT = 'gym_workout',
  YOGA = 'yoga',
  TENNIS = 'tennis',
  FOOTBALL = 'football',
  BASKETBALL = 'basketball',
  OTHER = 'other',
}

export enum DifficultyLevel {
  VERY_EASY = 1,
  EASY = 2,
  MODERATE = 3,
  HARD = 4,
  VERY_HARD = 5,
}

export interface SwimmingMetadata {
  poolSize: number; // in meters
  laps: number;
  strokeType?: string; // freestyle, backstroke, breaststroke, butterfly
}

export interface RunningMetadata {
  location: 'treadmill' | 'outdoor' | 'track';
  distance?: number; // in kilometers
  pace?: number; // minutes per kilometer
  elevation?: number; // elevation gain in meters
}

export interface CyclingMetadata {
  distance?: number; // in kilometers
  location: 'indoor' | 'outdoor' | 'mountain' | 'road';
  avgSpeed?: number; // km/h
  elevation?: number; // elevation gain in meters
}

export interface SkatingMetadata {
  type: 'ice' | 'roller' | 'inline';
  distance?: number; // in kilometers
  location: 'indoor' | 'outdoor';
}

export interface HorseRidingMetadata {
  discipline: 'dressage' | 'jumping' | 'trail' | 'racing' | 'western' | 'other';
  location: 'indoor' | 'outdoor';
  horseName?: string;
}

export interface GymWorkoutMetadata {
  workoutType: 'strength' | 'cardio' | 'mixed';
  exercises?: string[];
  equipment?: string[];
}

export type ActivityMetadata =
  | SwimmingMetadata
  | RunningMetadata
  | CyclingMetadata
  | SkatingMetadata
  | HorseRidingMetadata
  | GymWorkoutMetadata
  | Record<string, any>; // for custom activities

export interface Activity {
  id: string;
  type: ActivityType;
  title: string; // Backend uses title
  description?: string;
  duration: number; // minutes
  difficulty: DifficultyLevel; // Backend uses difficulty (1-5)
  activityDate: string; // Backend uses activityDate, ISO string
  metadata?: ActivityMetadata;
  caloriesBurned?: number;
  notes?: string;
  userLogin: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateActivityDto {
  type: ActivityType;
  title: string; // Backend uses title
  description?: string;
  duration: number;
  difficulty: DifficultyLevel; // Backend uses difficulty (1-5)
  activityDate: string; // Backend uses activityDate, ISO string
  metadata?: ActivityMetadata;
  caloriesBurned?: number;
  notes?: string;
}

export interface UpdateActivityDto {
  type?: ActivityType;
  title?: string; // Backend uses title
  description?: string;
  duration?: number;
  difficulty?: DifficultyLevel; // Backend uses difficulty (1-5)
  activityDate?: string; // Backend uses activityDate, ISO string
  metadata?: ActivityMetadata;
  caloriesBurned?: number;
  notes?: string;
}

export interface ActivityFilterOptions {
  search?: string;
  type?: ActivityType;
  difficulty?: DifficultyLevel; // Backend uses difficulty (1-5)
  dateFrom?: string;
  dateTo?: string;
  offset?: number; // Backend uses offset instead of page
  limit?: number;
}
