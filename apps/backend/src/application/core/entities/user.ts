interface UserConstructorProps {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private id: string;
  private name: string;
  private lastName: string;
  private email: string;
  private password: string;
  private profilePicture?: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: UserConstructorProps) {
    this.id = props.id;
    this.name = props.name;
    this.lastName = props.lastName;
    this.email = props.email;
    this.password = props.password;
    this.profilePicture = props.profilePicture;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

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

  public toObject() {
    return {
      id: this.getId(),
      name: this.getName(),
      lastName: this.getLastName(),
      password: this.getPassword(),
      email: this.getEmail(),
      profilePicture: this.getProfilePicture(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt()
    };
  }
}
