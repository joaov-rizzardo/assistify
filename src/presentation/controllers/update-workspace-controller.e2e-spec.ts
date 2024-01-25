import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory } from 'src/test/factories/make-token';
import { UserFactory } from 'src/test/factories/make-user';
import {
  WorkspaceFactory,
  makeWorkspace,
} from 'src/test/factories/make-workspace';
import * as request from 'supertest';

describe('Update workspace (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let workspaceFactory: WorkspaceFactory;
  let user: User;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        UserFactory,
        TokenFactory,
        WorkspaceFactory,
        JwtTokenGenerator,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    user = await userFactory.makePrismaUser();
    accessToken = await tokenFactory.makeAccessToken(user);
    await app.init();
  });

  test('[PATCH] /workspaces it should update workspace', async () => {
    const createdWorkspace = await workspaceFactory.makePrismaWorkspace(
      user.getId(),
    );
    const { name: newName } = makeWorkspace();
    const response = await request(app.getHttpServer())
      .patch('/workspaces')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', createdWorkspace.getId())
      .send({ name: newName });
    expect(response.statusCode).toBe(200);
    const updatedWorkspace = response.body;
    expect(updatedWorkspace.id).toBe(createdWorkspace.getId());
    expect(updatedWorkspace.name).toBe(newName);
    expect(updatedWorkspace.ownerId).toBe(createdWorkspace.getOwnerId());
    expect(new Date(updatedWorkspace.createdAt)).toEqual(
      new Date(createdWorkspace.getCreatedAt()),
    );
    expect(new Date(updatedWorkspace.updatedAt)).not.toEqual(
      new Date(createdWorkspace.getUpdatedAt()),
    );
  });
});
