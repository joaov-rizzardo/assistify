import { Injectable } from '@nestjs/common';
import { Workspace } from 'src/application/core/entities/workspace';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { RunTransactionOperation } from 'src/application/core/interfaces/database/run-transaction-operation';

type CreateWorkspaceUseCaseResponse = Workspace;

export interface CreateWorkspaceUseCaseProps {
  name: string;
  userId: string;
}

@Injectable()
export class CreateWorkspaceUseCase {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMembersRepository: WorkspaceMembersRepository,
    private readonly runTransactionOperation: RunTransactionOperation
  ) {}

  async execute({ name, userId }: CreateWorkspaceUseCaseProps): Promise<CreateWorkspaceUseCaseResponse> {
    const workspace = await this.runTransactionOperation.execute<Workspace>(async () => {
      const workspace = await this.workspaceRepository.create({
        name,
        ownerId: userId
      });
      await this.workspaceMembersRepository.add({
        workspaceId: workspace.getId(),
        userId,
        role: 'owner',
        status: 'accepted'
      });
      return workspace;
    });
    return workspace;
  }
}
