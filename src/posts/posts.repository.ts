import { AbstractRepository } from '../database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { PostType } from './schemas/post.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class PostsRepository extends AbstractRepository<PostType> {
  protected readonly logger = new Logger(PostsRepository.name);

  constructor(
    @InjectModel(PostType.name) PostModel: Model<PostType>,
    @InjectConnection() connection: Connection,
  ) {
    super(PostModel, connection);
  }
}
