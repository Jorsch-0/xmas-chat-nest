import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

enum Gender {
  male = 'male',
  female = 'female',
}

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  fullName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @IsString()
  @IsEnum(Gender)
  gender: string;
}
