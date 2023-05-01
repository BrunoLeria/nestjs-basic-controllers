import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRequest } from './create-users.request';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRequest extends PartialType(CreateUserRequest) {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
