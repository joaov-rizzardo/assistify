import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  UserAuthenticationGuard,
  UserRequest,
} from './user-authentication.guard';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { Reflector } from '@nestjs/core';
import { WorkspaceMemberRoles } from 'src/application/core/entities/workspace-member';

export interface WorkspaceRequest extends UserRequest {
  workspace: {
    id: string;
    role: string;
  };
}

@Injectable()
export class WorkspaceAuthenticationGuard implements CanActivate {
  constructor(
    private readonly userAuthenticationGuard: UserAuthenticationGuard,
    private readonly workspaceMembersRepository: WorkspaceMembersRepository,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await this.userAuthenticationGuard.canActivate(context);
    const request = context.switchToHttp().getRequest<WorkspaceRequest>();
    const workspaceId = request.headers['x-workspace'] as string;
    if (!workspaceId) {
      throw new UnauthorizedException();
    }
    const workspaceMember =
      await this.workspaceMembersRepository.findWorkspaceMember(
        workspaceId,
        request.userId,
      );
    if (!workspaceMember) {
      throw new UnauthorizedException();
    }
    const roles = this.reflector.get<WorkspaceMemberRoles[]>(
      'roles',
      context.getHandler(),
    );
    if (roles && !roles.includes(workspaceMember.getRole())) {
      throw new UnauthorizedException();
    }
    request.workspace = {
      id: workspaceMember.getWorkspaceId(),
      role: workspaceMember.getRole(),
    };
    return true;
  }
}
