import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GetUserUseCase } from 'src/application/use-cases/user/get-user-use-case';
import { UserAuthenticationGuard } from 'src/infra/guards/user-authentication.guard';
import { UserPresenter } from 'src/presentation/presenters/user-presenter';

@Controller('users/basic')
export class GetUserBasicInfoController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}
  @UseGuards(UserAuthenticationGuard)
  @Get(':id')
  async create(@Param('id') userId: string) {
    const result = await this.getUserUseCase.execute({ userId });
    if (result.isLeft()) {
      const error = result.value;
      throw new NotFoundException({
        message: error.message,
        code: 'USER_NOT_EXISTS',
      });
    }
    return UserPresenter.toBasic(result.value);
  }
}
