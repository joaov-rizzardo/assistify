import { User } from 'src/application/core/entities/user';

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.getId(),
      name: user.getName(),
      lastName: user.getLastName(),
      email: user.getEmail(),
      profilePicture: user.getProfilePicture(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt()
    };
  }

  static toBasic(user: User) {
    return {
      id: user.getId(),
      name: user.getName(),
      lastName: user.getLastName(),
      profilePicture: user.getProfilePicture()
    };
  }
}
