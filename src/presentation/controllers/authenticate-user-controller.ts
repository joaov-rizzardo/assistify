import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthenticateUserDTO } from 'src/application/core/dtos/authenticate-user-dto';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authentication/authenticate-user-use-case';

@Controller('auth')
export class AuthenticateUserController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}
  @Post('authenticate')
  async handle(@Body() { email, password }: AuthenticateUserDTO) {
    const result = await this.authenticateUserUseCase.execute({
      email,
      password,
    });
    if (result.isLeft()) {
      throw new UnauthorizedException();
    }
    const { accessToken, refreshToken } = result.value;
    return {
      accessToken,
      refreshToken,
    };
  }
}
