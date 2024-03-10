import { User } from 'src/application/core/entities/user';
import { makeUser } from 'src/test/factories/make-user';
import { v4 as uuid } from 'uuid';
import { UserPresenter } from './user-presenter';

describe('User presenter', () => {
  let user: User;

  beforeEach(() => {
    const { name, lastName, email, password } = makeUser();
    user = new User({
      id: uuid(),
      name,
      lastName,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
      profilePicture: '',
    });
  });

  it('should present user to http', () => {
    const data = UserPresenter.toHTTP(user);
    expect(data.name).toBe(user.getName());
    expect(data.lastName).toBe(user.getLastName());
    expect(data.email).toBe(user.getEmail());
    expect(data.id).toBe(user.getId());
    expect(data.profilePicture).toBe(user.getProfilePicture());
    expect(data.createdAt).toBe(user.getCreatedAt());
    expect(data.updatedAt).toBe(user.getUpdatedAt());
  });

  it('should present user to basic', () => {
    const data = UserPresenter.toBasic(user);
    expect(data.name).toBe(user.getName());
    expect(data.lastName).toBe(user.getLastName());
    expect(data.profilePicture).toBe(user.getProfilePicture());
    expect(data.id).toBe(user.getId());
  });
});
