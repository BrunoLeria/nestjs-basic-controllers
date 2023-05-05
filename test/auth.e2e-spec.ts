import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PostsRepository } from '../src/posts/posts.repository';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { userStub } from '../src/users/test/stubs/user.stub';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let loginCookie: string[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('it should not login a user', () => {
    it('/login (POST)', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ email: 'wrongemail', password: 'wrongpassword' })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toEqual('Credentials are not valid.');
        });
    });
  });

  describe('it should login a user', () => {
    it('/login (POST)', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ email: userStub().email, password: 'password' })
        .expect(200)
        .expect((res) => {
          loginCookie = res.header['set-cookie'][0].split(';')[0];
        });
    });
  });

  describe('it should logout a user', () => {
    it('/login (GET)', async () => {
      return request(app.getHttpServer())
        .get('/login')
        .set('Cookie', loginCookie)
        .expect(200)
        .expect((res) => {
          expect(res.header['set-cookie'][0]).toContain(
            `Authentication=; Path=/; HttpOnly`,
          );
        });
    });
  });
});
