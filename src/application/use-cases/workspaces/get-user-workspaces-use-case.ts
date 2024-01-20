import { Injectable } from '@nestjs/common';
import { Workspace } from 'src/application/core/entities/workspace';
import { WorkspaceMember } from 'src/application/core/entities/workspace-member';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { Either, left, right } from 'src/application/errors/either';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';

type GetUserWorkspacesUseCaseResponse = Either<
  UserNotExistsError,
  { info: Workspace; member: WorkspaceMember }[]
>;

@Injectable()
export class GetUserWorkspacesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMembersRepository: WorkspaceMembersRepository,
  ) {}

  async execute(userId: string): Promise<GetUserWorkspacesUseCaseResponse> {
    if ((await this.userRepository.checkIfUserExistsById(userId)) === false) {
      return left(new UserNotExistsError(userId));
    }
    const workspaceMembers =
      await this.workspaceMembersRepository.findUserWorkspaces(userId);
    return right(
      await Promise.all(
        workspaceMembers.map(async (member) => {
          return {
            info: (await this.workspaceRepository.findById(
              member.getWorkspaceId(),
            )) as Workspace,
            member: member,
          };
        }),
      ),
    );
  }
}
