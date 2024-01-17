import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkspaceDTO } from 'src/application/core/dtos/create-workspace-dto';
import { CreateWorkspaceUseCase } from 'src/application/use-cases/workspaces/create-workspace-use-case';
import {
  UserAuthenticationGuard,
  UserRequest,
} from 'src/infra/guards/user-authentication.guard';
import { WorkspacePresenter } from '../presenters/workspace-presenter';

@UseGuards(UserAuthenticationGuard)
@Controller('workspaces')
export class CreateWorkspaceController {
  constructor(
    private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
  ) {}

  @Post('create')
  async create(@Body() { name }: CreateWorkspaceDTO, @Req() req: UserRequest) {
    const result = await this.createWorkspaceUseCase.execute({
      name,
      userId: req.userId,
    });
    if (result.isLeft()) {
      throw new NotFoundException('User not found');
    }
    const workspace = result.value;
    return WorkspacePresenter.toHTTP(workspace);
  }
}
