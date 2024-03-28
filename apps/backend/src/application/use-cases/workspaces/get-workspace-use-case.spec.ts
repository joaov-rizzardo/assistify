import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { GetWorkspaceUseCase } from './get-workspace-use-case';
import { InMemoryWorkspaceRepository } from 'src/test/repositories/in-memory-workspace-repository';
import { Workspace } from 'src/application/core/entities/workspace';
import { v4 as uuid } from 'uuid';
import { makeWorkspace } from 'src/test/factories/make-workspace';
import { WorkspaceNotExistsError } from './errors/workspace-not-exists-error';

describe('Get workspace use case', () => {
  let sut: GetWorkspaceUseCase;
  let workspaceRepository: WorkspaceRepository;
  let workspace: Workspace;

  beforeEach(async () => {
    workspaceRepository = new InMemoryWorkspaceRepository();
    sut = new GetWorkspaceUseCase(workspaceRepository);
    const workspaceData = makeWorkspace();
    workspace = await workspaceRepository.create({
      name: workspaceData.name,
      ownerId: uuid()
    });
  });

  it('should return requested workspace', async () => {
    const result = await sut.execute(workspace.getId());
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const returnedWorkspace = result.value;
      expect(returnedWorkspace).toEqual(workspace);
    }
  });

  it('should check if workspace exists', async () => {
    const result = await sut.execute(uuid());
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(WorkspaceNotExistsError);
    }
  });
});
