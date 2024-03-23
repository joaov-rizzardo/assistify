import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import {
  FileStorage,
  FileStorageResult,
} from 'src/application/core/interfaces/storage/file-storage';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

describe('Serve storaged file (E2E)', () => {
  let app: INestApplication;
  let fileStorage: FileStorage;
  let file: FileStorageResult;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    fileStorage = moduleRef.get(FileStorage);
    file = await fileStorage.store(Buffer.from(faker.lorem.paragraph(10)), {
      mimetype: 'text/plain',
      originalName: 'test.txt',
    });
    await app.init();
  });

  test('[GET] /storage/:key it should return requested file', async () => {
    const response = await request(app.getHttpServer()).get(
      `/storage/${file.key}`,
    );
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-disposition']).toEqual(
      `inline; filename="${file.originalName}"`,
    );
    expect(response.headers['content-type']).toEqual(file.mimetype);
    expect(response.text).toEqual(file.content.toString());
  });

  test('[GET] /storage/:key it should return 404 if file not found', async () => {
    const response = await request(app.getHttpServer()).get(
      `/storage/${uuid()}`,
    );
    expect(response.statusCode).toBe(404);
    expect(response.body.code).toBe('FILE_NOT_FOUND');
  });
});
