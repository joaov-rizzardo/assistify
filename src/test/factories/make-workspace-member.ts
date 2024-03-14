import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'src/infra/database/prisma/prisma-provider';
import {
  WorkspaceMember,
  WorkspaceMemberRoles,
} from 'src/application/core/entities/workspace-member';

type MakePrismaUserArgs = {
  role: WorkspaceMemberRoles;
  status: 'invited' | 'accepted';
};

@Injectable()
export class WorkspaceMemberFactory {
  constructor(private prisma: PrismaProvider) {}

  async makePrismaWorkspaceMember(
    workspaceId: string,
    userId: string,
    args: MakePrismaUserArgs,
  ) {
    const member = await this.prisma.client.workspaceMember.create({
      data: {
        role: args.role,
        status: args.status,
        user_id: userId,
        workspace_id: workspaceId,
      },
    });
    return new WorkspaceMember({
      userId: member.user_id,
      createdAt: member.created_at,
      role: member.role,
      status: member.status,
      updatedAt: member.updated_at,
      workspaceId: member.workspace_id,
    });
  }
}
