import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;
}
