export class Workspace {
  constructor(
    private id: string,
    private name: string,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }
}
