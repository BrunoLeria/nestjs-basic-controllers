import { Injectable } from '@nestjs/common';
import { CreatePostRequest } from './dto/create-posts.request';
import { UpdatePostRequest } from './dto/update-posts.request';
import { PostsRepository } from './posts.repository';
import { PostType } from './schemas/post.schema';
import { v4 } from 'uuid';
@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}
  async getPosts(): Promise<PostType[]> {
    return await this.postsRepository.find({});
  }
  async getPost(getPostArgs: Partial<PostType>): Promise<PostType> {
    return this.postsRepository.findOne(getPostArgs);
  }

  async updatePost(
    id: string,
    updatePostRequest: UpdatePostRequest,
  ): Promise<PostType> {
    const session = await this.postsRepository.startTransaction();
    try {
      const result = await this.postsRepository.findOneAndUpdate(
        { postId: id },
        updatePostRequest,
      );
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }
  async createPost(createPostRequest: CreatePostRequest): Promise<PostType> {
    const session = await this.postsRepository.startTransaction();
    try {
      const newPost = { postId: v4(), ...createPostRequest };
      const result = await this.postsRepository.create(newPost);
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }
  async deletePost(id: string): Promise<PostType> {
    const session = await this.postsRepository.startTransaction();
    try {
      const result = await this.postsRepository.findOneAndDelete({
        postId: id,
      });
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }
}
