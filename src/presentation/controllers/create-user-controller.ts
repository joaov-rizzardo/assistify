import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/application/core/dtos/create-user-dto';
import { CreateUserUseCase } from 'src/application/use-cases/user/create-user-use-case';
import { UserPresenter } from '../presenters/user-presenter';

@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}
  @Post()
  async create(@Body() { name, email, lastName, password }: CreateUserDTO) {
    const result = await this.createUserUseCase.execute({
      name,
      email,
      lastName,
      password,
    });
    if (result.isLeft()) {
      throw new ConflictException();
    }
    const user = result.value;
    return UserPresenter.toHTTP(user);
  }
}
