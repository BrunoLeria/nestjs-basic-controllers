import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { PostsRepository } from '../posts.repository';
import { postStub } from './stubs/post.stub';
import { PostType } from '../schemas/post.schema';
import { UpdatePostRequest } from '../dto/update-posts.request';
import { lorem } from './constants/lorem';
import { CreatePostRequest } from '../dto/create-posts.request';

jest.mock('../posts.repository');

describe('PostsService', () => {
  let service: PostsService;
  let repository: PostsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [PostsService, PostsRepository],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get<PostsRepository>(PostsRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPosts', () => {
    describe('when getPosts is called', () => {
      let posts: PostType[];

      beforeEach(async () => {
        posts = await service.getPosts();
      });

      test('then it should call postsRepository', () => {
        expect(repository.find).toBeCalled();
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
        post = await service.getPost({ postId: postStub().postId });
      });

      test('then it should call postsRepository', () => {
        expect(repository.findOne).toBeCalled();
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

        post = await service.updatePost(postStub().postId, updatePostRequest);
      });

      test('then it should call postsRepository', () => {
        expect(repository.findOneAndUpdate).toBeCalled();
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
        post = await service.createPost(createPostRequest);
      });

      test('then it should call postsRepository', () => {
        expect(repository.create).toBeCalledWith({
          postId: expect.any(String),
          content: createPostRequest.content,
          title: createPostRequest.title,
        });
      });

      test('then it should return a post', () => {
        expect(post).toEqual(postStub());
      });
    });
  });
});
