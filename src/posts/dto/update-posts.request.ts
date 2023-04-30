import { PartialType } from '@nestjs/mapped-types';
import { CreatePostRequest } from './create-posts.request';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostRequest extends PartialType(CreatePostRequest) {
  @IsString()
  @IsNotEmpty()
  postId: string;
}
