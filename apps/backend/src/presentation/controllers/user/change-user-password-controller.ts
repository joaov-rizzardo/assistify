import { BadRequestException, Body, Controller, NotFoundException, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangeUserPasswordDTO } from 'src/application/core/dtos/user/change-user-password-dto';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';
import { ChangeUserPasswordUseCase } from 'src/application/use-cases/user/change-user-password-use-case';
import { IncorrectUserPasswordError } from 'src/application/use-cases/user/errors/incorrect-user-password-error';
import { UserAuthenticationGuard, UserRequest } from 'src/infra/guards/user-authentication.guard';

@ApiTags('Users')
@Controller('users')
export class ChangeUserPasswordController {
  constructor(private readonly changeUserPasswordUseCase: ChangeUserPasswordUseCase) {}

  @ApiResponse({ status: 400, description: 'Incorrect current password' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 200, description: 'Password successfully changed' })
  @UseGuards(UserAuthenticationGuard)
  @ApiBearerAuth()
  @Patch('/password')
  async handle(@Body() { currentPassword, newPassword }: ChangeUserPasswordDTO, @Req() req: UserRequest) {
    const result = await this.changeUserPasswordUseCase.execute({
      currentPassword,
      newPassword,
      userId: req.userId
    });
    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof UserNotExistsError) {
        throw new NotFoundException({
          code: 'USER_NOT_EXISTS',
          message: error.message
        });
      }
      if (error instanceof IncorrectUserPasswordError) {
        throw new BadRequestException({
          code: 'INCORRECT_USER_PASSWORD',
          message: error.message
        });
      }
      throw new Error(result.value.message);
    }
    if (result.isRight()) {
      return {
        code: 'PASSWORD_CHANGED',
        message: 'Password has been changed successfully'
      };
    }
  }
}
