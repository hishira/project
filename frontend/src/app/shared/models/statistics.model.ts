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

export interface AdminStatistics {
  id: string;
  userLogin: string;
  
  // Cumulative distances
  totalRunningDistance: number; // km
  totalSwimmingDistance: number; // km
  totalCyclingDistance: number; // km
  totalSkatingDistance: number; // km
  totalWalkingDistance: number; // km
  totalHikingDistance: number; // km
  
  // Activity counts
  totalRunningActivities: number;
  totalSwimmingActivities: number;
  totalCyclingActivities: number;
  totalSkatingActivities: number;
  totalWalkingActivities: number;
  totalHikingActivities: number;
  totalGymWorkoutActivities: number;
  totalYogaActivities: number;
  totalTennisActivities: number;
  totalFootballActivities: number;
  totalBasketballActivities: number;
  totalHorseRidingActivities: number;
  totalOtherActivities: number;
  
  // Cumulative totals
  totalActivities: number;
  totalDuration: number; // minutes
  totalCaloriesBurned: number;
  totalDistanceAllActivities: number; // km
  
  // Swimming specific
  totalSwimmingLaps: number;
  totalSwimmingDuration: number; // minutes
  
  // Best records
  distanceRecords?: DistanceRecords;
  speedRecords?: SpeedRecords;
  generalRecords?: GeneralRecords;
  
  // Streaks
  currentStreak: number; // consecutive days with activities
  longestStreak: number; // best streak ever
  lastActivityDate?: Date;
  
  // Averages
  averageDifficulty: number;
  averageDuration: number; // minutes
  averageCaloriesPerActivity: number;
  
  createdAt: Date;
  updatedAt: Date;

  totalUsers?: number;
  totalApps?: number;
  totalAgreements?: number;
}

export interface ActivityStatistics {
  totalActivities: number;
  totalDuration: number; // minutes
  totalCaloriesBurned: number;
  totalDistance: number; // km
  averageDifficulty: number;
  averageDuration: number; // minutes
  averageCaloriesPerActivity: number;
  activitiesByType: Record<string, number>;
  activitiesByDifficulty: Record<number, number>;
  weeklyStats: {
    week: string;
    count: number;
    duration: number;
    calories: number;
  }[];
  monthlyStats: {
    month: string;
    count: number;
    duration: number;
    calories: number;
  }[];
}

// Frontend-specific statistics interfaces
export interface Statistics {
  totalActivities: number;
  totalDuration: number; // minutes
  totalCalories?: number;
  averageDuration?: number;
  
  // Weekly/monthly aggregations
  weeklyStats?: WeeklyData;
  monthlyStats?: MonthlyData;
  
  // Activity type distribution
  activityTypeDistribution?: { [key: string]: number };
  intensityDistribution?: { [key: string]: number };
  
  // Trend data
  durationTrend?: TrendData[];
}

export interface WeeklyData {
  totalActivities: number;
  totalDuration: number;
  totalCalories?: number;
  period: string;
}

export interface MonthlyData {
  totalActivities: number;
  totalDuration: number;
  totalCalories?: number;
  period: string;
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

// Chart data types for Chart.js
export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor?: string[] | string;
    borderColor?: string[] | string;
    borderWidth?: number;
    label?: string;
    fill?: boolean;
    tension?: number;
  }[];
}

export interface StatisticsFilterOptions {
  period?: 'week' | 'month' | '3months' | 'year';
  activityType?: string;
}
