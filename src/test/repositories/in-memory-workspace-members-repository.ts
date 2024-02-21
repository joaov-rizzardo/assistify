import {
  WorkspaceMember,
  WorkspaceMemberRoles,
} from 'src/application/core/entities/workspace-member';
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
    status,
    workspaceId,
  }: AddMemberProps): Promise<WorkspaceMember> {
    const workspaceMember = new WorkspaceMember({
      userId,
      role,
      status: status,
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

  async changeMemberRole(
    userId: string,
    workspaceId: string,
    role: WorkspaceMemberRoles,
  ): Promise<WorkspaceMember> {
    this.workspaceMembers = this.workspaceMembers.map((member) => {
      if (
        member.getUserId() === userId &&
        member.getWorkspaceId() === workspaceId
      ) {
        return new WorkspaceMember({
          workspaceId: member.getWorkspaceId(),
          userId: member.getUserId(),
          createdAt: member.getCreatedAt(),
          role: role,
          status: member.getStatus(),
          updatedAt: new Date(),
        });
      }
      return member;
    });
    return (
      this.workspaceMembers.find(
        (member) =>
          member.getUserId() === userId &&
          member.getWorkspaceId() === workspaceId,
      ) || null
    );
  }
}
