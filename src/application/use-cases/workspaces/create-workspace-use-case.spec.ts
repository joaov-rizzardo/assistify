import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { CreateWorkspaceUseCase } from './create-workspace-use-case';
import { InMemoryWorkspaceRepository } from 'src/test/repositories/in-memory-workspace-repository';
import { makeWorkspace } from 'src/test/factories/make-workspace';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { User } from 'src/application/core/entities/user';
import { InMemoryWorkspaceMembersRepository } from 'src/test/repositories/in-memory-workspace-members-repository';
import { InMemoryUserRepository } from 'src/test/repositories/in-memory-user-repository';
import { makeUser } from 'src/test/factories/make-user';
import { v4 as uuid } from 'uuid';
import { UserNotExistsError } from './errors/user-not-exists-error';

describe('Create workspace use-case', () => {
  let workspaceRepository: WorkspaceRepository;
  let workspaceMembersRepository: WorkspaceMembersRepository;
  let userRepository: UserRepository;
  let sut: CreateWorkspaceUseCase;
  let user: User;

  beforeEach(async () => {
    workspaceRepository = new InMemoryWorkspaceRepository();
    workspaceMembersRepository = new InMemoryWorkspaceMembersRepository();
    userRepository = new InMemoryUserRepository();
    user = await userRepository.create(makeUser());
    sut = new CreateWorkspaceUseCase(
      workspaceRepository,
      workspaceMembersRepository,
      userRepository,
    );
  });

  it('should create new workspace', async () => {
    const { name } = makeWorkspace();
    const result = await sut.execute({ name, userId: user.getId() });
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      const workspace = result.value;
      expect(workspace.getOwnerId()).toBe(user.getId());
      expect(workspace.getName()).toBe(name);
    }
  });

  it('should add owner member', async () => {
    const { name } = makeWorkspace();
    const result = await sut.execute({ name, userId: user.getId() });
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      const workspace = result.value;
      const member = await workspaceMembersRepository.findWorkspaceMember(
        workspace.getId(),
        user.getId(),
      );
      expect(member).not.toBe(null);
      if (member !== null) {
        expect(member.getUserId()).toBe(user.getId());
        expect(member.getRole()).toBe('owner');
      }
    }
  });

  it('should verify if user exists', async () => {
    const { name } = makeWorkspace();
    const result = await sut.execute({ name, userId: uuid() });
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(UserNotExistsError);
    }
  });
});
