import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { existsSync } from 'fs';
import { extname } from 'path';
import { TokenFactory } from 'src/test/factories/make-token';
import { User } from 'src/application/core/entities/user';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { UserFactory } from 'src/test/factories/make-user';

describe('Serve storaged file (E2E)', () => {
  let app: INestApplication;
  let tokenFactory: TokenFactory;
  let userFactory: UserFactory;
  let user: User;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [TokenFactory, UserFactory, JwtTokenGenerator],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    user = await userFactory.makePrismaUser();
    accessToken = await tokenFactory.makeAccessToken(user);
    await app.init();
  });

  test('[POST] /upload/it should upload file', async () => {
    const filepath = `src/test/assets/files/test-image.jpeg`;
    const extension = extname(filepath);
    const response = await request(app.getHttpServer())
      .post(`/storage/upload`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', filepath);
    expect(response.statusCode).toBe(201);
    expect(response.body.code).toBe('FILE_UPLOADED');
    expect(response.body.key).toBeTruthy();
    const key = response.body.key;
    expect(existsSync(`./storage/${key}${extension}`)).toBe(true);
  });
});
