import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Workspace } from 'src/application/core/entities/workspace';
import { PrismaProvider } from 'src/infra/database/prisma/prisma-provider';

interface MakeWorkspaceType {
  name: string;
}

export function makeWorkspace(): MakeWorkspaceType {
  return {
    name: faker.company.name(),
  };
}

@Injectable()
export class WorkspaceFactory {
  constructor(private prisma: PrismaProvider) {}

  async makePrismaWorkspace(userId: string, args?: MakeWorkspaceType) {
    const { name } = args || makeWorkspace();

    const createdWorkspace = await this.prisma.client.workspaces.create({
      data: {
        name: name,
        owner_id: userId,
      },
    });

    return new Workspace({
      id: createdWorkspace.id,
      ownerId: createdWorkspace.owner_id,
      name: createdWorkspace.name,
      createdAt: createdWorkspace.created_at,
      updatedAt: createdWorkspace.updated_at,
    });
  }
}
