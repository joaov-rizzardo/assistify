import { WorkspaceMember } from '../../entities/workspace-member';

export interface AddMemberProps {
  workspaceId: string;
  userId: string;
  role: string;
}

export abstract class WorkspaceMembersRepository {
  abstract add(args: AddMemberProps): Promise<WorkspaceMember>;
  abstract findWorkspaceMember(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceMember | null>;
  abstract findUserWorkspaces(userId: string): Promise<WorkspaceMember[]>;
}
