import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { User } from 'src/application/core/entities/user';
import { PrismaProvider } from 'src/infra/database/prisma/prisma-provider';

interface MakeUserType {
  name: string;
  lastName: string;
  password: string;
  email: string;
}

export function makeUser(): MakeUserType {
  return {
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
    email: faker.internet.email()
  };
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaProvider) {}

  async makePrismaUser(args?: MakeUserType) {
    const { name, email, lastName, password } = args || makeUser();
    const createdUser = await this.prisma.client.users.create({
      data: {
        name: name,
        email: email,
        last_name: lastName,
        password: password
      }
    });

    return new User({
      id: createdUser.id,
      name: createdUser.name,
      lastName: createdUser.last_name,
      email: createdUser.email,
      password: createdUser.password,
      profilePicture: createdUser.profile_picture,
      createdAt: createdUser.created_at,
      updatedAt: createdUser.updated_at
    });
  }
}
