import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserUseCase } from 'src/application/use-cases/user/get-user-use-case';
import { UserAuthenticationGuard } from 'src/infra/guards/user-authentication.guard';
import { UserPresenter } from 'src/presentation/presenters/user-presenter';

@ApiTags('Users')
@Controller('users/basic')
export class GetUserBasicInfoController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 401,
    description: 'User is not authorized to access this resource'
  })
  @UseGuards(UserAuthenticationGuard)
  @Get(':id')
  async create(@Param('id') userId: string) {
    const result = await this.getUserUseCase.execute({ userId });
    if (result.isLeft()) {
      const error = result.value;
      throw new NotFoundException({
        message: error.message,
        code: 'USER_NOT_EXISTS'
      });
    }
    return UserPresenter.toBasic(result.value);
  }
}
