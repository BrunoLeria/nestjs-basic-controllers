import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-users.request';
import { UpdateUserRequest } from './dto/update-users.request';
import { UsersRepository } from './users.repository';
import { UserType } from './schemas/user.schema';
import { uuid } from 'uuidv4';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(): Promise<UserType[]> {
    return this.usersRepository.find({});
  }

  async getUser(getUserArgs: Partial<UserType>) {
    return this.usersRepository.findOne(getUserArgs);
  }

  async createUser(createUserRequest: CreateUserRequest): Promise<UserType> {
    const session = await this.usersRepository.startTransaction();
    try {
      const newUser = { userId: uuid(), ...createUserRequest };
      newUser.password = await bcrypt.hash(newUser.password, 10);
      const result = await this.usersRepository.create(
        newUser,
        {},
        { email: newUser.email },
      );
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async updateUser(
    id: string,
    updateUserRequest: UpdateUserRequest,
  ): Promise<UserType> {
    const session = await this.usersRepository.startTransaction();
    try {
      if (updateUserRequest.password) {
        updateUserRequest.password = await bcrypt.hash(
          updateUserRequest.password,
          10,
        );
      }
      const result = await this.usersRepository.findOneAndUpdate(
        { userId: id },
        updateUserRequest,
      );
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async deleteUser(id: string): Promise<UserType> {
    const session = await this.usersRepository.startTransaction();
    try {
      const result = await this.usersRepository.findOneAndDelete({
        userId: id,
      });
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }
}
