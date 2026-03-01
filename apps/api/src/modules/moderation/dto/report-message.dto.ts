import { IsArray, IsOptional, IsString } from 'class-validator';

export class ReportMessageDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  messageIds?: string[];
}
