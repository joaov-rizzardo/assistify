import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { AuthenticateUserDTO } from 'src/application/core/dtos/authentication/authenticate-user-dto';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authentication/authenticate-user-use-case';

@Controller('auth')
export class AuthenticateUserController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}
  @Post('authenticate')
  @HttpCode(200)
  async handle(@Body() { email, password }: AuthenticateUserDTO) {
    const result = await this.authenticateUserUseCase.execute({
      email,
      password,
    });
    if (result.isLeft()) {
      throw new BadRequestException({
        message: 'Email or password is invalid',
        code: 'BAD_CREDENTIALS',
      });
    }
    const { accessToken, refreshToken } = result.value;
    return {
      accessToken,
      refreshToken,
    };
  }
}
