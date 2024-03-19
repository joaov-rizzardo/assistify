import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CannotRemoveOwnerFromWorkspaceError } from 'src/application/use-cases/workspaces/errors/cannot-remove-owner-from-workspace-error';
import { UserIsNotMemberFromWorkspaceError } from 'src/application/use-cases/workspaces/errors/user-is-not-member-from-workspace-error';
import { RemoveWorkspaceMemberUseCase } from 'src/application/use-cases/workspaces/remove-workspace-member-use-case';
import { Roles } from 'src/infra/guards/roles';
import {
  WorkspaceAuthenticationGuard,
  WorkspaceRequest,
} from 'src/infra/guards/workspace-authentication.guard';

@ApiTags('Workspaces')
@Controller('workspaces/member')
export class RemoveWorkspaceMemberController {
  constructor(
    private readonly removeWorkspaceMemberUseCase: RemoveWorkspaceMemberUseCase,
  ) {}

  @ApiHeader({
    name: 'x-workspace',
    description: 'Workspace ID',
    required: true,
  })
  @ApiBearerAuth()
  @Roles(['owner', 'admin'])
  @ApiResponse({
    status: 200,
    description: 'Response when workspace member was removed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request error',
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authorized to access this resource',
  })
  @UseGuards(WorkspaceAuthenticationGuard)
  @Delete('/remove/:userId')
  async remove(
    @Param('userId') userId: string,
    @Req() request: WorkspaceRequest,
  ) {
    const workspaceId = request.workspace.id;
    const result = await this.removeWorkspaceMemberUseCase.execute(
      workspaceId,
      userId,
    );
    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof CannotRemoveOwnerFromWorkspaceError) {
        throw new BadRequestException({
          message: 'Cannot remove owner from workspace',
          code: 'CANNOT_REMOVE_OWNER',
        });
      }
      if (error instanceof UserIsNotMemberFromWorkspaceError) {
        throw new BadRequestException({
          message: "User isn't a workspace member",
          code: 'USER_IS_NOT_WORKSPACE_MEMBER',
        });
      }
    }
    return {
      message: 'Member has been removed from workspace',
    };
  }
}
