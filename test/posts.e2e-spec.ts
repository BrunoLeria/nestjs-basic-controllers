import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PostsRepository } from '../src/posts/posts.repository';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { userStub } from '../src/users/test/stubs/user.stub';
import { CreatePostRequest } from '../src/posts/dto/create-posts.request';
import { UpdatePostRequest } from '../src/posts/dto/update-posts.request';
import { PostType } from '../src/posts/schemas/post.schema';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let postsRepository: PostsRepository;
  let createPostRequest: CreatePostRequest;
  let updatePostRequest: UpdatePostRequest;
  let post: PostType;
  let loginCookie: string[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PostsRepository)
      .useClass(PostsRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    postsRepository = moduleFixture.get<PostsRepository>(PostsRepository);
    createPostRequest = {
      title: 'Test Post',
      content: 'Test Content',
    };
    updatePostRequest = {
      title: 'Test Post Updated',
      content: 'Test Content Updated',
    };

    await app.init();
  });

  describe('it should get all posts', () => {
    it('/posts (GET)', async () => {
      const posts = await postsRepository.find({});

      return request(app.getHttpServer())
        .get('/posts')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(posts);
        });
    });
  });

  describe('it should login a user', () => {
    it('/login (POST)', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ email: userStub().email, password: userStub().password })
        .expect(200)
        .expect((res) => {
          loginCookie = res.header['set-cookie'][0].split(';')[0];
        });
    });
  });

  describe('it should create a post', () => {
    it('/posts (POST)', async () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Cookie', loginCookie)
        .send(createPostRequest)
        .expect(201)
        .expect((res) => {
          post = res.body;
          expect(post.title).toEqual(createPostRequest.title);
          expect(post.content).toEqual(createPostRequest.content);
        });
    });
  });

  describe('it should get a post', () => {
    it('/posts/:id (GET)', async () => {
      return request(app.getHttpServer())
        .get(`/posts/${post.postId}`)
        .set('Cookie', loginCookie)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(post);
        });
    });
  });

  describe('it should update a post', () => {
    it('/posts/:id (PATCH)', async () => {
      return request(app.getHttpServer())
        .patch(`/posts/${post.postId}`)
        .set('Cookie', loginCookie)
        .send(updatePostRequest)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toEqual(updatePostRequest.title);
          expect(res.body.content).toEqual(updatePostRequest.content);
        });
    });
  });

  describe('it should delete a post', () => {
    it('/posts/:id (DELETE)', async () => {
      return request(app.getHttpServer())
        .delete(`/posts/${post.postId}`)
        .set('Cookie', loginCookie)
        .expect(200);
    });
  });
});
