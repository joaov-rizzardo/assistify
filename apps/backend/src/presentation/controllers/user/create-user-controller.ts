import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/user/create-user-use-case';
import { UserPresenter } from '../../presenters/user-presenter';
import { CreateUserDTO } from 'src/application/core/dtos/user/create-user-dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({
    status: 409,
    description: 'User already exists with this email'
  })
  @Post()
  async create(@Body() { name, email, lastName, password }: CreateUserDTO) {
    const result = await this.createUserUseCase.execute({
      name,
      email,
      lastName,
      password
    });
    if (result.isLeft()) {
      const error = result.value;
      throw new ConflictException(error.message);
    }
    const user = result.value;
    return UserPresenter.toHTTP(user);
  }
}
