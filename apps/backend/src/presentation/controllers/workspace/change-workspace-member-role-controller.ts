import { BadRequestException, Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangeWorkspaceMemberRoleDTO } from 'src/application/core/dtos/workspace/change-workspace-member-role-dto';
import { ChangeWorkspaceMemberRoleUseCase } from 'src/application/use-cases/workspaces/change-workspace-member-role-use-case';
import { CannotChangeMemberRoleToOwnerError } from 'src/application/use-cases/workspaces/errors/cannot-change-member-role-to-owner-error';
import { UserIsNotMemberFromWorkspaceError } from 'src/application/use-cases/workspaces/errors/user-is-not-member-from-workspace-error';
import { Roles } from 'src/infra/guards/roles';
import { WorkspaceAuthenticationGuard, WorkspaceRequest } from 'src/infra/guards/workspace-authentication.guard';
import { WorkspaceMemberPresenter } from 'src/presentation/presenters/workspace-member-presenter';

@ApiTags('Workspaces')
@Controller('workspaces/member')
export class ChangeWorkspaceMemberRoleController {
  constructor(private readonly changeWorkspaceMemberRoleUseCase: ChangeWorkspaceMemberRoleUseCase) {}

  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-workspace',
    description: 'Workspace ID',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Response when workspace member role was changed successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request error'
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authorized to access this resource'
  })
  @Roles(['owner', 'admin'])
  @UseGuards(WorkspaceAuthenticationGuard)
  @Patch('/change-role/:userId')
  async changeRole(@Body() { role }: ChangeWorkspaceMemberRoleDTO, @Param('userId') userId: string, @Req() req: WorkspaceRequest) {
    const workspace = req.workspace.id;
    const result = await this.changeWorkspaceMemberRoleUseCase.execute(workspace, userId, role);
    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof UserIsNotMemberFromWorkspaceError) {
        throw new BadRequestException({
          message: error.message,
          code: 'USER_IS_NOT_WORKSPACE_MEMBER'
        });
      }
      if (error instanceof CannotChangeMemberRoleToOwnerError) {
        throw new BadRequestException({
          message: error.message,
          code: 'CANNOT_CHANGE_MEMBER_ROLE_TO_OWNER'
        });
      }
    }
    if (result.isRight()) {
      const member = result.value;
      return WorkspaceMemberPresenter.toHTTP(member);
    }
  }
}
