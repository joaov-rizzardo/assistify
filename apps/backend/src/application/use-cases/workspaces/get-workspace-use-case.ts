import { Injectable } from '@nestjs/common';
import { Workspace } from 'src/application/core/entities/workspace';
import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { Either, left, right } from 'src/application/errors/either';
import { WorkspaceNotExistsError } from './errors/workspace-not-exists-error';

export type GetWorkspaceUseCaseResponse = Either<WorkspaceNotExistsError, Workspace>;

@Injectable()
export class GetWorkspaceUseCase {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceId: string): Promise<GetWorkspaceUseCaseResponse> {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) return left(new WorkspaceNotExistsError(workspaceId));
    return right(workspace);
  }
}
