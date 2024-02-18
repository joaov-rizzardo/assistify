import { WorkspaceMember } from 'src/application/core/entities/workspace-member';
import {
  AddMemberProps,
  WorkspaceMembersRepository,
} from 'src/application/core/interfaces/repositories/workspace-members-repository';

export class InMemoryWorkspaceMembersRepository
  implements WorkspaceMembersRepository
{
  private workspaceMembers: WorkspaceMember[] = [];

  async add({
    userId,
    role,
    workspaceId,
  }: AddMemberProps): Promise<WorkspaceMember> {
    const workspaceMember = new WorkspaceMember({
      userId,
      role,
      workspaceId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.workspaceMembers.push(workspaceMember);
    return workspaceMember;
  }

  async findWorkspaceMember(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceMember> {
    const workspaceMember = this.workspaceMembers.find(
      (workspace) =>
        workspace.getWorkspaceId() === workspaceId &&
        workspace.getUserId() === userId,
    );
    return workspaceMember || null;
  }

  async findUserWorkspaces(userId: string): Promise<WorkspaceMember[]> {
    const workspaces = await this.workspaceMembers.filter(
      (workspace) => workspace.getUserId() === userId,
    );
    return workspaces;
  }

  async remove(userId: string, workspaceId: string): Promise<void> {
    this.workspaceMembers.filter(
      (member) =>
        member.getUserId() !== userId &&
        member.getWorkspaceId() !== workspaceId,
    );
  }
}
