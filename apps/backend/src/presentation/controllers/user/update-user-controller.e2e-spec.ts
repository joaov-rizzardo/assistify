import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { FileStorage, FileStorageResult } from 'src/application/core/interfaces/storage/file-storage';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory } from 'src/test/factories/make-token';
import { UserFactory, makeUser } from 'src/test/factories/make-user';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

describe('Update user (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let fileStorage: FileStorage;
  let file: FileStorageResult;
  let user: User;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, TokenFactory, JwtTokenGenerator]
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    user = await userFactory.makePrismaUser();
    accessToken = await tokenFactory.makeAccessToken(user);
    fileStorage = moduleRef.get(FileStorage);
    file = await fileStorage.store(Buffer.from(faker.lorem.paragraph(10)), {
      mimetype: 'image/jpeg',
      originalName: 'test.jpg'
    });
    await app.init();
  });

  test('[PATCH] /users it should update user info', async () => {
    const { name, lastName } = makeUser();
    const response = await request(app.getHttpServer()).patch(`/users`).set('Authorization', `Bearer ${accessToken}`).send({
      name,
      lastName,
      profilePicture: file.key
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(name);
    expect(response.body.lastName).toBe(lastName);
    expect(response.body.profilePicture).toBe(file.key);
    expect(response.body.id).toBe(user.getId());
  });

  test('[PATCH] /users it should check if file exists', async () => {
    const response = await request(app.getHttpServer()).patch(`/users`).set('Authorization', `Bearer ${accessToken}`).send({
      profilePicture: uuid()
    });
    expect(response.statusCode).toBe(404);
    expect(response.body.code).toBe('FILE_NOT_FOUND');
  });

  test('[PATCH] /users it should check if file is a image', async () => {
    const file = await fileStorage.store(Buffer.from(faker.lorem.paragraph(10)), {
      mimetype: 'text/plain',
      originalName: 'test.txt'
    });
    const response = await request(app.getHttpServer()).patch(`/users`).set('Authorization', `Bearer ${accessToken}`).send({
      profilePicture: file.key
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('INVALID_FILE_TYPE');
  });
});
