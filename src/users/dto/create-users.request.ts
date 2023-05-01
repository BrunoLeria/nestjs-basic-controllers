import { IsString, IsNotEmpty, MaxLength, IsEmail } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}
