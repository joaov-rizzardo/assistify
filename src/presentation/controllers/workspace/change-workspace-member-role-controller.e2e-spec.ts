import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { Workspace } from 'src/application/core/entities/workspace';
import { WorkspaceMember } from 'src/application/core/entities/workspace-member';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory } from 'src/test/factories/make-token';
import { UserFactory } from 'src/test/factories/make-user';
import { WorkspaceFactory } from 'src/test/factories/make-workspace';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

describe('Change workspace member role (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let workspaceFactory: WorkspaceFactory;
  let workspaceMembersRepository: WorkspaceMembersRepository;
  let user: User;
  let member: WorkspaceMember;
  let workspace: Workspace;
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
    app.useGlobalPipes(new ValidationPipe());
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    workspaceMembersRepository = moduleRef.get(WorkspaceMembersRepository);

    user = await userFactory.makePrismaUser();
    accessToken = await tokenFactory.makeAccessToken(user);
    workspace = await workspaceFactory.makePrismaWorkspace(user.getId());
    const userMember = await userFactory.makePrismaUser();
    member = await workspaceMembersRepository.add({
      userId: userMember.getId(),
      workspaceId: workspace.getId(),
      role: 'editor',
      status: 'accepted',
    });
    await app.init();
  });

  test('[Patch] /workspaces/member/change-role/:userId it should change workspace member role', async () => {
    const response = await request(app.getHttpServer())
      .patch('/workspaces/member/change-role/' + member.getUserId())
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', workspace.getId())
      .send({
        role: 'member',
      });
    expect(response.statusCode).toBe(200);
    const updatedMember = await workspaceMembersRepository.findWorkspaceMember(
      workspace.getId(),
      member.getUserId(),
    );
    expect(updatedMember.getRole()).toBe('member');
  });

  test('[Patch] /workspaces/member/change-role/:userId it should return updated member', async () => {
    const response = await request(app.getHttpServer())
      .patch('/workspaces/member/change-role/' + member.getUserId())
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', workspace.getId())
      .send({
        role: 'member',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(member.getUserId());
    expect(response.body.workspaceId).toBe(member.getWorkspaceId());
    expect(response.body.role).toBe('member');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  test("[Patch] /workspaces/member/change-role/:userId it shouldn't change role to owner", async () => {
    const response = await request(app.getHttpServer())
      .patch('/workspaces/member/change-role/' + member.getUserId())
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', workspace.getId())
      .send({
        role: 'owner',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('CANNOT_CHANGE_MEMBER_ROLE_TO_OWNER');
  });

  test('[Patch] /workspaces/member/change-role/:userId it should check if workspace has the member', async () => {
    const response = await request(app.getHttpServer())
      .patch('/workspaces/member/change-role/' + uuid())
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', workspace.getId())
      .send({
        role: 'editor',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('USER_IS_NOT_WORKSPACE_MEMBER');
  });
});
