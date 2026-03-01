import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class QuizAnswerDto {
  @IsString()
  questionId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  value!: number;
}

export class SubmitQuizDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers!: QuizAnswerDto[];

  @IsArray()
  @IsString({ each: true })
  interests!: string[];
}
