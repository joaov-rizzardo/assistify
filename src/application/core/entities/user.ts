export class User {
  constructor(
    private id: string,
    private name: string,
    private lastName: string,
    private email: string,
    private password: string,
    private profilePicture: string,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getLastName() {
    return this.lastName;
  }

  public getEmail() {
    return this.email;
  }

  public getPassword() {
    return this.password;
  }

  public getProfilePicture() {
    return this.profilePicture;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }
}
