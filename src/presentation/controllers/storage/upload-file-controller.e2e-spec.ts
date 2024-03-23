import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { existsSync } from 'fs';
import { extname } from 'path';

describe('Serve storaged file (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  test('[POST] /upload/it should upload file', async () => {
    const filepath = `src/test/assets/files/test-image.jpeg`;
    const extension = extname(filepath);
    const response = await request(app.getHttpServer())
      .post(`/storage/upload`)
      .attach('file', filepath);
    expect(response.statusCode).toBe(201);
    expect(response.body.code).toBe('FILE_UPLOADED');
    expect(response.body.key).toBeTruthy();
    const key = response.body.key;
    expect(existsSync(`./storage/${key}${extension}`)).toBe(true);
  });
});
