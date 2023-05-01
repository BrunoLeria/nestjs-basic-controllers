import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-users.request';
import { UpdateUserRequest } from './dto/update-users.request';
import { UsersRepository } from './users.repository';
import { UserType } from './schemas/user.schema';
import { uuid } from 'uuidv4';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async getUsers(): Promise<UserType[]> {
    return await this.usersRepository.find({});
  }
  async getUserById(id: string): Promise<UserType> {
    return await this.usersRepository.findOne({ userId: id });
  }
  async updateUser(
    id: string,
    updateUserRequest: UpdateUserRequest,
  ): Promise<UserType> {
    const session = await this.usersRepository.startTransaction();
    try {
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
  async createUser(createUserRequest: CreateUserRequest): Promise<UserType> {
    const session = await this.usersRepository.startTransaction();
    try {
      const newUser = { userId: uuid(), ...createUserRequest };
      const result = await this.usersRepository.create(newUser);
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }
  async deleteUser(id: string): Promise<any> {
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
