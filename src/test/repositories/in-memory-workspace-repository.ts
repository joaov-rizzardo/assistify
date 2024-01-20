import { Workspace } from 'src/application/core/entities/workspace';
import {
  CreateWorkspaceProps,
  WorkspaceRepository,
} from 'src/application/core/interfaces/repositories/workspace-repository';
import { v4 as uuid } from 'uuid';

export class InMemoryWorkspaceRepository implements WorkspaceRepository {
  private workspaces: Workspace[] = [];

  async create({ name, ownerId }: CreateWorkspaceProps): Promise<Workspace> {
    const workspace = new Workspace({
      id: uuid(),
      name: name,
      ownerId: ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.workspaces.push(workspace);
    return workspace;
  }

  async findById(workspaceId: string): Promise<Workspace> {
    const workspace = this.workspaces.find(
      (workspace) => workspace.getId() === workspaceId,
    );
    return workspace || null;
  }
}
