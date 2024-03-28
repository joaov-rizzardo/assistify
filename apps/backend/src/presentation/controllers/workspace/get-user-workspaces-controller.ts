import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserAuthenticationGuard, UserRequest } from 'src/infra/guards/user-authentication.guard';
import { WorkspacePresenter } from '../../presenters/workspace-presenter';
import { GetUserWorkspacesUseCase } from 'src/application/use-cases/workspaces/get-user-workspaces-use-case';
import { WorkspaceMemberPresenter } from '../../presenters/workspace-member-presenter';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Workspaces')
@UseGuards(UserAuthenticationGuard)
@Controller('workspaces')
export class GetUserWorkspacesController {
  constructor(private readonly getUserWorkspacesUseCase: GetUserWorkspacesUseCase) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User workspaces found successfully'
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authorized to access this resource'
  })
  @Get()
  async create(@Req() req: UserRequest) {
    const userId = req.userId;
    const workspaces = await this.getUserWorkspacesUseCase.execute(userId);
    return workspaces.map((workspace) => ({
      info: WorkspacePresenter.toHTTP(workspace.info),
      member: WorkspaceMemberPresenter.toHTTP(workspace.member)
    }));
  }
}
