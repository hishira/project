import {
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

export class SwimmingMetadataDto {
  @IsNumber()
  @Min(10)
  @Max(100)
  poolSize: number; // pool size in meters

  @IsNumber()
  @Min(1)
  laps: number;

  @IsOptional()
  @IsString()
  strokeType?: string;
}

export class RunningMetadataDto {
  @IsEnum(['treadmill', 'outdoor', 'track'])
  location: 'treadmill' | 'outdoor' | 'track';

  @IsOptional()
  @IsNumber()
  @Min(0)
  distance?: number; // in kilometers

  @IsOptional()
  @IsNumber()
  @Min(0)
  pace?: number; // minutes per kilometer

  @IsOptional()
  @IsNumber()
  @Min(0)
  elevation?: number; // elevation gain in meters
}

export class CyclingMetadataDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  distance?: number; // in kilometers

  @IsEnum(['indoor', 'outdoor', 'mountain', 'road'])
  location: 'indoor' | 'outdoor' | 'mountain' | 'road';

  @IsOptional()
  @IsNumber()
  @Min(0)
  avgSpeed?: number; // km/h

  @IsOptional()
  @IsNumber()
  @Min(0)
  elevation?: number; // elevation gain in meters
}

export class SkatingMetadataDto {
  @IsEnum(['ice', 'roller', 'inline'])
  type: 'ice' | 'roller' | 'inline';

  @IsOptional()
  @IsNumber()
  @Min(0)
  distance?: number; // in kilometers

  @IsEnum(['indoor', 'outdoor'])
  location: 'indoor' | 'outdoor';
}

export class HorseRidingMetadataDto {
  @IsEnum(['dressage', 'jumping', 'trail', 'racing', 'western', 'other'])
  discipline: 'dressage' | 'jumping' | 'trail' | 'racing' | 'western' | 'other';

  @IsEnum(['indoor', 'outdoor'])
  location: 'indoor' | 'outdoor';

  @IsOptional()
  @IsString()
  horseName?: string;
}

export class GymWorkoutMetadataDto {
  @IsEnum(['strength', 'cardio', 'mixed'])
  workoutType: 'strength' | 'cardio' | 'mixed';

  @IsOptional()
  @IsString({ each: true })
  exercises?: string[];

  @IsOptional()
  @IsString({ each: true })
  equipment?: string[];
}
