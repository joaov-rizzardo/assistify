import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticateUserDTO } from 'src/application/core/dtos/authentication/authenticate-user-dto';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authentication/authenticate-user-use-case';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticateUserController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @Post('authenticate')
  @HttpCode(200)
  async handle(@Body() { email, password }: AuthenticateUserDTO) {
    const result = await this.authenticateUserUseCase.execute({
      email,
      password,
    });
    if (result.isLeft()) {
      const error = result.value;
      throw new BadRequestException({
        message: error.message,
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
