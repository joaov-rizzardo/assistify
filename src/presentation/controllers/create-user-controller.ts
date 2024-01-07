import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/application/core/dtos/create-user-dto';

@Controller('users')
export class CreateUserController {
  @Post()
  async create(@Body() { name, email, lastName, password }: CreateUserDTO) {
    return 'Hello world';
  }
}
