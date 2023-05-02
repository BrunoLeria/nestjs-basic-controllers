import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-users.request';
import { UpdateUserRequest } from './dto/update-users.request';
import { UsersRepository } from './users.repository';
import { UserType } from './schemas/user.schema';
import { uuid } from 'uuidv4';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async getUsers(): Promise<UserType[]> {
    return this.usersRepository.find({});
  }

  async getUser(getUserArgs: Partial<UserType>) {
    return this.usersRepository.findOne(getUserArgs);
  }

  async createUser(createUserRequest: CreateUserRequest): Promise<UserType> {
    if (await this.getUser({ email: createUserRequest.email })) {
      throw new UnprocessableEntityException('Email already exists');
    }
    const session = await this.usersRepository.startTransaction();
    try {
      const newUser = { userId: uuid(), ...createUserRequest };
      newUser.password = await this.authService.hashedPassword(
        newUser.password,
      );
      const result = await this.usersRepository.create(newUser);
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
