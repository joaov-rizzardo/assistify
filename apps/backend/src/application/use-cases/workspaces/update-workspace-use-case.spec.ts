import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { UpdateWorkspaceUseCase } from './update-workspace-use-case';
import { InMemoryWorkspaceRepository } from 'src/test/repositories/in-memory-workspace-repository';
import { makeWorkspace } from 'src/test/factories/make-workspace';
import { v4 as uuid } from 'uuid';
import { Workspace } from 'src/application/core/entities/workspace';

describe('Update workspace use case', () => {
  let sut: UpdateWorkspaceUseCase;
  let workspaceRepository: WorkspaceRepository;
  let workspace: Workspace;

  beforeEach(async () => {
    workspaceRepository = new InMemoryWorkspaceRepository();
    sut = new UpdateWorkspaceUseCase(workspaceRepository);
    const { name } = makeWorkspace();
    workspace = await workspaceRepository.create({
      name,
      ownerId: uuid()
    });
  });

  it('should update workspace', async () => {
    const { name: newName } = makeWorkspace();
    const result = await sut.execute(workspace.getId(), {
      name: newName
    });
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      const updatedWorkspace = result.value;
      expect(updatedWorkspace.getName()).toBe(newName);
      expect(updatedWorkspace.getId()).toBe(workspace.getId());
      expect(updatedWorkspace.getOwnerId()).toBe(workspace.getOwnerId());
      expect(updatedWorkspace.getCreatedAt()).toBe(workspace.getCreatedAt());
      expect(updatedWorkspace.getUpdatedAt()).not.toBe(workspace.getUpdatedAt());
    }
  });
});
