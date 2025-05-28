import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export interface BestRecord {
  value: number;
  unit: string;
  activityId: string;
  achievedAt: Date;
  activityTitle?: string;
}

export interface DistanceRecords {
  longestRun?: BestRecord; // km
  longestSwim?: BestRecord; // km
  longestCycle?: BestRecord; // km
  longestSkate?: BestRecord; // km
  longestWalk?: BestRecord; // km
  longestHike?: BestRecord; // km
}

export interface SpeedRecords {
  fastestRunPace?: BestRecord; // min/km (lower is better)
  fastestCyclingSpeed?: BestRecord; // km/h
  fastestSwimmingPace?: BestRecord; // min/100m
}

export interface GeneralRecords {
  mostCaloriesBurned?: BestRecord; // single activity
  longestDuration?: BestRecord; // minutes
  hardestDifficulty?: BestRecord; // difficulty level achieved
  mostActivitiesInWeek?: BestRecord; // count
  mostActivitiesInMonth?: BestRecord; // count
}

@Entity('user_statistics')
export class UserStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userLogin', referencedColumnName: 'login' })
  user: User;

  @Column({ unique: true })
  userLogin: string;

  // === CUMULATIVE DISTANCES ===
  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  totalRunningDistance: number; // km

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  totalSwimmingDistance: number; // km

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  totalCyclingDistance: number; // km

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  totalSkatingDistance: number; // km

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  totalWalkingDistance: number; // km

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  totalHikingDistance: number; // km

  // === CUMULATIVE ACTIVITY COUNTS ===
  @Column({ type: 'int', default: 0 })
  totalRunningActivities: number;

  @Column({ type: 'int', default: 0 })
  totalSwimmingActivities: number;

  @Column({ type: 'int', default: 0 })
  totalCyclingActivities: number;

  @Column({ type: 'int', default: 0 })
  totalSkatingActivities: number;

  @Column({ type: 'int', default: 0 })
  totalWalkingActivities: number;

  @Column({ type: 'int', default: 0 })
  totalHikingActivities: number;

  @Column({ type: 'int', default: 0 })
  totalGymWorkoutActivities: number;

  @Column({ type: 'int', default: 0 })
  totalYogaActivities: number;

  @Column({ type: 'int', default: 0 })
  totalTennisActivities: number;

  @Column({ type: 'int', default: 0 })
  totalFootballActivities: number;

  @Column({ type: 'int', default: 0 })
  totalBasketballActivities: number;

  @Column({ type: 'int', default: 0 })
  totalHorseRidingActivities: number;

  @Column({ type: 'int', default: 0 })
  totalOtherActivities: number;

  // === CUMULATIVE TOTALS ===
  @Column({ type: 'int', default: 0 })
  totalActivities: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalDuration: number; // minutes

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCaloriesBurned: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  totalDistanceAllActivities: number; // km (sum of all distance-based activities)

  // === SWIMMING SPECIFIC ===
  @Column({ type: 'int', default: 0 })
  totalSwimmingLaps: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSwimmingDuration: number; // minutes

  // === BEST RECORDS ===
  @Column({ type: 'json', nullable: true })
  distanceRecords?: DistanceRecords;

  @Column({ type: 'json', nullable: true })
  speedRecords?: SpeedRecords;

  @Column({ type: 'json', nullable: true })
  generalRecords?: GeneralRecords;

  // === STREAKS ===
  @Column({ type: 'int', default: 0 })
  currentStreak: number; // consecutive days with activities

  @Column({ type: 'int', default: 0 })
  longestStreak: number; // best streak ever

  @Column({ type: 'date', nullable: true })
  lastActivityDate?: Date;

  // === AVERAGES ===
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  averageDifficulty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageDuration: number; // minutes

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageCaloriesPerActivity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
