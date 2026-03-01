import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredGenders?: string[];

  @IsOptional()
  @IsInt()
  @Min(18)
  preferredAgeMin?: number;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(99)
  preferredAgeMax?: number;
}
