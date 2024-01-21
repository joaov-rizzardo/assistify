import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { makeUser } from 'src/test/factories/make-user';
import * as request from 'supertest';

describe('Create user (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  test('[POST] /users', async () => {
    const { name, email, lastName, password } = makeUser();
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name, email, lastName, password });
    expect(response.statusCode).toBe(201);
  });
});
