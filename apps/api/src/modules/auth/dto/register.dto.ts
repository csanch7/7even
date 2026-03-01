import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength
} from 'class-validator';

const ORIENTATIONS = ['straight', 'gay', 'lesbian', 'bisexual', 'pansexual', 'queer', 'asexual', 'other'] as const;
const GENDERS = ['man', 'woman', 'non_binary', 'other'] as const;

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  fullName!: string;

  @IsInt()
  @Min(18)
  @Max(99)
  age!: number;

  @IsDateString()
  dateOfBirth!: string;

  @IsString()
  school!: string;

  @IsString()
  @IsIn(GENDERS)
  gender!: (typeof GENDERS)[number];

  @IsString()
  @IsIn(ORIENTATIONS)
  orientation!: (typeof ORIENTATIONS)[number];

  @IsString()
  profilePhotoUrl!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(GENDERS, { each: true })
  preferredGenders!: Array<(typeof GENDERS)[number]>;

  @IsInt()
  @Min(18)
  preferredAgeMin!: number;

  @IsInt()
  @Max(99)
  preferredAgeMax!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];
}
