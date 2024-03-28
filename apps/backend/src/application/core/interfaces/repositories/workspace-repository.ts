import { UpdateWorkspaceDTO } from '../../dtos/workspace/update-workspace-dto';
import { Workspace } from '../../entities/workspace';

export interface CreateWorkspaceProps {
  name: string;
  ownerId: string;
}
export abstract class WorkspaceRepository {
  abstract create(args: CreateWorkspaceProps): Promise<Workspace>;
  abstract findById(workspaceId: string): Promise<Workspace | null> | Workspace | null;
  abstract update(workspaceId: string, args: Partial<UpdateWorkspaceDTO>): Promise<Workspace | null>;
}
