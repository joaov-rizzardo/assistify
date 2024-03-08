import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserAuthenticationGuard } from 'src/infra/guards/user-authentication.guard';
import { WorkspacePresenter } from '../../presenters/workspace-presenter';
import { GetWorkspaceUseCase } from 'src/application/use-cases/workspaces/get-workspace-use-case';

@UseGuards(UserAuthenticationGuard)
@Controller('workspaces/basic')
export class GetWorkspaceBasicInfoController {
  constructor(private readonly getWorkspaceUseCase: GetWorkspaceUseCase) {}

  @Get(':id')
  async create(@Param('id') workspaceId: string) {
    const result = await this.getWorkspaceUseCase.execute(workspaceId);
    if (result.isLeft()) {
      const error = result.value;
      throw new NotFoundException({
        message: error.message,
        code: 'WORKSPACE_NOT_EXISTS',
      });
    }
    return WorkspacePresenter.toBasic(result.value);
  }
}
