import { PartialType } from '@nestjs/mapped-types';
import { CreatePostRequest } from './create-posts.request';

export class UpdatePostRequest extends PartialType(CreatePostRequest) {}
