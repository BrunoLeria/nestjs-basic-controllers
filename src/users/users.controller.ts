import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/create-users.request';
import { UserType } from './schemas/user.schema';
import { UpdateUserRequest } from './dto/update-users.request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<UserType> {
    return await this.usersService.createUser(createUserRequest);
  }

  @Get()
  async getUsers(): Promise<UserType[]> {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserType> {
    return await this.usersService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserRequest: UpdateUserRequest,
  ): Promise<UserType> {
    return await this.usersService.updateUser(id, updateUserRequest);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ deletedCount: number }> {
    return await this.usersService.deleteUser(id);
  }
}
