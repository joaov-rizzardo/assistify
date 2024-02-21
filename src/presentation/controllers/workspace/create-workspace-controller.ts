import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateWorkspaceUseCase } from 'src/application/use-cases/workspaces/create-workspace-use-case';
import {
  UserAuthenticationGuard,
  UserRequest,
} from 'src/infra/guards/user-authentication.guard';
import { WorkspacePresenter } from '../../presenters/workspace-presenter';
import { CreateWorkspaceDTO } from 'src/application/core/dtos/workspace/create-workspace-dto';

@UseGuards(UserAuthenticationGuard)
@Controller('workspaces')
export class CreateWorkspaceController {
  constructor(
    private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
  ) {}

  @Post('create')
  async create(@Body() { name }: CreateWorkspaceDTO, @Req() req: UserRequest) {
    const workspace = await this.createWorkspaceUseCase.execute({
      name,
      userId: req.userId,
    });
    return WorkspacePresenter.toHTTP(workspace);
  }
}
