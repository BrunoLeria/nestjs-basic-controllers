import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { PostType } from '../schemas/post.schema';
import { CreatePostRequest } from '../dto/create-posts.request';
import { postStub } from './stubs/post.stub';
import { UpdatePostRequest } from '../dto/update-posts.request';
import { lorem } from './constants/lorem';

jest.mock('../posts.service');

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [PostsController],
      providers: [PostsService],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPosts', () => {
    describe('when getPosts is called', () => {
      let posts: PostType[];

      beforeEach(async () => {
        posts = await controller.getPosts();
      });

      test('then it should call postsService', () => {
        expect(service.getPosts).toBeCalled();
      });

      test('then it should return a list of posts', () => {
        expect(posts).toEqual([postStub()]);
      });
    });
  });

  describe('getPostById', () => {
    describe('when getPostById is called', () => {
      let post: PostType;

      beforeEach(async () => {
        post = await controller.getPostById(postStub().postId);
      });

      test('then it should call postsService', () => {
        expect(service.getPostById).toBeCalledWith(postStub().postId);
      });

      test('then it should return a post', () => {
        expect(post).toEqual(postStub());
      });
    });
  });

  describe('createPost', () => {
    describe('when createPost is called', () => {
      let post: PostType;
      let createPostRequest: CreatePostRequest;

      beforeEach(async () => {
        createPostRequest = {
          content: postStub().content,
          title: postStub().title,
        };
        post = await controller.createPost(createPostRequest);
      });

      test('then it should call postsService', () => {
        expect(service.createPost).toBeCalledWith({
          content: createPostRequest.content,
          title: createPostRequest.title,
        });
      });

      test('then it should return a post', () => {
        expect(post).toEqual(postStub());
      });
    });
  });

  describe('updatePost', () => {
    describe('when updatePost is called', () => {
      let post: PostType;
      let updatePostRequest: UpdatePostRequest;

      beforeEach(async () => {
        updatePostRequest = {
          content: lorem.generateParagraphs(1),
          title: lorem.generateSentences(1),
        };
        post = await controller.updatePost(
          postStub().postId,
          updatePostRequest,
        );
      });

      test('then it should call postsService', () => {
        expect(service.updatePost).toBeCalledWith(
          postStub().postId,
          updatePostRequest,
        );
      });

      test('then it should return a post', () => {
        expect(post).toEqual(postStub());
      });
    });
  });

  describe('deletePost', () => {
    describe('when deletePost is called', () => {
      let result: PostType;

      beforeEach(async () => {
        result = await controller.deletePost(postStub().postId);
      });

      test('then it should call postsService', () => {
        expect(service.deletePost).toBeCalledWith(postStub().postId);
      });

      test('then it should return a result', () => {
        expect(result).toEqual({ deletedCount: 1 });
      });
    });
  });
});
