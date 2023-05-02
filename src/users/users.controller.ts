import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/create-users.request';
import { UserType } from './schemas/user.schema';
import { UpdateUserRequest } from './dto/update-users.request';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string): Promise<UserType> {
    return await this.usersService.getUser({ userId: id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserRequest: UpdateUserRequest,
  ): Promise<UserType> {
    return await this.usersService.updateUser(id, updateUserRequest);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string): Promise<UserType> {
    return await this.usersService.deleteUser(id);
  }
}
