import {
  WorkspaceMember,
  WorkspaceMemberRoles,
} from 'src/application/core/entities/workspace-member';
import {
  AddMemberProps,
  WorkspaceMembersRepository,
} from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { PrismaProvider } from '../prisma-provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaWorkspaceMembersRepository
  implements WorkspaceMembersRepository
{
  constructor(private readonly prisma: PrismaProvider) {}

  async add({
    userId,
    role,
    status,
    workspaceId,
  }: AddMemberProps): Promise<WorkspaceMember> {
    const member = await this.prisma.client.workspaceMember.create({
      data: {
        user_id: userId,
        role,
        status,
        workspace_id: workspaceId,
      },
    });
    return new WorkspaceMember({
      userId: member.user_id,
      workspaceId: member.workspace_id,
      role: member.role,
      status: member.status,
      createdAt: member.created_at,
      updatedAt: member.updated_at,
    });
  }

  async findWorkspaceMember(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceMember> {
    const member = await this.prisma.client.workspaceMember.findFirst({
      where: {
        workspace_id: workspaceId,
        user_id: userId,
      },
    });
    return member
      ? new WorkspaceMember({
          userId: member.user_id,
          workspaceId: member.workspace_id,
          role: member.role,
          status: member.status,
          createdAt: member.created_at,
          updatedAt: member.updated_at,
        })
      : null;
  }

  async findUserWorkspaces(userId: string): Promise<WorkspaceMember[]> {
    const members = await this.prisma.client.workspaceMember.findMany({
      where: { user_id: userId, status: 'accepted' },
    });
    return members.map(
      (member) =>
        new WorkspaceMember({
          userId: member.user_id,
          workspaceId: member.workspace_id,
          role: member.role,
          status: member.status,
          createdAt: member.created_at,
          updatedAt: member.updated_at,
        }),
    );
  }

  async remove(userId: string, workspaceId: string): Promise<void> {
    await this.prisma.client.workspaceMember.deleteMany({
      where: {
        user_id: userId,
        workspace_id: workspaceId,
      },
    });
  }

  async changeMemberRole(
    userId: string,
    workspaceId: string,
    role: WorkspaceMemberRoles,
  ): Promise<WorkspaceMember> {
    if (
      (await this.prisma.client.workspaceMember.count({
        where: {
          workspace_id: workspaceId,
          user_id: userId,
        },
      })) === 0
    ) {
      return null;
    }
    const updatedMember = await this.prisma.client.workspaceMember.update({
      data: {
        role,
      },
      where: {
        user_id_workspace_id: {
          user_id: userId,
          workspace_id: workspaceId,
        },
      },
    });
    return new WorkspaceMember({
      userId: updatedMember.user_id,
      workspaceId: updatedMember.workspace_id,
      role: updatedMember.role,
      status: updatedMember.status,
      createdAt: updatedMember.created_at,
      updatedAt: updatedMember.updated_at,
    });
  }
}
