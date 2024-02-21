import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { AddWorkspaceMemberUseCase } from './add-workspace-member-use-case';
import { InMemoryUserRepository } from 'src/test/repositories/in-memory-user-repository';
import { InMemoryWorkspaceMembersRepository } from 'src/test/repositories/in-memory-workspace-members-repository';
import { User } from 'src/application/core/entities/user';
import { Workspace } from 'src/application/core/entities/workspace';
import { makeUser } from 'src/test/factories/make-user';
import { makeWorkspace } from 'src/test/factories/make-workspace';
import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { InMemoryWorkspaceRepository } from 'src/test/repositories/in-memory-workspace-repository';
import { v4 as uuid } from 'uuid';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';
import { CannotAddMemberAsOwnerError } from './errors/cannot-add-member-as-owner-error';

describe('Add workspace member use case', () => {
  let userRepository: UserRepository;
  let workspaceRepository: WorkspaceRepository;
  let workspaceMembersRepository: WorkspaceMembersRepository;
  let sut: AddWorkspaceMemberUseCase;
  let user: User;
  let workspace: Workspace;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    workspaceRepository = new InMemoryWorkspaceRepository();
    workspaceMembersRepository = new InMemoryWorkspaceMembersRepository();
    sut = new AddWorkspaceMemberUseCase(
      userRepository,
      workspaceMembersRepository,
    );
    const userData = makeUser();
    user = await userRepository.create({
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
    });
    const workspaceData = makeWorkspace();
    workspace = await workspaceRepository.create({
      name: workspaceData.name,
      ownerId: user.getId(),
    });
  });

  it('should add workspace member', async () => {
    const userData = makeUser();
    const memberUser = await userRepository.create({
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
    });
    const result = await sut.execute(workspace.getId(), {
      role: 'admin',
      userId: memberUser.getId(),
    });
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const member = result.value;
      expect(member.getUserId()).toBe(memberUser.getId());
      expect(member.getRole()).toBe('admin');
    }
  });

  it('should verify if user exists', async () => {
    const result = await sut.execute(workspace.getId(), {
      role: 'moderator',
      userId: uuid(),
    });
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(UserNotExistsError);
    }
  });

  it("shouldn't add member as a owner", async () => {
    const result = await sut.execute(workspace.getId(), {
      role: 'owner',
      userId: uuid(),
    });
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(CannotAddMemberAsOwnerError);
    }
  });

  it('should add member with status invited', async () => {
    const userData = makeUser();
    const memberUser = await userRepository.create({
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
    });
    const result = await sut.execute(workspace.getId(), {
      role: 'admin',
      userId: memberUser.getId(),
    });
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const member = result.value;
      expect(member.getStatus()).toBe('invited');
    }
  });
});
