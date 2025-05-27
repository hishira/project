import { 
  IsEmail, 
  IsOptional, 
  IsString, 
  MinLength, 
  MaxLength,
  Matches 
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MinLength(1, { message: 'First name cannot be empty' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, { 
    message: 'First name can only contain letters, spaces, hyphens, and apostrophes' 
  })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(1, { message: 'Last name cannot be empty' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, { 
    message: 'Last name can only contain letters, spaces, hyphens, and apostrophes' 
  })
  lastName?: string;
}
