import { IsString } from 'class-validator';

export class ReadMessageDto {
  @IsString()
  messageId!: string;
}
