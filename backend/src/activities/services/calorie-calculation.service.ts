import { Injectable } from '@nestjs/common';
import {
  ActivityType,
  DifficultyLevel,
  ActivityMetadata,
  SwimmingMetadata,
  RunningMetadata,
  CyclingMetadata,
  SkatingMetadata,
  GymWorkoutMetadata,
} from '../../entities/activity.entity';

@Injectable()
export class CalorieCalculationService {
  /**
   * Calculate calories burned based on metadata and activity details
   */
  calculateCalories(
    type: ActivityType,
    duration: number, // in minutes
    difficulty: DifficultyLevel,
    metadata?: ActivityMetadata,
  ): number {
    // Try to calculate from metadata first
    const metadataCalories = this.calculateFromMetadata(
      type,
      duration,
      metadata,
    );
    if (metadataCalories > 0) {
      return Math.round(
        metadataCalories * this.getDifficultyMultiplier(difficulty),
      );
    }

    // Fallback to general estimates based on activity type and difficulty
    return this.calculateFromGeneral(type, duration, difficulty);
  }

  /**
   * Calculate calories from specific metadata
   */
  private calculateFromMetadata(
    type: ActivityType,
    duration: number,
    metadata?: ActivityMetadata,
  ): number {
    if (!metadata) return 0;

    switch (type) {
      case ActivityType.RUNNING: {
        return this.calculateRunningCalories(metadata as RunningMetadata);
      }

      case ActivityType.SWIMMING: {
        return this.calculateSwimmingCalories(metadata as SwimmingMetadata);
      }

      case ActivityType.CYCLING: {
        return this.calculateCyclingCalories(metadata as CyclingMetadata);
      }

      case ActivityType.SKATING: {
        return this.calculateSkatingCalories(metadata as SkatingMetadata);
      }

      case ActivityType.GYM_WORKOUT: {
        return this.calculateGymCalories(
          metadata as GymWorkoutMetadata,
          duration,
        );
      }
    }

    return 0;
  }

  /**
   * Calculate running calories from metadata
   */
  private calculateRunningCalories(metadata: RunningMetadata): number {
    if (metadata.distance && metadata.pace) {
      // More accurate calculation based on distance and pace
      // Average: 100 calories per mile (1.6 km), adjusted for pace
      const baseCaloriesPerKm = 62.5;
      const paceMultiplier = Math.max(0.7, Math.min(1.5, 8 / metadata.pace));
      return metadata.distance * baseCaloriesPerKm * paceMultiplier;
    }
    return 0;
  }

  /**
   * Calculate swimming calories from metadata
   */
  private calculateSwimmingCalories(metadata: SwimmingMetadata): number {
    if (metadata.poolSize && metadata.laps) {
      // Calculate distance and estimate calories
      const distanceKm = (metadata.poolSize * metadata.laps) / 1000;
      // Swimming burns more calories per km than running
      const caloriesPerKm = 400;
      return distanceKm * caloriesPerKm;
    }
    return 0;
  }

  /**
   * Calculate cycling calories from metadata
   */
  private calculateCyclingCalories(metadata: CyclingMetadata): number {
    if (metadata.distance && metadata.avgSpeed) {
      // Calories based on distance and speed
      const baseCaloriesPerKm = 25;
      const speedMultiplier = Math.max(
        0.8,
        Math.min(1.8, metadata.avgSpeed / 20),
      );
      return metadata.distance * baseCaloriesPerKm * speedMultiplier;
    }
    return 0;
  }

  /**
   * Calculate skating calories from metadata
   */
  private calculateSkatingCalories(metadata: SkatingMetadata): number {
    if (metadata.distance) {
      // Skating calories similar to cycling but slightly higher
      const caloriesPerKm = 35;
      return metadata.distance * caloriesPerKm;
    }
    return 0;
  }

  /**
   * Calculate gym workout calories from metadata
   */
  private calculateGymCalories(
    metadata: GymWorkoutMetadata,
    duration: number,
  ): number {
    if (metadata.workoutType) {
      // Different rates for different workout types
      const ratesPerMinute = {
        strength: 6,
        cardio: 10,
        mixed: 8,
      };
      return duration * ratesPerMinute[metadata.workoutType];
    }
    return 0;
  }

  /**
   * Calculate calories using general MET estimates
   */
  private calculateFromGeneral(
    type: ActivityType,
    duration: number,
    difficulty: DifficultyLevel,
  ): number {
    // MET (Metabolic Equivalent) values for different activities
    const metValues = this.getMetValues();
    const baseMET = metValues[type];
    const difficultyMultiplier = this.getDifficultyMultiplier(difficulty);
    const adjustedMET = baseMET * difficultyMultiplier;

    // Average person weight: 70kg
    // Calories = MET × weight(kg) × time(hours)
    const averageWeight = 70;
    const timeInHours = duration / 60;

    return Math.round(adjustedMET * averageWeight * timeInHours);
  }

  /**
   * Get MET values for different activity types
   */
  private getMetValues(): Record<ActivityType, number> {
    return {
      [ActivityType.RUNNING]: 8.0,
      [ActivityType.SWIMMING]: 10.0,
      [ActivityType.CYCLING]: 6.0,
      [ActivityType.SKATING]: 5.5,
      [ActivityType.HORSE_RIDING]: 4.0,
      [ActivityType.WALKING]: 3.5,
      [ActivityType.HIKING]: 6.0,
      [ActivityType.GYM_WORKOUT]: 6.5,
      [ActivityType.YOGA]: 2.5,
      [ActivityType.TENNIS]: 7.0,
      [ActivityType.FOOTBALL]: 8.0,
      [ActivityType.BASKETBALL]: 6.5,
      [ActivityType.OTHER]: 4.0,
    };
  }

  /**
   * Get multiplier based on difficulty level
   */
  private getDifficultyMultiplier(difficulty: DifficultyLevel): number {
    const multipliers = {
      [DifficultyLevel.VERY_EASY]: 0.7,
      [DifficultyLevel.EASY]: 0.85,
      [DifficultyLevel.MODERATE]: 1.0,
      [DifficultyLevel.HARD]: 1.2,
      [DifficultyLevel.VERY_HARD]: 1.4,
    };
    return multipliers[difficulty];
  }
}
