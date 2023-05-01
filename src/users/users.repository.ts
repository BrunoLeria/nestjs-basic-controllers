import { AbstractRepository } from '../database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { UserType } from './schemas/user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractRepository<UserType> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(UserType.name) UserModel: Model<UserType>,
    @InjectConnection() connection: Connection,
  ) {
    super(UserModel, connection);
  }
}
