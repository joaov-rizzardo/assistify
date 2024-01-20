import { Injectable } from '@nestjs/common';
import { Workspace } from 'src/application/core/entities/workspace';
import {
  CreateWorkspaceProps,
  WorkspaceRepository,
} from 'src/application/core/interfaces/repositories/workspace-repository';
import { PrismaProvider } from '../prisma-provider';

@Injectable()
export class PrismaWorkspaceRepository implements WorkspaceRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create({ name, ownerId }: CreateWorkspaceProps): Promise<Workspace> {
    const workspace = await this.prisma.client.workspaces.create({
      data: { name, owner_id: ownerId },
    });
    return new Workspace({
      id: workspace.id,
      ownerId: workspace.owner_id,
      name: workspace.name,
      createdAt: workspace.created_at,
      updatedAt: workspace.updated_at,
    });
  }

  async findById(workspaceId: string): Promise<Workspace> {
    const workspace = await this.prisma.client.workspaces.findFirst({
      where: { id: workspaceId },
    });
    return workspace
      ? new Workspace({
          id: workspace.id,
          ownerId: workspace.owner_id,
          name: workspace.name,
          createdAt: workspace.created_at,
          updatedAt: workspace.updated_at,
        })
      : null;
  }
}
