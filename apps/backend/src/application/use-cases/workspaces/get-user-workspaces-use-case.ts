import { Injectable } from '@nestjs/common';
import { Workspace } from 'src/application/core/entities/workspace';
import { WorkspaceMember } from 'src/application/core/entities/workspace-member';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';

type GetUserWorkspacesUseCaseResponse = {
  info: Workspace;
  member: WorkspaceMember;
}[];

@Injectable()
export class GetUserWorkspacesUseCase {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMembersRepository: WorkspaceMembersRepository
  ) {}

  async execute(userId: string): Promise<GetUserWorkspacesUseCaseResponse> {
    const workspaceMembers = await this.workspaceMembersRepository.findUserWorkspaces(userId);
    return await Promise.all(
      workspaceMembers.map(async (member) => {
        return {
          info: (await this.workspaceRepository.findById(member.getWorkspaceId())) as Workspace,
          member: member
        };
      })
    );
  }
}
