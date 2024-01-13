import { faker } from '@faker-js/faker';

export function makeUser() {
  return {
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
  };
}
