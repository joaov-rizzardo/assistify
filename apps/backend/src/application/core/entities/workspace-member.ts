export type WorkspaceMemberRoles = 'owner' | 'admin' | 'moderator' | 'editor' | 'member';

export type WorkspaceMemberStatus = 'invited' | 'accepted';

export interface WorkspaceMemberContructorProps {
  userId: string;
  workspaceId: string;
  role: WorkspaceMemberRoles;
  status: WorkspaceMemberStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class WorkspaceMember {
  private userId: string;
  private workspaceId: string;
  private role: WorkspaceMemberRoles;
  private status: WorkspaceMemberStatus;
  private createdAt: Date;
  private updatedAt: Date;

  constructor({ userId, workspaceId, role, status, createdAt, updatedAt }: WorkspaceMemberContructorProps) {
    this.userId = userId;
    this.workspaceId = workspaceId;
    this.role = role;
    this.status = status;
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

  public getStatus() {
    return this.status;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }
}
