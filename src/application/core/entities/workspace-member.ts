export interface WorkspaceMemberContructorProps {
  userId: string;
  workspaceId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WorkspaceMember {
  private userId: string;
  private workspaceId: string;
  private role: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor({
    userId,
    workspaceId,
    role,
    createdAt,
    updatedAt,
  }: WorkspaceMemberContructorProps) {
    this.userId = userId;
    this.workspaceId = workspaceId;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getUserId() {
    return this.userId;
  }

  public getWorkspaceId() {
    return this.workspaceId;
  }

  public getRole() {
    return this.role;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }
}
