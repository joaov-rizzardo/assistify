import { WorkspaceMember, WorkspaceMemberRoles, WorkspaceMemberStatus } from '../../entities/workspace-member';

export interface AddMemberProps {
  workspaceId: string;
  userId: string;
  role: WorkspaceMemberRoles;
  status: WorkspaceMemberStatus;
}

export abstract class WorkspaceMembersRepository {
  abstract add(args: AddMemberProps): Promise<WorkspaceMember>;
  abstract findWorkspaceMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null>;
  abstract checkIfMemberExists(workspaceId: string, userId: string): Promise<boolean> | boolean;
  abstract findUserWorkspaces(userId: string): Promise<WorkspaceMember[]>;
  abstract remove(userId: string, workspaceId: string): Promise<void>;
  abstract changeMemberRole(userId: string, workspaceId: string, role: WorkspaceMemberRoles): Promise<WorkspaceMember | null>;
  abstract changeMemberStatus(
    userId: string,
    workspaceId: string,
    status: WorkspaceMemberStatus
  ): null | WorkspaceMember | Promise<WorkspaceMember | null>;
}
