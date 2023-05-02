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
import { PostsService } from './posts.service';
import { CreatePostRequest } from './dto/create-posts.request';
import { PostType } from './schemas/post.schema';
import { UpdatePostRequest } from './dto/update-posts.request';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body() createPostRequest: CreatePostRequest,
  ): Promise<PostType> {
    return await this.postsService.createPost(createPostRequest);
  }

  @Get()
  async getPosts(): Promise<PostType[]> {
    return await this.postsService.getPosts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPostById(@Param('id') id: string): Promise<PostType> {
    return await this.postsService.getPostById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostRequest: UpdatePostRequest,
  ): Promise<PostType> {
    return await this.postsService.updatePost(id, updatePostRequest);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('id') id: string): Promise<{ deletedCount: number }> {
    return await this.postsService.deletePost(id);
  }
}
