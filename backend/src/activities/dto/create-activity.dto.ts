import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import {
  ActivityMetadata,
  ActivityType,
  DifficultyLevel,
} from '../../entities/activity.entity';

export class CreateActivityDto {
  @IsEnum(ActivityType)
  type: ActivityType;

  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  duration: number; // in minutes

  @IsEnum(DifficultyLevel)
  @Min(1)
  @Max(5)
  difficulty: DifficultyLevel;

  @IsDateString()
  activityDate: string;

  @IsOptional()
  @IsObject()
  metadata?: ActivityMetadata;

  @IsOptional()
  @IsNumber()
  @Min(0)
  caloriesBurned?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
