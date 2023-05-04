import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersRepository } from '../src/users/users.repository';
import { AppModule } from '../src/app.module';
import { UserType } from '../src/users/schemas/user.schema';
import { CreateUserRequest } from '../src/users/dto/create-users.request';
import { UpdateUserRequest } from '../src/users/dto/update-users.request';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let createUserRequest: CreateUserRequest;
  let updateUserRequest: UpdateUserRequest;
  let user: UserType;
  let loginCookie: string[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersRepository)
      .useClass(UsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    createUserRequest = {
      email: 'lindsay.ferguson@reqres.in',
      name: 'Lindsay Ferguson',
      password: 'password',
    };
    updateUserRequest = {
      email: 'lindsay.silva@reqres.in',
      name: 'Lindsay silva',
      password: '123456',
    };
    await app.init();
  });

  describe('it should create a user', () => {
    it('/users (POST)', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(createUserRequest)
        .expect(201)
        .expect((res) => {
          user = res.body;
          expect(user).toHaveProperty('userId');
          expect(user).toHaveProperty('email', createUserRequest.email);
          expect(user).toHaveProperty('name', createUserRequest.name);
          expect(user).toHaveProperty('password');
        });
    });
  });

  describe('it should not create a user', () => {
    it('/users (POST)', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(createUserRequest)
        .expect(422)
        .expect((res) => {
          expect(res.body.message).toEqual('This document already exists');
        });
    });
  });

  describe('it should get an array with all the users', () => {
    it('/users (GET)', async () => {
      const users = await usersRepository.find({});

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect(users);
    });
  });

  describe('it should login the new user', () => {
    it('/login (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/login')
        .send({ email: user.email, password: createUserRequest.password })
        .expect(200)
        .expect((res) => {
          loginCookie = res.header['set-cookie'];
          expect(loginCookie).toBeDefined();
          expect(res.body).toEqual(user);
        });
    });
  });

  describe('it should get a user by id', () => {
    it('/users/:id (GET)', async () => {
      return request(app.getHttpServer())
        .get(`/users/${user.userId}`)
        .set('Cookie', loginCookie)
        .expect(200)
        .expect(user);
    });
  });

  describe('it should update a user', () => {
    it('/users/:id (PATCH)', async () => {
      return request(app.getHttpServer())
        .patch(`/users/${user.userId}`)
        .set('Cookie', loginCookie)
        .send(updateUserRequest)
        .expect(200)
        .expect((res) => {
          user = res.body;
          expect(res.body).toHaveProperty('email', updateUserRequest.email);
          expect(res.body).toHaveProperty('name', updateUserRequest.name);
          expect(res.body).toHaveProperty('password');
        });
    });
  });

  describe('it should delete a user', () => {
    it('/users/:id (DELETE)', async () => {
      return request(app.getHttpServer())
        .delete(`/users/${user.userId}`)
        .set('Cookie', loginCookie)
        .expect(200)
        .expect(user);
    });
  });
});
