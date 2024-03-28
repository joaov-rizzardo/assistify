import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { RemoveWorkspaceMemberUseCase } from './remove-workspace-member-use-case';
import { InMemoryWorkspaceMembersRepository } from 'src/test/repositories/in-memory-workspace-members-repository';
import { v4 as uuid } from 'uuid';
import { UserIsNotMemberFromWorkspaceError } from './errors/user-is-not-member-from-workspace-error';
import { CannotRemoveOwnerFromWorkspaceError } from './errors/cannot-remove-owner-from-workspace-error';

describe('Remove workspace member use case', () => {
  let workspaceMembersRepository: WorkspaceMembersRepository;
  let sut: RemoveWorkspaceMemberUseCase;

  beforeEach(async () => {
    workspaceMembersRepository = new InMemoryWorkspaceMembersRepository();
    sut = new RemoveWorkspaceMemberUseCase(workspaceMembersRepository);
  });

  it('should remove workspace member', async () => {
    const workspaceId = uuid();
    const member = await workspaceMembersRepository.add({
      workspaceId: workspaceId,
      role: 'member',
      userId: uuid(),
      status: 'accepted'
    });
    const result = await sut.execute(workspaceId, member.getUserId());
    expect(result.isRight()).toBe(true);
  });

  it("shouldn't remove nonexistent workspace member", async () => {
    const result = await sut.execute(uuid(), uuid());
    expect(result.isRight()).toBe(false);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserIsNotMemberFromWorkspaceError);
    }
  });

  it("shouldn't remove user with owner role", async () => {
    const workspaceId = uuid();
    const member = await workspaceMembersRepository.add({
      workspaceId: workspaceId,
      role: 'owner',
      userId: uuid(),
      status: 'accepted'
    });
    const result = await sut.execute(workspaceId, member.getUserId());
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(CannotRemoveOwnerFromWorkspaceError);
    }
  });
});
