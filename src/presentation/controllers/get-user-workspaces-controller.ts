import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  UserAuthenticationGuard,
  UserRequest,
} from 'src/infra/guards/user-authentication.guard';
import { WorkspacePresenter } from '../presenters/workspace-presenter';
import { GetUserWorkspacesUseCase } from 'src/application/use-cases/workspaces/get-user-workspaces-use-case';
import { WorkspaceMemberPresenter } from '../presenters/workspace-member-presenter';

@UseGuards(UserAuthenticationGuard)
@Controller('workspaces')
export class GetUserWorkspacesController {
  constructor(
    private readonly getUserWorkspacesUseCase: GetUserWorkspacesUseCase,
  ) {}

  @Get()
  async create(@Req() req: UserRequest) {
    const userId = req.userId;
    const result = await this.getUserWorkspacesUseCase.execute(userId);
    if (result.isLeft()) {
      throw new NotFoundException('User not found');
    }
    const workspaces = result.value;
    return workspaces.map((workspace) => ({
      info: WorkspacePresenter.toHTTP(workspace.info),
      member: WorkspaceMemberPresenter.toHTTP(workspace.member),
    }));
  }
}
