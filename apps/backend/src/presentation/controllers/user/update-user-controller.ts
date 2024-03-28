import { BadRequestException, Body, Controller, NotFoundException, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDTO } from 'src/application/core/dtos/user/update-user-dto';
import { FileNotExistsError } from 'src/application/errors/file-not-exists-error';
import { ProfilePictureIsNotImageError } from 'src/application/use-cases/user/errors/profile-picture-is-not-image-error';
import { UpdateUserUseCase } from 'src/application/use-cases/user/update-user-use-case';
import { UserAuthenticationGuard, UserRequest } from 'src/infra/guards/user-authentication.guard';
import { UserPresenter } from 'src/presentation/presenters/user-presenter';

@ApiTags('Users')
@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiResponse({ status: 400, description: 'Bad request arguments' })
  @ApiResponse({ status: 401, description: 'User is not authorized' })
  @UseGuards(UserAuthenticationGuard)
  @ApiBearerAuth()
  @Patch()
  async handle(@Body() body: UpdateUserDTO, @Req() req: UserRequest) {
    const result = await this.updateUserUseCase.execute(req.userId, body);
    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof FileNotExistsError) {
        throw new NotFoundException({
          code: 'FILE_NOT_FOUND',
          message: error.message
        });
      }
      if (error instanceof ProfilePictureIsNotImageError) {
        throw new BadRequestException({
          code: 'INVALID_FILE_TYPE',
          message: error.message
        });
      }
    }
    if (result.isRight()) {
      const user = result.value;
      return UserPresenter.toHTTP(user);
    }
  }
}
