import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  message: string;
}
