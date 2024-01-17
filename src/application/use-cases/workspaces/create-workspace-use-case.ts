import { Injectable } from '@nestjs/common';
import { Workspace } from 'src/application/core/entities/workspace';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { Either, left, right } from 'src/application/errors/either';
import { UserNotExistsError } from './errors/user-not-exists-error';

type CreateWorkspaceUseCaseResponse = Either<UserNotExistsError, Workspace>;

export interface CreateWorkspaceUseCaseProps {
  name: string;
  userId: string;
}

@Injectable()
export class CreateWorkspaceUseCase {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMembersRepository: WorkspaceMembersRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    name,
    userId,
  }: CreateWorkspaceUseCaseProps): Promise<CreateWorkspaceUseCaseResponse> {
    if ((await this.userRepository.checkIfUserExistsById(userId)) === false) {
      return left(new UserNotExistsError(userId));
    }
    const workspace = await this.workspaceRepository.create({
      name,
      ownerId: userId,
    });
    await this.workspaceMembersRepository.add({
      workspaceId: workspace.getId(),
      userId,
      role: 'owner',
    });
    return right(workspace);
  }
}
