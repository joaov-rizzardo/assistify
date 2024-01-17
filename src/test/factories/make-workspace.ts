import { faker } from '@faker-js/faker';

export function makeWorkspace() {
  return {
    name: faker.company.name(),
  };
}
