import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRequest } from './create-users.request';

export class UpdateUserRequest extends PartialType(CreateUserRequest) {}
