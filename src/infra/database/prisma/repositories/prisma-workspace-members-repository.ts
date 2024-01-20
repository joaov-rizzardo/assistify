import { WorkspaceMember } from 'src/application/core/entities/workspace-member';
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
    workspaceId,
  }: AddMemberProps): Promise<WorkspaceMember> {
    const member = await this.prisma.client.workspaceMember.create({
      data: {
        user_id: userId,
        role,
        workspace_id: workspaceId,
      },
    });
    return new WorkspaceMember({
      userId: member.user_id,
      workspaceId: member.workspace_id,
      role: member.role,
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
    return new WorkspaceMember({
      userId: member.user_id,
      workspaceId: member.workspace_id,
      role: member.role,
      createdAt: member.created_at,
      updatedAt: member.updated_at,
    });
  }

  async findUserWorkspaces(userId: string): Promise<WorkspaceMember[]> {
    const members = await this.prisma.client.workspaceMember.findMany({
      where: { user_id: userId },
    });
    return members.map(
      (member) =>
        new WorkspaceMember({
          userId: member.user_id,
          workspaceId: member.workspace_id,
          role: member.role,
          createdAt: member.created_at,
          updatedAt: member.updated_at,
        }),
    );
  }
}
