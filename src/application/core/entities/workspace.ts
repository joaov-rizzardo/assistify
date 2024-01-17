export interface WorkspaceConstructorProps {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Workspace {
  private id: string;
  private name: string;
  private ownerId: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor({
    name,
    id,
    ownerId,
    createdAt,
    updatedAt,
  }: WorkspaceConstructorProps) {
    this.id = id;
    this.name = name;
    this.ownerId = ownerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getOwnerId() {
    return this.ownerId;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }
}
