import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

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

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    enum: ActivityType,
  })
  type: ActivityType;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column() // duration in minutes
  duration: number;

  @Column({
    type: 'int',
    enum: DifficultyLevel,
  })
  difficulty: DifficultyLevel;

  @Column({ type: 'date' })
  activityDate: Date;

  @Column({ type: 'json', nullable: true })
  metadata?: ActivityMetadata;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  caloriesBurned?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // @ManyToOne(() => User, (user) => user.activities, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'userLogin', referencedColumnName: 'login' })
  // user: User;

  @Column()
  userLogin: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
