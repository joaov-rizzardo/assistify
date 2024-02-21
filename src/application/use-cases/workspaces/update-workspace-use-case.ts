import { Injectable } from '@nestjs/common';
import { Workspace } from 'src/application/core/entities/workspace';
import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { Either, left, right } from 'src/application/errors/either';
import { WorkspaceNotExistsError } from './errors/workspace-not-exists-error';
import { UpdateWorkspaceDTO } from 'src/application/core/dtos/workspace/update-workspace-dto';

export type UpdateWorkspaceUseCaseResponse = Either<
  WorkspaceNotExistsError,
  Workspace
>;

@Injectable()
export class UpdateWorkspaceUseCase {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}
  async execute(
    workspaceId: string,
    args: Partial<UpdateWorkspaceDTO>,
  ): Promise<UpdateWorkspaceUseCaseResponse> {
    const updatedWorkspace = await this.workspaceRepository.update(
      workspaceId,
      args,
    );
    if (!updatedWorkspace) {
      return left(new WorkspaceNotExistsError(workspaceId));
    }
    return right(updatedWorkspace);
  }
}
